import { useState } from "react";
import { createPortal } from "react-dom"; // 👈 ① これを追加！
import type { Schedule } from "../../types/schedule";
import "./ScheduleCard.css";
import { 
  CalendarDays, Clock, Theater, Link as LinkIcon, Radio, Bird, X,
  Sunrise, Sun, Moon, MoonStar, Sparkles 
} from "lucide-react";
import WatermarkedImage from "../../WatermarkedImage";

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

// 時間帯ごとのアイコンとCSS設定マッピング
const TIME_CONFIG: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  all_day: { label: "終日", icon: Sparkles, className: "time-tag-all-day" },
  morning: { label: "朝", icon: Sunrise, className: "time-tag-morning" },
  afternoon: { label: "昼", icon: Sun, className: "time-tag-afternoon" },
  night: { label: "夜", icon: Moon, className: "time-tag-night" },
  late_night: { label: "深夜", icon: MoonStar, className: "time-tag-late-night" },
};

type Props = {
  schedule: Schedule;
};

export default function ScheduleCard({ schedule }: Props) {
  console.log("scheduleの中身:", schedule);
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

  // 時間帯タグ抽出
  const timeTags = [
    { key: "all_day", active: schedule.is_all_day },
    { key: "morning", active: schedule.is_morning },
    { key: "afternoon", active: schedule.is_afternoon },
    { key: "night", active: schedule.is_night },
    { key: "late_night", active: schedule.is_late_night },
  ]
    .filter((tag) => tag.active)
    .map((tag) => ({
      key: tag.key,
      ...TIME_CONFIG[tag.key],
    }));

  return (
    <>
      <div className="schedule-card">
        {/* サムネイルエリア */}
        {!isReal && (
          <div className="schedule-card-thumbnail-wrapper">
            {schedule.thumbnail_url ? (
              <WatermarkedImage
                src={schedule.thumbnail_url}
                alt={schedule.title ?? schedule.label ?? "schedule thumbnail"}
                onClick={() => setIsImageOpen(true)} 
                className="schedule-card-thumbnail"
              />
            ) : (
              <div className="schedule-card-thumbnail-placeholder">
                <Bird size={16} />
              </div>
            )}
          </div>
        )}
        {/* 詳細情報 */}
        <div className="schedule-card-body">
          
          {/* タグエリア */}
          <div className="schedule-card-tags font-yomogi">
            {schedule.category && (
              <span className={`schedule-category-tag ${getCategoryStyle(schedule.category)}`}>
                <span className="truncate">
                  {schedule.category}<span> ✦ </span>{schedule.title}
                </span>
              </span>
            )}

            {genre && (
              <span className={`schedule-genre-tag ${getGenreStyle(genre)}`}>
                {genre}
              </span>
            )}

            {/* 時間帯タグ */}
            {timeTags.map((tag) => {
              const IconComponent = tag.icon;
              return (
                <span key={tag.key} className={`time-tag-base ${tag.className}`}>
                  <IconComponent size={13} className="time-tag-icon" />
                  <span>{tag.label}</span>
                </span>
              );
            })}
          </div>

          {/* タイトル */}
          <h2 className="schedule-card-title font-pop">
            {schedule.label ?? schedule.title}
          </h2>

          {/* メタ情報 */}
          <div className="schedule-card-meta font-yomogi">
            <div className="schedule-card-meta-row">
              <div className="schedule-card-meta-item">
                <CalendarDays size={14} className="schedule-card-icon" />
                <span>{schedule.date ?? "-"}</span>
              </div>

              {!isReal && schedule.time && (
                <div className="schedule-card-meta-item">
                  <Clock size={14} className="schedule-card-icon" />
                  <span>{schedule.time ?? "-"}</span>
                </div>
              )}
            </div>

            {schedule.category === "シナリオ" && schedule.role && (
              <div className="schedule-card-meta-item">
                <Theater size={14} className="schedule-card-icon" />
                <span className="truncate">{schedule.role}</span>
              </div>
            )}
          </div>

          {/* リンクボタン群 */}
          {!isReal && (
            <div className="schedule-card-actions font-yomogi">
              {officialUrl ? (
                <a
                  href={officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="schedule-btn schedule-btn-official"
                >
                  <LinkIcon size={14} />
                  公式
                </a>
              ) : (
                <span className="schedule-btn schedule-btn-disabled">
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
                  className="schedule-btn schedule-btn-stream"
                >
                  <Radio size={14} />
                  配信
                </a>
              ) : (
                <span className="schedule-btn schedule-btn-disabled">
                  <Radio size={14} />
                  配信
                </span>
              )}
            </div>
          )}

        </div>
      </div>

      {/* 👈 ② モーダル部分を createPortal で body 直下に吹き飛ばす！ */}
      {isImageOpen && schedule.thumbnail_url && createPortal(
        <div className="image-modal-overlay" onClick={() => setIsImageOpen(false)}>
          {/* 閉じるボタン */}
          <button className="image-modal-close" onClick={() => setIsImageOpen(false)}>
            <X size={24} />
          </button>
          
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <WatermarkedImage
              src={schedule.thumbnail_url}
              alt="拡大サムネイル"
              className="image-modal-view"
            />
          </div>
        </div>,
        document.body // 👈 第2引数に document.body を指定
      )}
    </>
  );
}