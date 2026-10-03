import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://utznnkwyejhycadbfquj.supabase.co";

const supabaseAnonKey =
  "sb_publishable_EquATp05mTSnc2JMJLu39g_zxwbNCJ7";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);