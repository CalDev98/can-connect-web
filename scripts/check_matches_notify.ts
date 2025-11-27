import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";
import matchesData from "../data/matches.json";
import dotenv from "dotenv";

dotenv.config();

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
    console.log("Checking for upcoming matches...");
    const now = new Date();
    const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000);

    // Find matches starting in ~3 hours (e.g., between 2h50m and 3h10m from now)
    // Note: This logic assumes matchesData.matches has date "YYYY-MM-DD" and time "HH:MM"
    const upcomingMatches = matchesData.matches.filter((match) => {
        const matchDateTime = new Date(`${match.date}T${match.time}:00`);
        const timeDiff = matchDateTime.getTime() - now.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        // Check if match is roughly 3 hours away (e.g., between 2.9 and 3.1 hours)
        return hoursDiff >= 2.9 && hoursDiff <= 3.1;
    });

    if (upcomingMatches.length === 0) {
        console.log("No matches found starting in ~3 hours.");
        return;
    }

    console.log(`Found ${upcomingMatches.length} upcoming matches. Sending notifications...`);

    // Fetch all users with subscriptions
    const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, subscription")
        .not("subscription", "is", null);

    if (error) {
        console.error("Error fetching profiles:", error);
        return;
    }

    for (const match of upcomingMatches) {
        const payload = JSON.stringify({
            title: "Match à venir !",
            body: `${match.team1.name} vs ${match.team2.name} commence dans 3 heures !`,
            url: `/matches`, // Or specific match URL if available
        });

        for (const profile of profiles) {
            if (profile.subscription) {
                try {
                    await webpush.sendNotification(profile.subscription, payload);
                    console.log(`Notification sent to user ${profile.id}`);
                } catch (err) {
                    console.error(`Error sending notification to user ${profile.id}:`, err);
                    // Optional: Remove invalid subscription from DB
                }
            }
        }
    }
}

checkMatchesAndNotify();
