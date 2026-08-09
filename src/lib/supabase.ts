import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("環境変数 VITE_SUPABASE_URL または VITE_SUPABASE_ANON_KEY が設定されていません。.envファイルを確認してください。");
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);