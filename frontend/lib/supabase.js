import { createClient } from "@supabase/supabase-js";

// 🔑 CONFIG
const SUPABASE_URL = "https://fgaklfihzpkdbtrosrqe.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_qZyqRPkts9mEjUHotOscvA_ut3bAlF1";

// 🚀 CLIENT
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);