import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://imjhlpxqbexjbmbmaiql.supabase.co";
const supabaseAnonKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltamhscHhxYmV4amJtYm1haXFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MTM3OTYsImV4cCI6MjA5Mzk4OTc5Nn0.ZkfTFV1CcYv3q5MBviTpdhhnDtXw0xlifawsdJN8Sio";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);