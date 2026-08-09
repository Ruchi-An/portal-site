import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import type { Schedule } from "../types/schedule";

export function useSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from("schedules")
        .select(`
          *,
          games (
            genre,
            official_url
          ),
          scenarios (
            genre,
            official_url
          )
        `)
        .order("date", { ascending: true })
        .returns<Schedule[]>();

      if (supabaseError) {
        throw supabaseError;
      }

      setSchedules(data ?? []);
    } catch (err) {
      console.error("Failed to fetch schedules:", err);
      setError(err instanceof Error ? err : new Error("データの取得に失敗しました"));
    } finally {
      // 成功・失敗にかかわらずローディングを終了
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  return {
    schedules,
    loading,
    error,
    refetch: fetchSchedules, // 任意で手動リロードできるように提供
  };
}