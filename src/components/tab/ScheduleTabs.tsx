import "./ScheduleTabs.css";
import { History, Calendar, Sparkles } from "lucide-react";

type TabType = "past" | "calendar" | "future";

type Props = {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
};

// タブの設定データ
const TABS = [
  { id: "past", label: "リスト -過去-", icon: History },
  { id: "calendar", label: "カレンダー", icon: Calendar },
  { id: "future", label: "リスト -未来-", icon: Sparkles },
] as const;

export const ScheduleTabs = ({ activeTab, onTabChange }: Props) => {
  return (
    <div className="schedule-tabs-container font-pop">
      <div className="schedule-tabs">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`tab-btn ${activeTab === id ? "active" : ""}`}
            onClick={() => onTabChange(id)}
            title={label}
          >
            <Icon size={18} className="tab-icon" />
            <span className="tab-label">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};