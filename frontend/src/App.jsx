import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeatureCard from "./components/FeatureCard";

function App() {
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

export default App;