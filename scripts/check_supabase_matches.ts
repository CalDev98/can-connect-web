
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchMatches() {
    const { data, error } = await supabase.from("matches").select("*").limit(1);
    if (error) {
        console.error("Error fetching matches:", error);
    } else {
        console.log("Matches data sample:", JSON.stringify(data, null, 2));
    }
}

fetchMatches();
