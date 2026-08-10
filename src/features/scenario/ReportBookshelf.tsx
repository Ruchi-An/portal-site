import { useNavigate } from "react-router-dom";
import { Sparkles, BookX, Feather } from "lucide-react";
import { useScenarioReports } from "./useScenarioReports";
import "./ReportBookshelf.css";

// -------------------------------------------------------------
// 本棚に並ぶ1冊分のカード
// 表紙(エンドカード)の上にタイトルを帯として重ね、
// 日付は右上の小さなバッジで表示する
// -------------------------------------------------------------
function BookCard({
  number,
  date,
  title,
  endcardUrl,
  onClick,
}: {
  number: number;
  date: string | null; // 👈 修正箇所①：null が入ってくる可能性を型に明示！
  title: string;
  endcardUrl: string | null;
  onClick: () => void;
}) {
  return (
    <button type="button" className="book-card" onClick={onClick}>
      <span className="book-number-badge font-pop">{number}</span>
      
      {/* 👈 修正箇所②：formatShortDateを削除し、dateがある時だけバッジを表示（null対策） */}
      {date && <span className="book-date-badge font-yomogi">{date}</span>}

      <span className="book-cover">
        {endcardUrl ? (
          <img src={endcardUrl} alt="" className="book-cover-img" loading="lazy" />
        ) : (
          <span className="book-cover-fallback">
            <Feather size={22} />
          </span>
        )}
        <span className="book-cover-shine" aria-hidden="true" />

        {/* 表紙下部に重なるタイトル帯 */}
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
          onClick={() => navigate(`/scenario/report/${report.scheduleId}`)}
        />
      ))}
    </div>
  );
}