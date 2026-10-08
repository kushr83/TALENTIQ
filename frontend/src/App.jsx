import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeatureCard from "./components/FeatureCard";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";


function Home() {

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Navbar />

      <main className="max-w-6xl mx-auto px-8">

        <Hero />

        <section className="grid md:grid-cols-3 gap-6 pb-24">

          <FeatureCard
            title="Resume Intelligence"
            description="Analyze your resume, identify strengths and discover areas that need improvement."
          />

          <FeatureCard
            title="Smart Matching"
            description="Find opportunities that match your skills, experience and career goals."
          />

          <FeatureCard
            title="Skill Gap Analysis"
            description="Discover what skills you need to develop for your target career."
          />

        </section>

      </main>

    </div>
  );
}


function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* Landing Page */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Register */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

      </Routes>

    </BrowserRouter>
  );
}


export default App;