import { NavLink } from "react-router-dom";

function Feature({ title, text }) {
  return (
    <div className="bg-base-100 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400">{text}</p>
    </div>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
      {/* ================= NAVBAR ================= */}
      <nav className="flex justify-between items-center px-10 py-6">
        <h1 className="text-3xl font-extrabold text-primary tracking-wide">
          BitCode
        </h1>

        <div className="space-x-4">
          <NavLink to="/login" className="btn btn-outline btn-sm">
            Login
          </NavLink>
          <NavLink to="/signup" className="btn btn-primary btn-sm">
            Sign Up
          </NavLink>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <div className="flex flex-col items-center text-center mt-24 px-6">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
          Practice Coding.
          <span className="text-primary"> Build Skills.</span>
          <br />
          Get Job Ready 🚀
        </h1>

        <p className="text-gray-400 max-w-2xl text-lg">
          Solve real interview problems, collaborate in real-time, chat with AI,
          watch video solutions, and track your coding journey — all in one
          powerful platform.
        </p>

        <div className="mt-10 flex gap-6">
          <NavLink to="/signup" className="btn btn-primary btn-lg">
            Get Started
          </NavLink>

          <NavLink to="/login" className="btn btn-outline btn-lg">
            Login
          </NavLink>
        </div>
      </div>

      {/* ================= FEATURES ================= */}
      <div className="max-w-7xl mx-auto px-10 mt-28 pb-24">
        <h2 className="text-4xl font-bold text-center mb-12">
          Everything you need to become a better Coder
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          <Feature
            title="🤖 AI Assistant"
            text="Get instant help, explanations, and hints while solving problems."
          />
          <Feature
            title="🎥 Video Solutions"
            text="Watch expert walkthroughs and understand how to solve problems efficiently."
          />
          <Feature
            title="🤝 Live Collaboration"
            text="Code together with friends in real-time like Google Docs for coding."
          />
          <Feature
            title="📊 Progress Tracking"
            text="Track solved problems, accuracy, and difficulty-wise performance."
          />
          <Feature
            title="💻 Coding Problems"
            text="Practice Easy, Medium, and Hard problems curated for interviews."
          />
          <Feature
            title="🏆 Leaderboards"
            text="Compete with others and climb the ranks with your coding skills."
          />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
