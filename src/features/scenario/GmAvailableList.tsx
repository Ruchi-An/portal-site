import { Hourglass } from "lucide-react";

// 「GM可能」タブは今回は未整備。まず「通過報告」を優先して作成しています。
export default function GmAvailableList() {
  return (
    <div className="empty-schedule-box">
      <Hourglass className="empty-schedule-icon" />
      <span>GM可能ページは準備中です</span>
    </div>
  );
}
