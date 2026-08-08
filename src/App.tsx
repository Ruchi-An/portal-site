import { useState } from "react";
import { useSchedules } from "./hooks/useSchedules";
import ScheduleCalendar from "./components/calendar/ScheduleCalendar";
import ScheduleCard from "./components/schedule/ScheduleCard";
import { ScheduleTabs } from "./components/tab/ScheduleTabs";
import { CalendarX, Sparkles, X } from "lucide-react";

export default function App() {
  const { schedules = [], loading } = useSchedules();

  const [activeTab, setActiveTab] = useState<"past" | "calendar" | "future">("calendar");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split("T")[0];

  const selectedDateSchedules = selectedDate
    ? schedules.filter((schedule) => schedule.date === selectedDate)
    : [];

  const pastSchedules = schedules
    .filter((schedule) => schedule.date < todayStr && schedule.category !== "リアル")
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const futureSchedules = schedules
    .filter((schedule) => schedule.date >= todayStr && schedule.category !== "リアル")
    .sort((a, b) => (a.date > b.date ? 1 : -1));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center font-medium gap-2">
        <Sparkles className="w-5 h-5 animate-spin text-yellow-200" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    // ★ 1. 全体背景は切り抜いた星空画像（star-bg.jpg）を敷き詰める
    <main className="min-h-screen bg-[#030712] bg-[url('/star-bg.png')] bg-cover bg-center bg-fixed text-white p-3 sm:p-6 md:p-10 flex justify-center items-start">
      
      {/* ★ 2. CSSで完全に再現した「光るグラデーションネオンフレーム」！ */}
      <div className="w-full max-w-4xl rounded-3xl p-[3px] bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-500 shadow-[0_0_30px_rgba(56,189,248,0.4),_0_0_60px_rgba(59,130,246,0.2)]">
        
        {/* ★ 3. 枠線の内側（黒く引き締めて文字を見やすく＆すりガラス演出） */}
        <div className="w-full h-full bg-[#070c1a]/85 backdrop-blur-md rounded-[21px] p-6 sm:p-10">

          {/* ヘッダーエリア */}
          <header className="mb-6 flex items-center justify-between">
            <h1 className="font-pop text-2xl md:text-3xl font-bold text-yellow-200 drop-shadow-[0_2px_10px_rgba(254,240,138,0.5)] flex items-center gap-2">
              🌌 夕星るちあ Portal
            </h1>
            {activeTab === "calendar" && selectedDate && (
              <button
                onClick={() => setSelectedDate(null)}
                className="text-xs text-slate-300 hover:text-white flex items-center gap-1 transition-colors bg-white/10 px-3 py-1.5 rounded-full border border-white/10"
              >
                <X className="w-3.5 h-3.5" />
                選択解除
              </button>
            )}
          </header>

          {/* タブエリア */}
          <div className="mb-8">
            <ScheduleTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* 【カレンダー タブ】 */}
          {activeTab === "calendar" && (
            <>
              <ScheduleCalendar
                schedules={schedules}
                selectedDate={selectedDate}
                onSelectDate={(date) => setSelectedDate(date)}
              />

              {/* 日付選択時のカード表示 */}
              {selectedDate && (
                <section className="mt-8 space-y-4">
                  {selectedDateSchedules.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-white/20 p-8 text-center text-slate-300 flex flex-col items-center gap-2 bg-black/40 backdrop-blur-md">
                      <CalendarX className="w-8 h-8 opacity-60 stroke-[1.5]" />
                      <span>この日の予定はありません</span>
                    </div>
                  ) : (
                    selectedDateSchedules.map((schedule, index) => (
                      <ScheduleCard
                        key={schedule.id ?? `${schedule.date}-${index}`}
                        schedule={schedule}
                      />
                    ))
                  )}
                </section>
              )}
            </>
          )}

          {/* 【リスト -過去- タブ】 */}
          {activeTab === "past" && (
            <section className="space-y-4">
              {pastSchedules.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/20 p-8 text-center text-slate-300 bg-black/40 backdrop-blur-md">
                  過去の予定はありません
                </div>
              ) : (
                pastSchedules.map((schedule, index) => (
                  <ScheduleCard
                    key={schedule.id ?? `${schedule.date}-${index}`}
                    schedule={schedule}
                  />
                ))
              )}
            </section>
          )}

          {/* 【リスト -未来- タブ】 */}
          {activeTab === "future" && (
            <section className="space-y-4">
              {futureSchedules.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/20 p-8 text-center text-slate-300 bg-black/40 backdrop-blur-md">
                  これからの予定はありません
                </div>
              ) : (
                futureSchedules.map((schedule, index) => (
                  <ScheduleCard
                    key={schedule.id ?? `${schedule.date}-${index}`}
                    schedule={schedule}
                  />
                ))
              )}
            </section>
          )}

        </div>
      </div>
    </main>
  );
}