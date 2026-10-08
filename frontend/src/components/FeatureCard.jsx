function FeatureCard({ title, description }) {
  return (
    <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
      <h2 className="text-xl font-semibold mb-3">
        {title}
      </h2>

      <p className="text-slate-400">
        {description}
      </p>
    </div>
  );
}

export default FeatureCard;