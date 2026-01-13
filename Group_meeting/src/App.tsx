import {  BrowserRouter, Route, Routes } from "react-router-dom";
import MeetingPage from "./pages/MeetingPage";
import Dashboard from "./pages/Dashboard";
import MeetingHistory from "./pages/MeetingHistory";


export default function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/meeting" element={<MeetingPage />} />
        <Route path="/meeting-history" element={<MeetingHistory />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}