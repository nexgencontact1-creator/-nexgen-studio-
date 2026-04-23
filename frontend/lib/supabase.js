import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://fgaklfihzpkdbtrosrqe.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_qZyqRPkts9mEjUHotOsCvA_ut3bA1F1";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);