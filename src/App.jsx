import React, { useState } from "react";
import Navbar from "./components/NavBar";
import AddSessions from "./components/AddSessions";
import RemoveSessions from "./components/RemoveSessions";
import AddSessionWithTags from "./components/AddSessionsWithTags"; // Import the new component
import Ok from "./components/Ok";

export default function App() {
    const [selectedOption, setSelectedOption] = useState("add");

    const renderContent = () => {
        switch (selectedOption) {
            case "add":
                return <AddSessions />;
            case "remove":
                return <Ok/>;
            case "addWithTags":
                return <AddSessionWithTags />;
            default:
                return <FileList />;
                
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50">
            <Navbar selectedOption={selectedOption} onOptionChange={setSelectedOption} />
            
            <div className="p-8">
                {renderContent()}
            </div>
        </div>
    );
}
