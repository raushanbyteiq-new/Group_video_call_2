"use client";

import { useNavigate } from "react-router-dom";
import background2 from "../assets/background2.png";
import byteiqLogo from "../assets/byteiq_logo.jpeg";
import Navbar from "../components/Navbar";
import About from "../components/About";
import Pricing from "../components/Pricing";
import Footer from "../components/Footer";

export default function Dashboard() {
  const navigate = useNavigate();

  const slogans = [
    "Break Language Barriers in Real-Time.",
    "Connect Globally with Seamless Communication.",
    "Empower Your Meetings with AI-Driven Translation.",
    "Transform Conversations Across Languages Effortlessly.",
    "Unite Teams Worldwide with Instant Translation.",
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Navigation */}
      <Navbar />
      {/* Hero Section */}
      <div
        className="relative overflow-hidden"
        style={{
          backgroundColor: "#f5f5f5",
          backgroundImage: `
          linear-gradient(to right, rgba(0, 0, 0, 0.08) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0, 0, 0, 0.08) 1px, transparent 1px)
        `,
          backgroundSize: "80px 80px",
          animation: "gridMove 5s linear infinite",
        }}
      >
        <div className="max-w-7xl mx-auto px-8 py-12 min-h-[calc(100vh-80px)] flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-25 items-center w-full">
            {/* Image */}
            <div className="flex justify-center lg:justify-start">
              <div className="rounded-2xl overflow-hidden shadow-2xl max-w-[1200px] w-full">
                <img
                  src={background2}
                  alt="Professional woman in video call"
                  className="w-full h-auto min-h-[600px] object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-8 mr-10">
              <h2 className="text-6xl lg:text-6xl font-bold leading-tight">
                Break Language Barriers{" "}
                <span className="block">
                  in{" "}
                  <span className=" font-bold text-blue-700">Real-Time.</span>
                </span>
                <span className="block text-green-800">Connect Globally.</span>
              </h2>

              <div className="flex flex-wrap gap-4">
                <button
                  className="bg-[#1a1d2e] text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-[#2a2d3e] transition-colors"
                  onClick={() => navigate("/meeting")}
                >
                  Join Meeting
                </button>
                <button
                  className="bg-white text-black border-2 border-gray-300 px-8 py-4 rounded-lg text-lg font-medium hover:border-gray-400 transition-colors"
                  onClick={() => navigate("/meeting")}
                >
                  Create Meeting
                </button>
                {/* <button className="bg-white text-black border-2 border-gray-300 px-8 py-4 rounded-lg text-lg font-medium hover:border-gray-400 transition-colors">
                  Schedule Meeting
                </button> */}
              </div>
            </div>
          </div>
        </div>

        {/* Dark mode toggle button (bottom right) */}
        <button className="fixed bottom-8 right-8 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow border border-gray-200">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        </button>
      </div>

      {/* About Section */}
      <About />
      {/* ================= PRICING SECTION ================= */}
      <Pricing />
      {/* ================= FOOTER ================= */}
      <Footer />

      <style jsx global>{`
        @keyframes gridMove {
          0% {
            background-position: 0 0, 0 0;
          }
          100% {
            background-position: 40px 40px, 40px 40px;
          }
        }
      `}</style>
    </div>
  );
}
