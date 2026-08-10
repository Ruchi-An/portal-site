import { Route, Routes } from "react-router-dom";
import Header from "./components/layout/Header";
import SchedulePage from "./pages/SchedulePage";
import ScenarioPage from "./pages/ScenarioPage";
import ReportDetail from "./features/scenario/ReportDetail";
import "./App.css";

export default function App() {
  return (
    <div className="app-viewport">
      <Header />

      <Routes>
        <Route path="/" element={<SchedulePage />} />
        <Route
          path="/scenario/report/:scheduleId"
          element={
            <main className="main-container">
              <div className="bg-overlay" />
              <div className="main-content-wrapper">
                <ReportDetail />
              </div>
            </main>
          }
        />
        <Route path="/scenario/*" element={<ScenarioPage />} />
      </Routes>
    </div>
  );
}
