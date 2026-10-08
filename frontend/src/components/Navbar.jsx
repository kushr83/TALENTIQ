import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-5 border-b border-slate-800">

      <Link to="/" className="text-2xl font-bold">
        Talent<span className="text-blue-500">IQ</span>
      </Link>

      <div className="flex items-center gap-4">

        <Link
          to="/login"
          className="px-4 py-2 text-slate-300 hover:text-white"
        >
          Login
        </Link>

        <button className="px-5 py-2 bg-blue-600 rounded-lg hover:bg-blue-700">
          Get Started
        </button>

      </div>

    </nav>
  );
}

export default Navbar;