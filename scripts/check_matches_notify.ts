import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";
import matchesData from "../data/matches.json" with { type: 'json' };
import dotenv from "dotenv";

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Must use Service Role Key for backend
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY!;

if (!supabaseUrl || !supabaseKey || !vapidPublicKey || !vapidPrivateKey) {
    console.error("Missing environment variables");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

webpush.setVapidDetails(
    "mailto:admin@canconnect.com",
    vapidPublicKey,
    vapidPrivateKey
);

async function checkMatchesAndNotify() {
    console.log("Checking for finished matches...");

    // Find finished matches that haven't had notifications sent yet
    const finishedMatches = matchesData.matches.filter(
        (match) => (match as any).status === "finished"
    );

    if (finishedMatches.length === 0) {
        console.log("No finished matches found.");
        return;
    }

    console.log(`Found ${finishedMatches.length} finished matches. Sending notifications...`);

    // Fetch all users with subscriptions
    const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, subscription")
        .not("subscription", "is", null);

    if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        return;
    }

    // Fetch already notified matches
    const { data: notifiedMatches, error: notifiedMatchesError } = await supabase
        .from("notified_matches")
        .select("match_id");

    if (notifiedMatchesError) {
        console.error("Error fetching notified matches:", notifiedMatchesError);
        return;
    }

    const notifiedMatchIds = new Set(notifiedMatches.map((m) => m.match_id));

    for (const match of finishedMatches) {
        if (notifiedMatchIds.has(match.id)) {
            continue; // Skip if notification already sent
        }

        const score = (match as any).score;
        const payload = JSON.stringify({
            title: "Match Terminé !",
            body: `${match.team1.name} ${score.team1} - ${score.team2} ${match.team2.name}`,
            url: `/matches`,
        });

        for (const profile of profiles) {
            if (profile.subscription) {
                try {
                    await webpush.sendNotification(profile.subscription, payload);
                    console.log(`Notification sent to user ${profile.id} for match ${match.id}`);
                } catch (err) {
                    console.error(`Error sending notification to user ${profile.id}:`, err);
                }
            }
        }

        // Add match to notified list
        const { error: insertError } = await supabase
            .from("notified_matches")
            .insert({ match_id: match.id });

        if (insertError) {
            console.error(`Error inserting notified match ${match.id}:`, insertError);
        }
    }
}

checkMatchesAndNotify();
