import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  const cardClass =
    "bg-slate-900 border border-slate-800 rounded-xl p-6 transition duration-200 hover:border-blue-500/50 hover:-translate-y-1";

  const buttonClass =
    "inline-block px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-medium transition-colors";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-slate-800">
        <Link to="/dashboard" className="text-2xl font-bold">
          Talent<span className="text-blue-500">IQ</span>
        </Link>

        <div className="flex items-center gap-5">
          <span className="text-slate-300">
            {user?.name || "User"}
          </span>

          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-900"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Dashboard content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        <section className="mb-10">
          <p className="text-blue-400 mb-2">
            Welcome back 👋
          </p>

          <h1 className="text-4xl font-bold">
            {user?.name || "User"}
          </h1>

          <p className="text-slate-400 mt-3">
            Your AI-powered career intelligence dashboard.
          </p>
        </section>

        {/* Overview cards */}
        <section className="grid md:grid-cols-3 gap-6 mb-12">
          <div className={cardClass}>
            <p className="text-slate-400 text-sm">
              Profile Completion
            </p>

            <h2 className="text-3xl font-bold mt-3">20%</h2>

            <p className="text-slate-500 text-sm mt-2">
              Complete your career profile.
            </p>
          </div>

          <div className={cardClass}>
            <p className="text-slate-400 text-sm">
              Skills Added
            </p>

            <h2 className="text-3xl font-bold mt-3">0</h2>

            <p className="text-slate-500 text-sm mt-2">
              Your skills will appear here.
            </p>
          </div>

          <div className={cardClass}>
            <p className="text-slate-400 text-sm">
              Career Matches
            </p>

            <h2 className="text-3xl font-bold mt-3">0</h2>

            <p className="text-slate-500 text-sm mt-2">
              Matching opportunities will appear here.
            </p>
          </div>
        </section>

        {/* Career intelligence features */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">
            Career Intelligence
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Resume Intelligence */}
            <div className={cardClass}>
              <div className="text-3xl mb-4">📄</div>

              <h3 className="text-xl font-semibold mb-3">
                Resume Intelligence
              </h3>

              <p className="text-slate-400 mb-5 leading-6">
                Upload your resume, extract its text, and analyze your skills
                against your target job description.
              </p>

              <Link
                to="/resume-analyzer"
                className={buttonClass}
              >
                Analyze Resume →
              </Link>
            </div>

            {/* NEW: Resume Improvement Studio */}
            <div className={`${cardClass} border-cyan-500/30`}>
              <div className="text-3xl mb-4">✨</div>

              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <h3 className="text-xl font-semibold">
                  Resume Improvement Studio
                </h3>

                <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  NEW
                </span>
              </div>

              <p className="text-slate-400 mb-5 leading-6">
                Analyze resume bullet points, identify vague statements, and
                discover practical ways to strengthen your resume.
              </p>

              <Link
                to="/resume-improver"
                className="inline-block px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-semibold transition-colors"
              >
                Improve My Resume →
              </Link>
            </div>

            {/* Skill Gap Analysis */}
            <div className={cardClass}>
              <div className="text-3xl mb-4">🎯</div>

              <h3 className="text-xl font-semibold mb-3">
                Skill Gap Analysis
              </h3>

              <p className="text-slate-400 mb-5 leading-6">
                Discover which skills you need for your target role.
              </p>

              <button
                type="button"
                disabled
                className="px-4 py-2 rounded-lg bg-blue-600/50 text-slate-300 cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>

            {/* Opportunity Matching */}
            <div className={cardClass}>
              <div className="text-3xl mb-4">💼</div>

              <h3 className="text-xl font-semibold mb-3">
                Opportunity Matching
              </h3>

              <p className="text-slate-400 mb-5 leading-6">
                Find jobs and internships that match your profile.
              </p>

              <button
                type="button"
                disabled
                className="px-4 py-2 rounded-lg bg-blue-600/50 text-slate-300 cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>

            {/* Career Roadmap */}
            <div className={cardClass}>
              <div className="text-3xl mb-4">🗺️</div>

              <h3 className="text-xl font-semibold mb-3">
                Career Roadmap
              </h3>

              <p className="text-slate-400 mb-5 leading-6">
                Plan your learning journey toward your target career.
              </p>

              <button
                type="button"
                disabled
                className="px-4 py-2 rounded-lg bg-blue-600/50 text-slate-300 cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;