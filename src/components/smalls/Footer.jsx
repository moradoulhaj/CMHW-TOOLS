import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto flex flex-col items-center justify-center space-y-2">
        <p className="text-sm">&copy; 2024 By Morad Oulhaj with the help of Ayoub Aharmouch , Noureddine Charifi And Omar Elmohamedy. All rights reserved.</p>
        <div className="flex space-x-4">
          <a
            href="https://t.me/moulhaj"
            className="text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="LinkedIn"
          >
            <i className="ri-telegram-fill"></i>
          </a>
          {/* <a
            href="https://github.com/moradoulhaj"
            className="text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="GitHub"
          >
            <i className="ri-github-line"></i>
          </a> */}
        </div>
      </div>
    </footer>
  );
}
