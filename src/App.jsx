import React from "react";
import Navbar from "./components/smalls/NavBar";
import RemoveSessions from "./components/RemoveSessions";
import Offers from "./components/Offers";
import DelimiterSwitch from "./components/DelimterSwitch";
import AddSessionUsingTags from "./components/AddSessionsUsinTags";
import Spliter from "./components/Spliter";
import LogChecker from "./components/LogChecker";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Router basename="/CMHW-TOOLS">
      <div className="min-h-screen bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50">
        <Navbar />

        <div>
          <Routes>

            <Route path="/ReadAndShow" element={<Offers />} />
            <Route path="/removeTags" element={<RemoveSessions />} />
            <Route path="/addUsingTags" element={<AddSessionUsingTags />} />
            <Route path="/delimiterSwitch" element={<DelimiterSwitch />} />
            <Route path="/spliter" element={<Spliter />} />
            <Route path="/logChecker" element={<LogChecker />} />
            <Route path="*" element={<LogChecker/>} />

          </Routes>
        </div>
      </div>
    </Router>
  );
}
