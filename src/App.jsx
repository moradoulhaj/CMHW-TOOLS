import React, { useState } from "react";
import Navbar from "./components/NavBar";
import AddSessions from "./components/AddSessions";
import RemoveSessions from "./components/RemoveSessions";
import AddSessionWithTags from "./components/AddSessionsWithTags";
import Offers from "./components/Offers";
import LazyLoading from "./components/DelimterSwitch";
import AddSessionUsingTags from "./components/AddSessionsUsinTags";

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
        return <LazyLoading />;
        
      default:
        return <Offers />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50">
      <Navbar
        selectedOption={selectedOption}
        onOptionChange={setSelectedOption}
      />

      <div className="p-8">{renderContent()}</div>
    </div>
  );
}
