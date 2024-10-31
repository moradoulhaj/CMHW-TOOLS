import React, { useState } from "react";
import Navbar from "./components/NavBar";
import AddSessions from "./components/AddSessions"; // Replace with your Add Sessions component
import RemoveSessions from "./components/RemoveSessions"; // Replace with your Remove Sessions component

export default function App() {
    const [selectedOption, setSelectedOption] = useState("add");

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50">
            <Navbar selectedOption={selectedOption} onOptionChange={setSelectedOption} />
            
            <div className="p-8">
                {selectedOption === "add" ? (
                    <AddSessions />
                ) : (
                    <RemoveSessions />
                )}
            </div>
        </div>
    );
}
