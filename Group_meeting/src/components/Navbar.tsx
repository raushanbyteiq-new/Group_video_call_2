// import React from "react";
import byteiqLogo from '../assets/byteiq_logo.jpeg';

export default function Navbar() {
    return (
    <>
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-12">
          <div className="flex">
          <img src={byteiqLogo} alt="byteiq logo" className="h-10 w-10 mr-3"/>
          <h1 className="text-3xl font-bold text-blue-500">ByteIQ</h1>
          </div>
          <div className="flex gap-8 text-[15px]">
            <a
              href="/meeting-history"
              className="hover:text-gray-600 font-bold px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
            >
              Meetings History
            </a>
            <a
              href="#"
              className="hover:text-gray-600 font-bold px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
            >
              Teams
            </a>
            <a
              href="#"
              className="hover:text-gray-600 font-bold px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
            >
              Support
            </a>
            <a
              href="#"
              className="hover:text-gray-600 px-4 py-2 font-bold rounded-lg hover:bg-gray-100 transition-all duration-300"
            >
              Docs
            </a>
            <a
              href="#"
              className="hover:text-gray-600 px-4 py-2 font-bold rounded-lg hover:bg-gray-100 transition-all duration-300"
            >
              Company
            </a>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="#"
            className="text-[15px] hover:text-gray-600 font-bold px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
          >
            Contact Sales
          </a>
          <a
            href="#"
            className="text-[15px] hover:text-gray-600 font-bold px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
          >
            Sign In
          </a>
          <button className="bg-[#1a1d2e] text-white font-bold px-6 py-2.5 rounded-full text-[15px] font-medium hover:bg-[#2a2d3e]">
            Get Started
          </button>
        </div>
      </nav>
    </>
)}