import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { ScenarioReportListItem } from "./types";

// Supabaseから返る生データの型（このhook内だけで使う）
type RawRow = {
  id: string;
  date: string;
  title: string;
  endcard_url: string | null;
  scenarios: {
    title: string | null;
    genre: string | null;
  } | null;
};

export type ScenarioReportListEntry = ScenarioReportListItem & {
  // 日付が古い順に振った連番（表示は降順でも、番号は古い順=1から）
  number: number;
};

export function useScenarioReports() {
  const [reports, setReports] = useState<ScenarioReportListEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 種類=予定 / 分類=シナリオ / 担当=PL のスケジュールを
      // 日付の古い順に取得（連番を振るため昇順で取得する）
      const { data, error: supabaseError } = await supabase
        .from("schedules")
        .select(
          `
          id,
          date,
          title,
          endcard_url,
          scenarios (
            title,
            genre
          )
        `
        )
        .eq("type", "予定")
        .eq("category", "シナリオ")
        .eq("role", "PL")
        .order("date", { ascending: true })
        .order("created_at", { ascending: true })
        .returns<RawRow[]>();

      if (supabaseError) {
        throw supabaseError;
      }

      const rows = data ?? [];

      // 古い順に連番を振ってから、表示用に新しい順へ反転する
      const numbered: ScenarioReportListEntry[] = rows.map((row, index) => ({
        scheduleId: row.id,
        date: row.date,
        title: row.scenarios?.title ?? row.title,
        endcardUrl: row.endcard_url,
        genre: row.scenarios?.genre ?? null,
        number: index + 1,
      }));

      setReports(numbered.reverse());
    } catch (err) {
      console.error("Failed to fetch scenario reports:", err);
      setError(
        err instanceof Error ? err : new Error("通過報告データの取得に失敗しました")
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { reports, loading, error, refetch: fetchReports };
}
