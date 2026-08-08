import { useState } from "react";
import type { Schedule } from "../../types/schedule";
import "./ScheduleCard.css";
import { CalendarDays, Clock, Theater, Link as LinkIcon, Radio, Bird, X } from "lucide-react";
import WatermarkedImage from "../WatermarkedImage";

// カテゴリ用スタイルマッピング
const CATEGORY_STYLES: Record<string, string> = {
  ゲーム: "schedule-category-game",
  シナリオ: "schedule-category-scenario",
  リアル: "schedule-category-real",
};

// ジャンル用スタイルマッピング
const GENRE_STYLES: Record<string, string> = {
  マーダーミステリー: "schedule-genre-mystery",
  ストーリープレイング: "schedule-genre-story",
  その他: "schedule-genre-other",
};

function getCategoryStyle(category?: string) {
  if (!category) return "schedule-category-default";
  return CATEGORY_STYLES[category] ?? "schedule-category-default";
}

function getGenreStyle(genre?: string) {
  if (!genre) return "schedule-genre-default";
  return GENRE_STYLES[genre] ?? "schedule-genre-default";
}

type Props = {
  schedule: Schedule;
};

export default function ScheduleCard({ schedule }: Props) {
  // ★ サムネ拡大モーダルの開閉状態
  const [isImageOpen, setIsImageOpen] = useState(false);
  const isReal = schedule.category === "リアル";

  const officialUrl =
    schedule.category === "ゲーム"
      ? schedule.games?.official_url
      : schedule.category === "シナリオ"
      ? schedule.scenarios?.official_url
      : null;

  const genre = schedule.scenarios?.genre ?? schedule.games?.genre;

  const handleStreamClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (schedule.category === "シナリオ") {
      const isConfirmed = window.confirm(
        "⚠️ ネタバレ注意 ⚠️\n\nこの配信はシナリオ（マダミス・ストプレ等）のネタバレを含みます。\n通過済み、または今後プレイ予定のない方のみご視聴ください。\n\n配信ページを開きますか？"
      );
      if (!isConfirmed) {
        e.preventDefault();
      }
    }
  };

  return (
    <>
      {/* ★ article にすりガラス背景（bg-black/30 backdrop-blur-md）と青系の光る細枠（border-cyan-500/20）を追加！ */}
      <article className="schedule-card flex gap-3 p-3 sm:p-4 items-center !bg-slate-950/40 backdrop-blur-md border border-cyan-500/20 rounded-2xl shadow-lg transition-all hover:border-cyan-400/40 hover:shadow-cyan-500/10 hover:shadow-xl">
        {/* ★ 1. サムネイルエリア */}
        {!isReal && (
          <div className="w-28 sm:w-48 shrink-0 self-center flex items-center justify-center">
            {schedule.thumbnail_url ? (
              <WatermarkedImage
                src={schedule.thumbnail_url}
                alt={schedule.title ?? schedule.label ?? "schedule thumbnail"}
                onClick={() => setIsImageOpen(true)}
                className="aspect-video w-full rounded-xl object-cover cursor-pointer transition-transform hover:scale-105 active:scale-95 shadow-md"
              />
            ) : (
              <div className="aspect-video w-full rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                <Bird size={16} className="text-slate-400" />
              </div>
            )}
          </div>
        )}

        {/* 右：詳細情報 */}
        <div className="flex-1 flex flex-col justify-center gap-1.5 sm:gap-2.5 min-w-0">
          
          {/* タグエリア */}
          <div className="font-yomogi flex flex-wrap gap-1.5 max-w-full overflow-hidden">
            {schedule.category && (
              <span
                className={`rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-medium flex items-center gap-1 max-w-full truncate ${getCategoryStyle(
                  schedule.category
                )}`}
              >
                <span className="truncate">
                  {schedule.category}<span> ✦ </span>{schedule.title}
                </span>
              </span>
            )}

            {genre && (
              <span
                className={`rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-medium truncate ${getGenreStyle(
                  genre
                )}`}
              >
                {genre}
              </span>
            )}
          </div>

          {/* タイトル */}
          <h2 className="font-pop text-base sm:text-lg font-bold text-white line-clamp-1 drop-shadow-sm">
            {schedule.label ?? schedule.title}
          </h2>

          {/* メタ情報 */}
          <div className="font-yomogi space-y-1 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <div className="flex items-center gap-1">
                <CalendarDays size={14} className="text-cyan-300/70 shrink-0" />
                <span>{schedule.date}</span>
              </div>

              {schedule.time && (
                <div className="flex items-center gap-1 ml-1 sm:ml-2">
                  <Clock size={14} className="text-cyan-300/70 shrink-0" />
                  <span>{schedule.time}</span>
                </div>
              )}
            </div>

            {schedule.category === "シナリオ" && schedule.role && (
              <div className="flex items-center gap-1">
                <Theater size={14} className="text-cyan-300/70 shrink-0" />
                <span className="truncate">{schedule.role}</span>
              </div>
            )}
          </div>

          {/* リンクボタン群 */}
          {!isReal && (
            <div className="font-yomogi mt-1 flex gap-2 sm:gap-3">
              {officialUrl ? (
                <a
                  href={officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="schedule-btn schedule-btn-official whitespace-nowrap shrink-0 text-xs sm:text-sm px-2.5 py-1 sm:px-3"
                >
                  <LinkIcon size={14} />
                  公式
                </a>
              ) : (
                <span className="schedule-btn schedule-btn-disabled whitespace-nowrap shrink-0 text-xs sm:text-sm px-2.5 py-1 sm:px-3">
                  <LinkIcon size={14} />
                  公式
                </span>
              )}

              {schedule.stream_url ? (
                <a
                  href={schedule.stream_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleStreamClick}
                  className="schedule-btn schedule-btn-stream whitespace-nowrap shrink-0 text-xs sm:text-sm px-2.5 py-1 sm:px-3"
                >
                  <Radio size={14} />
                  配信
                </a>
              ) : (
                <span className="schedule-btn schedule-btn-disabled whitespace-nowrap shrink-0 text-xs sm:text-sm px-2.5 py-1 sm:px-3">
                  <Radio size={14} />
                  配信
                </span>
              )}
            </div>
          )}

        </div>
      </article>

      {/* ★ 2. 画像ポチッと拡大用ポップアップ（オーバーレイ） */}
      {isImageOpen && schedule.thumbnail_url && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn"
          onClick={() => setIsImageOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setIsImageOpen(false)}
              className="absolute -top-10 right-0 text-white/80 hover:text-white transition-colors"
            >
              <X size={28} />
            </button>
            
            <WatermarkedImage
              src={schedule.thumbnail_url}
              alt="拡大表示"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl border border-white/20"
            />
          </div>
        </div>
      )}
    </>
  );
}