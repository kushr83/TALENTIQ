function Hero() {
  return (
    <section className="text-center py-24">

      <div className="inline-block px-4 py-2 mb-6 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
        AI-Powered Career Intelligence
      </div>

      <h1 className="text-5xl md:text-6xl font-bold leading-tight">
        Turn Your Skills Into
        <span className="text-blue-500"> Opportunities</span>
      </h1>

      <p className="max-w-2xl mx-auto mt-6 text-lg text-slate-400">
        Analyze your resume, discover your skill gaps, find the right
        opportunities and build a personalized career roadmap.
      </p>

      <div className="flex justify-center gap-4 mt-10">
        <button className="px-7 py-3 bg-blue-600 rounded-lg font-medium hover:bg-blue-700">
          Analyze My Career
        </button>

        <button className="px-7 py-3 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-900">
          Explore Opportunities
        </button>
      </div>

    </section>
  );
}

export default Hero;