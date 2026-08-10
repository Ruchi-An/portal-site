import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Sparkles,
  ArrowLeft,
  CalendarDays,
  PenLine,
  Building2,
  Link as LinkIcon,
  Radio,
  Users,
} from "lucide-react";
import { useScenarioReportDetail } from "./useScenarioReportDetail";
import "./ReportDetail.css";

export default function ReportDetail() {
  const { scheduleId } = useParams<{ scheduleId: string }>();
  const { detail, loading, error } = useScenarioReportDetail(scheduleId);

  // 💡 キャストの並び替え（GM/STを先頭、PLは番号順）
  const sortedCast = useMemo(() => {
    if (!detail?.cast) return [];

    return [...detail.cast].sort((a, b) => {
      const roleA = (a.role || "").toUpperCase();
      const roleB = (b.role || "").toUpperCase();

      const isGmA = roleA === "GM" || roleA === "ST";
      const isGmB = roleB === "GM" || roleB === "ST";

      if (isGmA && !isGmB) return -1;
      if (!isGmA && isGmB) return 1;

      return (a.characterNumber ?? 0) - (b.characterNumber ?? 0);
    });
  }, [detail?.cast]);

  // 💡 担当キャラクターの描画テキストを判定するHelper関数
  const getCharacterLabel = (member: (typeof sortedCast)[number]) => {
    const role = (member.role || "").toUpperCase();

    // GM・STなどの運営陣はキャラクターなし
    if (role === "GM" || role === "ST") {
      return "-";
    }

    const disclosure = detail?.scenario?.characterDisclosure ?? "名前公開OK";

    // 公開制限による表示分岐
    if (disclosure === "公開NG") {
      return "-";
    }

    const type = member.characterType ?? "PC";
    const numStr = member.characterNumber ? `${type}${member.characterNumber}` : "";
    const charName = member.characterName ?? "";

    if (disclosure === "順番のみ公開OK") {
      return numStr || "-";
    }

    // デフォルト（名前公開OK）
    return [numStr, charName].filter(Boolean).join(" ") || "-";
  };

  const handleStreamClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const isConfirmed = window.confirm(
      "⚠️ ネタバレ注意 ⚠️\n\nこの配信はシナリオ（マダミス・ストプレ等）のネタバレを含みます。\n通過済み、または今後プレイ予定のない方のみご視聴ください。\n\n配信ページを開きますか？"
    );
    if (!isConfirmed) {
      e.preventDefault();
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Sparkles className="loading-icon" />
        <span>読み込み中...</span>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="empty-schedule-box">
        <span>データが見つかりませんでした。</span>
      </div>
    );
  }

  const { scenario } = detail;

  return (
    <div className="report-detail">
      <Link to="/scenario" className="report-back-link font-pop">
        <ArrowLeft size={16} />
        本棚に戻る
      </Link>

      <div className="neon-wrapper-card report-detail-card">
        <div className="neon-inner-card report-detail-inner">
          
          {/* ① サムネイル（表紙エリア） */}
          <div className="report-detail-cover-wrapper">
            {detail.endcardUrl ? (
              <img
                src={detail.endcardUrl}
                alt={scenario?.title ?? ""}
                className="report-detail-cover"
              />
            ) : (
              <div className="report-detail-cover report-detail-cover-fallback">
                <Sparkles size={28} />
              </div>
            )}
          </div>

          {/* ② 詳細情報エリア */}
          <div className="report-detail-body">
            
            {/* タグ (ジャンル) */}
            {scenario?.genre && (
              <span className="report-detail-genre font-pop">{scenario.genre}</span>
            )}

            {/* タイトル */}
            <h1 className="report-detail-title font-pop">
              {scenario?.title ?? "タイトル未設定"}
            </h1>

            {/* 通過日 */}
            <div className="report-detail-meta font-yomogi">
              <span className="report-detail-meta-item">
                <CalendarDays size={15} />
                {detail.date}
              </span>
            </div>

            {/* クレジット */}
            {(scenario?.creator || scenario?.production) && (
              <div className="report-detail-credit font-yomogi">
                {scenario?.production && (
                  <span className="report-detail-credit-item">
                    <Building2 size={14} />
                    制作：
                    {scenario.productionUrl ? (
                      <a href={scenario.productionUrl} target="_blank" rel="noopener noreferrer">
                        {scenario.production}
                      </a>
                    ) : (
                      scenario.production
                    )}
                  </span>
                )}

                {scenario?.creator && (
                  <span className="report-detail-credit-item">
                    <PenLine size={14} />
                    作者様：
                    {scenario.creatorUrl ? (
                      <a href={scenario.creatorUrl} target="_blank" rel="noopener noreferrer">
                        {scenario.creator}
                      </a>
                    ) : (
                      scenario.creator
                    )}
                  </span>
                )}
              </div>
            )}

            {/* 公式・配信リンク */}
            <div className="report-detail-links">
              {scenario?.officialUrl && (
                <a
                  href={scenario.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="report-detail-link-btn official-btn"
                >
                  <LinkIcon size={14} />
                  公式ページ
                </a>
              )}

              {detail.streamUrl && (
                <a
                  href={detail.streamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleStreamClick}
                  className="report-detail-link-btn stream-btn"
                >
                  <Radio size={14} />
                  配信を見る
                </a>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ③ 参加メンバー（表形式） */}
      <section className="report-cast-section">
        <h2 className="report-cast-heading font-pop">
          <Users size={18} />
          参加メンバー
        </h2>

        {sortedCast.length === 0 ? (
          <div className="empty-schedule-box font-yomogi">
            <span>参加メンバー情報は登録されていません</span>
          </div>
        ) : (
          <div className="report-cast-table-wrapper font-yomogi">
            <table className="report-cast-table">
              <thead>
                <tr>
                  <th>参加者</th>
                  <th>役割</th>
                  <th>担当</th>
                </tr>
              </thead>
              <tbody>
                {sortedCast.map((member) => (
                  <tr key={member.participantId}>
                    {/* 参加者名 */}
                    <td className="cast-col-user">
                      {member.profileName || "-"}
                    </td>

                    {/* 役割 */}
                    <td className="cast-col-role">
                      {member.role || "-"}
                    </td>

                    {/* 担当キャラクター */}
                    <td className="cast-col-char">
                      {getCharacterLabel(member)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}