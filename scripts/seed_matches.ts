import { createClient } from "@supabase/supabase-js";
import matchesData from "../data/matches.json" with { type: 'json' };
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedMatches() {
  console.log("Seeding matches data...");

  const { matches } = matchesData;

  // Format data for Supabase
  const formattedMatches = matches.map((match) => ({
    id: match.id,
    date: match.date,
    time: match.time,
    team1: JSON.stringify(match.team1),
    team2: JSON.stringify(match.team2),
    stadium: JSON.stringify(match.stadium),
    group: (match as any).group,
    match_day: (match as any).match_day,
    stage: match.stage,
    status: (match as any).status || "scheduled",
    score: (match as any).score ? JSON.stringify((match as any).score) : null,
  }));

  // Upsert data into Supabase
  const { data, error } = await supabase.from("matches").upsert(formattedMatches);

  if (error) {
    console.error("Error seeding matches:", error);
  } else {
    console.log("Successfully seeded matches!");
  }
}

seedMatches();
