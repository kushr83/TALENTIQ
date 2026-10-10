import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {

    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });

  };


  const handleSubmit = async (event) => {

    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        }
      );


      const data = await response.json();


      // Login failed
      if (!response.ok) {

        setMessage(data.message);
        setLoading(false);

        return;
      }


      // Save JWT token
      localStorage.setItem(
        "token",
        data.token
      );


      // Save user information
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );


      console.log(
        "Login successful:",
        data
      );


      // Go to dashboard
      navigate("/dashboard");

    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      setMessage(
        "Unable to connect to the TalentIQ server."
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">

      <div className="w-full max-w-md">


        {/* Logo */}

        <div className="text-center mb-8">

          <Link
            to="/"
            className="text-3xl font-bold"
          >
            Talent<span className="text-blue-500">IQ</span>
          </Link>

          <p className="text-slate-400 mt-2">
            Welcome back
          </p>

        </div>


        {/* Login Card */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <h2 className="text-2xl font-semibold mb-2">
            Sign in to your account
          </h2>

          <p className="text-slate-400 mb-6">
            Continue your career journey with TalentIQ.
          </p>


          <form onSubmit={handleSubmit}>


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

            <div className="mb-6">

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


            {/* Login Button */}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 rounded-lg font-medium"
            >

              {loading
                ? "Signing in..."
                : "Sign In"
              }

            </button>

          </form>


          {/* Error / Message */}

          {message && (

            <p className="text-center text-red-400 mt-5">
              {message}
            </p>

          )}


          {/* Register */}

          <p className="text-center text-slate-400 mt-6">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="text-blue-400 hover:text-blue-300"
            >
              Create one
            </Link>

          </p>

        </div>

      </div>

    </div>

  );

}

export default Login;