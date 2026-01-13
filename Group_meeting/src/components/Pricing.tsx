// import React from "react";

export default function Pricing() {
  return (
    <>
      <div className="bg-white py-24 px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-gray-900">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start free, scale as you grow. No hidden charges, no surprises.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="p-10 rounded-2xl border border-gray-200 bg-gray-50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4">Free</h3>
              <p className="text-gray-600 mb-6">Perfect for trying ByteIQ</p>

              <div className="mb-6">
                <div className="text-5xl font-bold text-gray-900">$0</div>
                <div className="text-gray-500">/month</div>
              </div>

              <ul className="space-y-4 text-gray-600 mb-8">
                <li>✔ 40 min meetings</li>
                <li>✔ Real-time translation</li>
                <li>✔ Basic meeting history</li>
                <li>✔ 5 participants</li>
              </ul>

              <button className="w-full bg-white border-2 border-gray-300 text-gray-900 py-3 rounded-lg font-semibold hover:border-gray-400 transition-colors">
                Get Started
              </button>
            </div>

            {/* Pro Plan (Highlighted) */}
            <div className="p-10 rounded-2xl border-2 border-blue-600 bg-white shadow-2xl scale-[1.03]">
              <span className="inline-block mb-4 px-4 py-1 text-sm font-semibold text-blue-600 bg-blue-50 rounded-full">
                Most Popular
              </span>

              <h3 className="text-2xl font-bold mb-4">Pro</h3>
              <p className="text-gray-600 mb-6">
                For teams that meet every day
              </p>

              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">$29</span>
                <span className="text-gray-500">/month</span>
              </div>

              <ul className="space-y-4 text-gray-600 mb-8">
                <li>✔ Unlimited meeting duration</li>
                <li>✔ AI meeting summaries</li>
                <li>✔ Full meeting history</li>
                <li>✔ Up to 50 participants</li>
                <li>✔ Priority support</li>
              </ul>

              <button className="w-full bg-[#1a1d2e] text-white py-3 rounded-lg font-semibold hover:bg-[#2a2d3e] transition-colors">
                Upgrade to Pro
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="p-10 rounded-2xl border border-gray-200 bg-gray-50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
              <p className="text-gray-600 mb-6">
                Advanced security & custom needs
              </p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">Custom</span>
              </div>

              <ul className="space-y-4 text-gray-600 mb-8">
                <li>✔ Unlimited participants</li>
                <li>✔ Dedicated infrastructure</li>
                <li>✔ Advanced analytics</li>
                <li>✔ SLA & enterprise support</li>
                <li>✔ Custom integrations</li>
              </ul>

              <button className="w-full bg-white border-2 border-gray-300 text-gray-900 py-3 rounded-lg font-semibold hover:border-gray-400 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
