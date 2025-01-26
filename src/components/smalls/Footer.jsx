import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto flex flex-col items-center justify-center space-y-2">
        <p className="text-sm">&copy; 2024 By Morad Oulhaj with Help of Merouan Bouchettouy and Ayoub Aharmouch And Omar Elmohamedy. All rights reserved.</p>
        <div className="flex space-x-4">
          <a
            href="#"
            className="text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="Twitter"
          >
            <i className="ri-twitter-line"></i>
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="LinkedIn"
          >
            <i className="ri-linkedin-line"></i>
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="GitHub"
          >
            <i className="ri-github-line"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
