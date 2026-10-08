import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            Talent<span className="text-blue-500">IQ</span>
          </h1>

          <p className="text-slate-400 mt-2">
            Start your career journey
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <h2 className="text-2xl font-semibold mb-2">
            Create your account
          </h2>

          <p className="text-slate-400 mb-6">
            Build your personalized career profile.
          </p>

          {/* Name */}
          <div className="mb-5">
            <label className="block text-sm text-slate-300 mb-2">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="block text-sm text-slate-300 mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="block text-sm text-slate-300 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Role */}
          <div className="mb-6">
            <label className="block text-sm text-slate-300 mb-2">
              I am a
            </label>

            <select
              className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="student">Student</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          {/* Register button */}
          <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium">
            Create Account
          </button>

          {/* Login Link */}
          <p className="text-center text-slate-400 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300"
            >
              Sign in
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;