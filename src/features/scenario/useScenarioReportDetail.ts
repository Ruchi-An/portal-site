import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { ScenarioReportDetail } from "./types";

type RawDetailRow = {
  id: string;
  date: string;
  time: string | null;
  memo: string | null;
  endcard_url: string | null;
  thumbnail_url: string | null;
  stream_url: string | null;
  scenarios: {
    title: string | null;
    genre: string | null;
    production: string | null;
    production_url: string | null;
    creator: string | null;
    creator_url: string | null;
    credit: string | null;
    synopsis: string | null;
    summary: string | null;
    official_url: string | null;
    trailer_url: string | null;
    scenario_tag: string | null;
    character_disclosure: string | null;
  } | null;
  schedule_participants: {
    id: string;
    role: string | null;
    profile_id: string | null;
    profiles: {
      id: string;
      name: string | null;
      icon_url: string | null;
    } | null;
    scenario_characters: {
      id: string;
      character_name: string | null;
      character_number: number | null;
      type: string | null;
    } | null;
  }[];
};

// character_disclosure がこの値のときは、役名を伏せてネタバレを防ぐ
const HIDDEN_DISCLOSURE_VALUES = new Set(["非公開", "秘匿"]);

export function useScenarioReportDetail(scheduleId: string | undefined) {
  const [detail, setDetail] = useState<ScenarioReportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!scheduleId) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from("schedules")
        .select(
          `
          id,
          date,
          time,
          memo,
          endcard_url,
          thumbnail_url,
          stream_url,
          scenarios (
            title,
            genre,
            production,
            production_url,
            creator,
            creator_url,
            credit,
            synopsis,
            summary,
            official_url,
            trailer_url,
            scenario_tag,
            character_disclosure
          ),
          schedule_participants (
            id,
            role,
            profile_id,
            profiles (
              id,
              name,
              icon_url
            ),
            scenario_characters (
              id,
              character_name,
              character_number,
              type
            )
          )
        `
        )
        .eq("id", scheduleId)
        .single()
        .returns<RawDetailRow>();

      if (supabaseError) {
        throw supabaseError;
      }

      const isHidden = data.scenarios?.character_disclosure
        ? HIDDEN_DISCLOSURE_VALUES.has(data.scenarios.character_disclosure)
        : false;

      const cast = (data.schedule_participants ?? [])
        .map((p) => ({
          participantId: p.id,
          profileId: p.profile_id,
          profileName: p.profiles?.name ?? "名前非公開",
          profileIconUrl: p.profiles?.icon_url ?? null,
          role: p.role,
          characterName: isHidden ? null : p.scenario_characters?.character_name ?? null,
          characterType: isHidden ? null : p.scenario_characters?.type ?? null,
          characterNumber: isHidden ? null : p.scenario_characters?.character_number ?? null,
        }))
        // PC/HO番号順 → 番号なしは後ろへ
        .sort((a, b) => {
          if (a.characterNumber == null && b.characterNumber == null) return 0;
          if (a.characterNumber == null) return 1;
          if (b.characterNumber == null) return -1;
          return a.characterNumber - b.characterNumber;
        });

      setDetail({
        scheduleId: data.id,
        date: data.date,
        time: data.time,
        memo: data.memo,
        endcardUrl: data.endcard_url,
        thumbnailUrl: data.thumbnail_url,
        streamUrl: data.stream_url,
        scenario: data.scenarios
          ? {
              title: data.scenarios.title ?? "",
              genre: data.scenarios.genre,
              production: data.scenarios.production,
              productionUrl: data.scenarios.production_url,
              creator: data.scenarios.creator,
              creatorUrl: data.scenarios.creator_url,
              credit: data.scenarios.credit,
              synopsis: data.scenarios.synopsis,
              summary: data.scenarios.summary,
              officialUrl: data.scenarios.official_url,
              trailerUrl: data.scenarios.trailer_url,
              scenarioTag: data.scenarios.scenario_tag,
              characterDisclosure: data.scenarios.character_disclosure,
            }
          : null,
        cast,
      });
    } catch (err) {
      console.error("Failed to fetch scenario report detail:", err);
      setError(
        err instanceof Error ? err : new Error("詳細データの取得に失敗しました")
      );
    } finally {
      setLoading(false);
    }
  }, [scheduleId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { detail, loading, error, refetch: fetchDetail };
}
