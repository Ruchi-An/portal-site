import { useState } from "react";
import { useSchedules } from "./hooks/useSchedules";
import ScheduleCalendar from "./components/calendar/ScheduleCalendar";
import ScheduleCard from "./components/schedule/ScheduleCard";
import { ScheduleTabs } from "./components/tab/ScheduleTabs";
import { CalendarX, Sparkles } from "lucide-react";
import "./App.css";

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
    <div className="min-h-screen bg-[#030712] bg-[url('/star-bg.png')] bg-cover bg-center bg-fixed text-white flex flex-col relative">
      
      {/* ヘッダー */}
      <header className="site-header">
        <div className="w-full flex items-center justify-between">
          <h1 className="site-title">
            星降る止まり木 -夕星るちあのポータルサイト-
          </h1>
        </div>
      </header>

      {/* メインエリア */}
      <main className="main-container">
        <div className="bg-overlay" />

        <div className="w-full max-w-4xl flex flex-col items-center">
          
          {/* タブ */}
          <div className="mb-6 w-full flex justify-center">
            <ScheduleTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* -------------------------------------------------------------
              【カレンダー タブ】
             ------------------------------------------------------------- */}
          {activeTab === "calendar" && (
            <div className="w-full flex flex-col items-center">
              
              {/* カレンダーネオン枠 */}
              <div className="neon-wrapper-calendar">
                <div className="neon-inner-calendar">
                  <ScheduleCalendar
                    schedules={schedules}
                    selectedDate={selectedDate}
                    onSelectDate={(date) => setSelectedDate(date)}
                  />
                </div>
              </div>

              {/* 選択した日付の予定カード */}
              {selectedDate && (
                <section className="mt-6 w-full space-y-4">
                  {selectedDateSchedules.length === 0 ? (
                    <div className="empty-schedule-box">
                      <CalendarX className="w-8 h-8 opacity-60 stroke-[1.5]" />
                      <span>この日の予定はありません</span>
                    </div>
                  ) : (
                    selectedDateSchedules.map((schedule, index) => (
                      <div key={schedule.id ?? `${schedule.date}-${index}`} className="neon-wrapper-card">
                        <div className="neon-inner-card">
                          <ScheduleCard schedule={schedule} />
                        </div>
                      </div>
                    ))
                  )}
                </section>
              )}
            </div>
          )}

          {/* -------------------------------------------------------------
              【リスト -過去- タブ】
             ------------------------------------------------------------- */}
          {activeTab === "past" && (
            <section className="w-full space-y-4">
              {pastSchedules.length === 0 ? (
                <div className="empty-schedule-box">
                  過去の予定はありません
                </div>
              ) : (
                pastSchedules.map((schedule, index) => (
                  <div key={schedule.id ?? `${schedule.date}-${index}`} className="neon-wrapper-card">
                    <div className="neon-inner-card">
                      <ScheduleCard schedule={schedule} />
                    </div>
                  </div>
                ))
              )}
            </section>
          )}

          {/* -------------------------------------------------------------
              【リスト -未来- タブ】
             ------------------------------------------------------------- */}
          {activeTab === "future" && (
            <section className="w-full space-y-4">
              {futureSchedules.length === 0 ? (
                <div className="empty-schedule-box">
                  これからの予定はありません
                </div>
              ) : (
                futureSchedules.map((schedule, index) => (
                  <div key={schedule.id ?? `${schedule.date}-${index}`} className="neon-wrapper-card">
                    <div className="neon-inner-card">
                      <ScheduleCard schedule={schedule} />
                    </div>
                  </div>
                ))
              )}
            </section>
          )}

        </div>
      </main>
    </div>
  );
}