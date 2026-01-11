import React, { useState } from 'react';

function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 text-white py-12 mt-16 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-8 text-sm md:text-base">
          <a href="#" className="text-indigo-200 hover:text-white transition-all duration-300 hover:scale-110 font-medium relative group">
            About Us
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#" className="text-indigo-200 hover:text-white transition-all duration-300 hover:scale-110 font-medium relative group">
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#" className="text-indigo-200 hover:text-white transition-all duration-300 hover:scale-110 font-medium relative group">
            Privacy Policy
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#" className="text-indigo-200 hover:text-white transition-all duration-300 hover:scale-110 font-medium relative group">
            Terms of Service
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
          </a>
        </div>
        <div className="text-center text-indigo-300 text-sm">
          © 2024 MediAccess. All rights reserved. Made with ❤️ for better healthcare
        </div>
      </div>
    </footer>
  );
}

export default Footer