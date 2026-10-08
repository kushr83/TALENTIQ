import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [message, setMessage] = useState("");


  const handleChange = (event) => {

    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });

  };


  const handleSubmit = async (event) => {

    event.preventDefault();

    try {

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        }
      );


      const data = await response.json();

      setMessage(data.message);

      console.log("Backend response:", data);

    } catch (error) {

      console.error("Registration error:", error);

      setMessage(
        "Unable to connect to the TalentIQ server."
      );

    }

  };


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


          <form onSubmit={handleSubmit}>

            {/* Name */}

            <div className="mb-5">

              <label className="block text-sm text-slate-300 mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
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
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 focus:outline-none focus:border-blue-500"
              />

            </div>


            {/* Role */}

            <div className="mb-6">

              <label className="block text-sm text-slate-300 mb-2">
                I am a
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 focus:outline-none focus:border-blue-500"
              >

                <option value="student">
                  Student
                </option>

                <option value="recruiter">
                  Recruiter
                </option>

              </select>

            </div>


            {/* Create Account */}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
            >
              Create Account
            </button>

          </form>


          {/* Backend Message */}

          {message && (
            <p className="text-center text-green-400 mt-5">
              {message}
            </p>
          )}


          {/* Login */}

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