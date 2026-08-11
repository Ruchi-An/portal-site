import { useNavigate } from "react-router-dom";
import { Sparkles, BookX, Feather } from "lucide-react";
import { useScenarioReports } from "./useScenarioReports";
import "./ReportBookshelf.css";

type GenreTheme = "murder" | "story" | "other";

// report側のジャンル文字列からテーマを判定する
// ※ report.genre の実際のフィールド名・値に合わせて調整してください
function resolveGenreTheme(genreLabel?: string | null): GenreTheme {
  if (!genreLabel) return "other";
  if (genreLabel.includes("マーダー") || genreLabel.includes("マダミス")) return "murder";
  if (genreLabel.includes("ストーリー") || genreLabel.includes("ストプレ") || genreLabel.includes("TRPG")) return "story";
  return "other";
}

function BookCard({
  number,
  date,
  title,
  endcardUrl,
  genre,
  onClick,
}: {
  number: number;
  date: string | null;
  title: string;
  endcardUrl: string | null;
  genre?: string | null;
  onClick: () => void;
}) {
  const genreTheme = resolveGenreTheme(genre);

  return (
  <button type="button" className="book-card" onClick={onClick}>
    <span className="book-top-bar">
      <span className="book-number-badge font-pop">#{number}</span>
    </span>

    <span className="book-cover" data-genre={genreTheme}>
      {endcardUrl ? (
        <img src={endcardUrl} alt="" className="book-cover-img" loading="lazy" />
      ) : (
        <span className="book-cover-fallback">
          <Feather size={22} />
        </span>
      )}

      {date && <span className="book-date-chip font-yomogi">{date}</span>}

      <span className="book-cover-tint" aria-hidden="true" />
      <span className="book-cover-shine" aria-hidden="true" />

      <span className="book-title-scrim">
        <span className="book-title-text font-pop">{title}</span>
      </span>
    </span>
  </button>
  );
}

export default function ReportBookshelf() {
  const { reports, loading, error } = useScenarioReports();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="loading-container">
        <Sparkles className="loading-icon" />
        <span>本棚を並べています...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-schedule-box">
        <BookX className="empty-schedule-icon" />
        <span>データの取得に失敗しました。時間を置いて再度お試しください。</span>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="empty-schedule-box">
        <BookX className="empty-schedule-icon" />
        <span>まだ通過報告はありません</span>
      </div>
    );
  }

  return (
    <div className="bookshelf">
      {reports.map((report) => (
        <BookCard
          key={report.scheduleId}
          number={report.number}
          date={report.date}
          title={report.title}
          endcardUrl={report.endcardUrl}
          genre={report.genre} // ← 実際のフィールド名に合わせて修正
          onClick={() => navigate(`/scenario/report/${report.scheduleId}`)}
        />
      ))}
    </div>
  );
}