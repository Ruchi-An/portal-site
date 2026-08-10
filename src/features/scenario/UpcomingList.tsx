import { Hourglass } from "lucide-react";

// 「通過予定」タブは今回は未整備。まず「通過報告」を優先して作成しています。
export default function UpcomingList() {
  return (
    <div className="empty-schedule-box">
      <Hourglass className="empty-schedule-icon" />
      <span>通過予定ページは準備中です</span>
    </div>
  );
}
