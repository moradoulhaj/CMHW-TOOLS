import React, { useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, RotateCcw, Upload } from "lucide-react";
import ConfirmModal from "./smalls/ConfirmModal";
import FileList from "./smalls/FilesList";
import DelimiterSelector from "./smalls/DelimiterSelector";
import FileViewer from "./smalls/FileViewer";
import { detectSeparator, handleExcel, readFileContent } from "../scripts/scripts";

export default function RamadanTask() {




 



  return (
    <div
      className="flex flex-col items-center p-10 space-y-8 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 min-h-screen"

    >
      <ToastContainer theme="colored" />

      <h2 className="text-4xl font-extrabold text-blue-800 drop-shadow-lg">
        Read And Display File's Content
      </h2>

     

  
    
    </div>
  );
}
