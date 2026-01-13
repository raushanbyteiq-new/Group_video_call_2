// import React from "react";

export default function About() {
  return (
    <>
      <div className="bg-gray-50 py-20 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-gray-900">
              About Our Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Smart video meetings powered by AI — translate, track, and
              summarize every conversation effortlessly.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-100 to-white border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                Real-Time Translation
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Communicate without language barriers. Our AI instantly
                translates conversations during live meetings, enabling seamless
                collaboration across global teams.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-100 to-white border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                Meeting History
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Access complete meeting records anytime. View past calls,
                transcripts, and participant details — all securely stored for
                future reference.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-100 to-white border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5-7H4a2 2 0 00-2 2v14l4-4h14a2 2 0 002-2V5a2 2 0 00-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                Meeting Summarization
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Automatically generate concise meeting summaries with key
                discussion points, decisions, and action items — no manual notes
                required.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h4 className="text-5xl font-bold text-gray-900 mb-2">100+</h4>
              <p className="text-gray-600">Languages Supported</p>
            </div>
            <div>
              <h4 className="text-5xl font-bold text-gray-900 mb-2">5M+</h4>
              <p className="text-gray-600">Meetings Processed</p>
            </div>
            <div>
              <h4 className="text-5xl font-bold text-gray-900 mb-2">99.9%</h4>
              <p className="text-gray-600">System Reliability</p>
            </div>
            <div>
              <h4 className="text-5xl font-bold text-gray-900 mb-2">24/7</h4>
              <p className="text-gray-600">AI Availability</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
