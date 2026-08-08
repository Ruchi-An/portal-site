import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Schedule } from "../types/schedule";

export function useSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchedules() {
      const { data, error } = await supabase
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
        .order("date", { ascending: true });

      if (error) {
        console.error(error);
        return;
      }

      console.log(data);
      setSchedules(data ?? []);
      setLoading(false);
    }

    fetchSchedules();
  }, []);

  return {
    schedules,
    loading,
  };
}