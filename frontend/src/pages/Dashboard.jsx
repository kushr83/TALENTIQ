import { Link } from "react-router-dom";

function Dashboard() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-slate-800">

        <Link
          to="/"
          className="text-2xl font-bold"
        >
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


      {/* Main Dashboard */}
      <main className="max-w-7xl mx-auto px-8 py-12">

        {/* Welcome */}
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


        {/* Career Overview */}
        <section className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-slate-400">
              Profile Completion
            </p>

            <h2 className="text-3xl font-bold mt-3">
              20%
            </h2>

            <div className="w-full bg-slate-800 rounded-full h-2 mt-5">

              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: "20%" }}
              />

            </div>

            <p className="text-sm text-slate-500 mt-3">
              Complete your profile to improve recommendations.
            </p>

          </div>


          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-slate-400">
              Skills Added
            </p>

            <h2 className="text-3xl font-bold mt-3">
              0
            </h2>

            <p className="text-sm text-slate-500 mt-5">
              Add your technical and professional skills.
            </p>

          </div>


          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-slate-400">
              Career Matches
            </p>

            <h2 className="text-3xl font-bold mt-3">
              0
            </h2>

            <p className="text-sm text-slate-500 mt-5">
              Complete your profile to discover opportunities.
            </p>

          </div>

        </section>


        {/* AI Features */}
        <section>

          <h2 className="text-2xl font-semibold mb-6">
            Career Intelligence
          </h2>

          <div className="grid md:grid-cols-2 gap-6">


            {/* Resume */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">

              <div className="text-3xl mb-4">
                📄
              </div>

              <h3 className="text-xl font-semibold">
                Resume Intelligence
              </h3>

              <p className="text-slate-400 mt-3">
                Upload your resume and let TalentIQ analyze your
                skills, experience and career strengths.
              </p>

              <button className="mt-6 px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg">
                Upload Resume
              </button>

            </div>


            {/* Skills */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">

              <div className="text-3xl mb-4">
                🧠
              </div>

              <h3 className="text-xl font-semibold">
                Skill Gap Analysis
              </h3>

              <p className="text-slate-400 mt-3">
                Discover which skills you need to develop
                for your target career.
              </p>

              <button className="mt-6 px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg">
                Analyze Skills
              </button>

            </div>


            {/* Opportunities */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">

              <div className="text-3xl mb-4">
                🎯
              </div>

              <h3 className="text-xl font-semibold">
                Opportunity Matching
              </h3>

              <p className="text-slate-400 mt-3">
                Find internships and jobs that match your
                skills and career goals.
              </p>

              <button className="mt-6 px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg">
                Find Opportunities
              </button>

            </div>


            {/* Roadmap */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">

              <div className="text-3xl mb-4">
                🚀
              </div>

              <h3 className="text-xl font-semibold">
                Career Roadmap
              </h3>

              <p className="text-slate-400 mt-3">
                Build a personalized roadmap to reach your
                target career.
              </p>

              <button className="mt-6 px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg">
                Build Roadmap
              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;