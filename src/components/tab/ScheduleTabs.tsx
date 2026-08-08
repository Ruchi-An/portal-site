import React from 'react';
import './ScheduleTabs.css'; // 作成したCSSを読み込み
import { History, Calendar, Sparkles } from "lucide-react";

type Props = {
  activeTab: "past" | "calendar" | "future";
  onTabChange: (tab: "past" | "calendar" | "future") => void;
};

export const ScheduleTabs = ({ activeTab, onTabChange }: Props) => {
  return (
<div className="font-pop schedule-tabs-container">
      <div className="schedule-tabs flex items-center justify-center gap-2 sm:gap-6">
        {/* 過去リスト */}
        <button
          className={`tab-btn flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => onTabChange('past')}
          title="リスト -過去-"
        >
          <History size={18} className="shrink-0" />
          <span className="hidden sm:inline-block">リスト -過去-</span>
        </button>

        {/* カレンダー */}
        <button
          className={`tab-btn flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => onTabChange('calendar')}
          title="カレンダー"
        >
          <Calendar size={18} className="shrink-0" />
          <span className="hidden sm:inline-block">カレンダー</span>
        </button>

        {/* 未来リスト */}
        <button
          className={`tab-btn flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === 'future' ? 'active' : ''}`}
          onClick={() => onTabChange('future')}
          title="リスト -未来-"
        >
          <Sparkles size={18} className="shrink-0" />
          <span className="hidden sm:inline-block">リスト -未来-</span>
        </button>
      </div>
    </div>
  );
};