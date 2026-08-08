  import { useMemo, useState, useRef } from "react";
  import Calendar from "react-calendar";
  import Holidays from "date-holidays";
  import type { Schedule } from "../../types/schedule";
  import "./ScheduleCalendar.css";

  const hd = new Holidays("JP");

  type Props = {
    schedules: Schedule[];
    selectedDate?: string | null;
    onSelectDate: (date: string) => void;
  };

  // Dateオブジェクトを "YYYY-MM-DD" 形式に変換する関数
  function formatDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // null も受け取れるように変更
  function getStarClass(category?: string | null): string {
    switch (category) {
      case "ゲーム":
        return "calendar-star-game";
      case "シナリオ":
        return "calendar-star-scenario";
      default:
        return "calendar-star-real";
    }
  }

  export default function ScheduleCalendar({
    schedules,
    selectedDate,
    onSelectDate,
  }: Props) {
    const [activeDate, setActiveDate] = useState(new Date());
    const calendarRef = useRef<any>(null);

    // 日付をキーにしたスケジュールのマップ（パフォーマンス対策）
    const schedulesByDate = useMemo(() => {
      const map = new Map<string, Schedule[]>();
      schedules.forEach((schedule) => {
        const list = map.get(schedule.date) ?? [];
        list.push(schedule);
        map.set(schedule.date, list);
      });
      return map;
    }, [schedules]);

    return (
      <div className="font-pop schedule-calendar w-full max-w-full overflow-hidden !bg-slate-950/40 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-4 sm:p-6 shadow-lg">      {/* 自作ヘッダー */}
        <div className="calendar-header flex items-center justify-between gap-1 sm:gap-2">
          {/* 左のキラキラ */}
          <button
            className="calendar-nav-btn shrink-0"
            onClick={() => {
              const date = new Date(activeDate);
              date.setMonth(date.getMonth() - 1);
              setActiveDate(date);
            }}
          >
            ✦
          </button>

          {/* 中央グループ */}
          <div className="calendar-header-center flex items-center gap-1 sm:gap-2">
            <select
              value={activeDate.getFullYear()}
              onChange={(e) => {
                const date = new Date(activeDate);
                date.setFullYear(Number(e.target.value));
                setActiveDate(date);
              }}
            >
              {Array.from(
                { length: 5 },
                (_, i) => activeDate.getFullYear() - 2 + i
              ).map((year) => (
                <option key={year} value={year}>
                  {year}年
                </option>
              ))}
            </select>

            <select
              value={activeDate.getMonth()}
              onChange={(e) => {
                const date = new Date(activeDate);
                date.setMonth(Number(e.target.value));
                setActiveDate(date);
              }}
            >
              {Array.from({ length: 12 }, (_, i) => i).map((month) => (
                <option key={month} value={month}>
                  {month + 1}月
                </option>
              ))}
            </select>

            <button
              className="calendar-today-button shrink-0"
              onClick={() => {
                const today = new Date();
                setActiveDate(today);
                onSelectDate(formatDateKey(today));
              }}
            >
              今日
            </button>
          </div>

          {/* 右のキラキラ */}
          <button
            className="calendar-nav-btn shrink-0"
            onClick={() => {
              const date = new Date(activeDate);
              date.setMonth(date.getMonth() + 1);
              setActiveDate(date);
            }}
          >
            ✦
          </button>
        </div>

        <Calendar
          ref={calendarRef}
          showNavigation={false}
          activeStartDate={activeDate}
          onActiveStartDateChange={({ activeStartDate }) => {
            if (activeStartDate) {
              setActiveDate(activeStartDate);
            }
          }}
          selectRange={false}
          prev2Label={null}
          next2Label={null}
          showNeighboringMonth={false}
          onChange={(value) => {
            if (value instanceof Date) {
              onSelectDate(formatDateKey(value));
            }
          }}
          formatShortWeekday={(_, date) =>
            ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()]
          }
          formatDay={(_, date) => String(date.getDate())}
          tileClassName={({ date }) => {
            const dateStr = formatDateKey(date);
            const todayStr = formatDateKey(new Date());

            const classes = [];

            if (schedulesByDate.has(dateStr)) {
              classes.push("has-schedule");
            }

            if (dateStr === todayStr) {
              classes.push("is-today");
            }

            if (dateStr === selectedDate) {
              classes.push("is-selected");
            }

            const day = date.getDay();
            if (day === 6) {
              classes.push("calendar-saturday");
            } else if (day === 0) {
              classes.push("calendar-sunday");
            }

            if (hd.isHoliday(date)) {
              classes.push("calendar-holiday");
            }

            return classes.join(" ");
          }}
          tileContent={({ date, view }) => {
            if (view !== "month") return null;

            const key = formatDateKey(date);
            const daySchedules = schedulesByDate.get(key);

            if (!daySchedules) return null;

            return (
              <div className="calendar-stars">
                {daySchedules.slice(0, 3).map((schedule, i) => (
                  <span
                    key={schedule.id ?? i}
                    className={`calendar-star ${getStarClass(schedule.category)}`}
                  >
                    ✦
                  </span>
                ))}
              </div>
            );
          }}
        />
      </div>
    );
  }