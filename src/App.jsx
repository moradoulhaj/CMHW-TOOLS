import React, { useState } from "react";
import Navbar from "./components/smalls/NavBar";
import RemoveSessions from "./components/RemoveSessions";
import Offers from "./components/Offers";
import DelimiterSwitch from "./components/DelimterSwitch";
import AddSessionUsingTags from "./components/AddSessionsUsinTags";
import Spliter from "./components/Spliter";
import LogChecker from "./components/LogChecker";
import { BrowserRouter as Router } from "react-router-dom";

export default function App() {
  const [selectedOption, setSelectedOption] = useState("add");

  const renderContent = () => {
    switch (selectedOption) {
      case "readAndShow":
        return <Offers />;
      case "remove":
        return <RemoveSessions />;
      case "addWithTags":
        return <AddSessionUsingTags />;
      case "delimterSwitch":
        return <DelimiterSwitch />;
      case "spliter":
        return <Spliter />;
      case "logCheck":
        return <LogChecker />;
      default:
        return <Offers />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50">
      <Navbar />

      <div className="p-8">{renderContent()}</div>
    </div>
  );
}
