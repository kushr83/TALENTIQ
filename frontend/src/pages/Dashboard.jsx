
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-slate-800">
        <Link to="/" className="text-2xl font-bold">
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
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <p className="text-slate-400 text-sm">
              Profile Completion
            </p>
            <h2 className="text-3xl font-bold mt-3">20%</h2>
            <p className="text-slate-500 text-sm mt-2">
              Complete your career profile.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <p className="text-slate-400 text-sm">
              Skills Added
            </p>
            <h2 className="text-3xl font-bold mt-3">0</h2>
            <p className="text-slate-500 text-sm mt-2">
              Your skills will appear here.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
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
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3">
                Resume Intelligence
              </h3>

              <p className="text-slate-400 mb-5">
                Upload your resume, extract its text, and prepare
                for skills analysis.
              </p>

              <Link
                to="/resume-analyzer"
                className="inline-block px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-medium transition-colors"
              >
                Analyze Resume
              </Link>
            </div>

            {/* Skill Gap Analysis */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3">
                Skill Gap Analysis
              </h3>

              <p className="text-slate-400 mb-5">
                Discover which skills you need for your target role.
              </p>

              <button
                disabled
                className="px-4 py-2 rounded-lg bg-blue-600/50 text-slate-300 cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>

            {/* Opportunity Matching */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3">
                Opportunity Matching
              </h3>

              <p className="text-slate-400 mb-5">
                Find jobs and internships that match your profile.
              </p>

              <button
                disabled
                className="px-4 py-2 rounded-lg bg-blue-600/50 text-slate-300 cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>

            {/* Career Roadmap */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3">
                Career Roadmap
              </h3>

              <p className="text-slate-400 mb-5">
                Plan your learning journey toward your target career.
              </p>

              <button
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