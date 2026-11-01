import { useState } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "talentiq_resume_analysis";

function getSavedResume() {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);

    if (!saved) return null;

    const parsed = JSON.parse(saved);

    if (typeof parsed.text !== "string") return null;

    return parsed;
  } catch {
    return null;
  }
}

function improveBullet(text) {
  let improved = text.trim();

  const replacements = [
    [/^worked on\b/i, "Contributed to"],
    [/^helped with\b/i, "Supported"],
    [/^responsible for\b/i, "Handled"],
    [/^involved in\b/i, "Contributed to"],
    [/^good knowledge of\b/i, "Knowledge of"],
  ];

  for (const [pattern, replacement] of replacements) {
    if (pattern.test(improved)) {
      improved = improved.replace(pattern, replacement);
      break;
    }
  }

  if (improved && !/[.!?]$/.test(improved)) {
    improved += ".";
  }

  return improved;
}

function analyzeBullet(text) {
  const suggestions = [];
  const lower = text.toLowerCase();

  if (text.trim().length < 40) {
    suggestions.push(
      "Add more context about the task, technology, or problem you worked on."
    );
  }

  if (
    ["worked on", "helped with", "involved in", "responsible for"].some(
      (phrase) => lower.includes(phrase)
    )
  ) {
    suggestions.push(
      "Use a more precise action verb that accurately describes your contribution."
    );
  }

  if (!/\d/.test(text)) {
    suggestions.push(
      "If you have a verifiable measurement, consider including it to demonstrate impact."
    );
  }

  if (text.length > 250) {
    suggestions.push(
      "Consider shortening this statement to make its main point easier to scan."
    );
  }

  if (suggestions.length === 0) {
    suggestions.push(
      "This statement looks reasonably clear. Verify that it accurately represents your work."
    );
  }

  return suggestions;
}

export default function ResumeImprover() {
  const [savedResume] = useState(() => getSavedResume());

  const [resumeText, setResumeText] = useState(
    () => getSavedResume()?.text || ""
  );

  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const skills = Array.isArray(savedResume?.skills)
    ? savedResume.skills
    : [];

  function handleAnalyze(event) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setResults([]);

    if (!resumeText.trim()) {
      setError(
        "No resume text is available. Analyze your resume first or paste the text below."
      );
      return;
    }

    const bullets = resumeText
      .split(/\n/)
      .map((line) => line.replace(/^[\s•\-*]+/, "").trim())
      .filter((line) => line.length > 0);

    if (bullets.length === 0) {
      setError("Please enter some resume content.");
      return;
    }

    const analyzed = bullets.map((bullet, index) => ({
      id: index + 1,
      original: bullet,
      improved: improveBullet(bullet),
      suggestions: analyzeBullet(bullet),
    }));

    setResults(analyzed);
  }

  function updateImprovedText(id, value) {
    setResults((current) =>
      current.map((item) =>
        item.id === id ? { ...item, improved: value } : item
      )
    );

    setSuccess("");
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess("Text copied to clipboard.");
      setError("");
    } catch {
      setError(
        "Clipboard access failed. Select the text and copy it manually."
      );
      setSuccess("");
    }
  }

  async function copyAll() {
    const text = results
      .map((item) => item.improved.trim())
      .filter(Boolean)
      .join("\n");

    if (!text) {
      setError("There is no improved text to copy.");
      return;
    }

    await copyText(text);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="flex items-center justify-between gap-4 border-b border-slate-800 px-6 py-5 md:px-10">
        <Link to="/dashboard" className="text-2xl font-bold">
          Talent<span className="text-blue-500">IQ</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/resume-analyzer"
            className="text-sm text-slate-300 hover:text-white"
          >
            Resume Analyzer
          </Link>

          <Link
            to="/dashboard"
            className="text-sm text-slate-300 hover:text-white"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-5 py-10 md:px-8">
        <p className="mb-3 text-sm font-semibold tracking-widest text-cyan-400">
          TALENTIQ CAREER INTELLIGENCE
        </p>

        <h1 className="text-3xl font-bold md:text-4xl">
          Resume Improvement Studio
        </h1>

        <p className="mt-3 max-w-3xl leading-7 text-slate-400">
          Review your resume statements, improve wording, and prepare
          clearer content for your next application.
        </p>

        {/* Resume source */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">
              Your analyzed resume
            </h2>

            {savedResume ? (
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">
                Resume loaded
              </span>
            ) : (
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-sm text-amber-300">
                No saved analysis found
              </span>
            )}
          </div>

          {savedResume ? (
            <>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-950 p-4">
                  <p className="text-sm text-slate-400">File</p>
                  <p className="mt-2 break-words font-medium">
                    {savedResume.fileName || "Uploaded resume"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-950 p-4">
                  <p className="text-sm text-slate-400">Pages</p>
                  <p className="mt-2 text-2xl font-bold">
                    {savedResume.pages ?? "—"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-950 p-4">
                  <p className="text-sm text-slate-400">
                    Detected skills
                  </p>
                  <p className="mt-2 text-2xl font-bold">
                    {skills.length}
                  </p>
                </div>
              </div>

              <h3 className="mt-6 font-semibold">Detected skills</h3>

              {skills.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm text-blue-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-400">
                  No recognized skills were found in the saved analysis.
                </p>
              )}

              <p className="mt-4 text-xs leading-5 text-slate-500">
                Detected keywords do not verify your proficiency.
              </p>
            </>
          ) : (
            <div className="mt-4">
              <p className="leading-7 text-slate-400">
                Upload and analyze a PDF in Resume Analyzer first.
                Your extracted text and detected skills will then appear
                here automatically.
              </p>

              <Link
                to="/resume-analyzer"
                className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-3 font-medium hover:bg-blue-700"
              >
                Analyze My Resume →
              </Link>
            </div>
          )}
        </section>

        {/* Resume text */}
        <form
          onSubmit={handleAnalyze}
          className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6"
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Resume content</h2>

            <button
              type="button"
              onClick={() => setResumeText(savedResume?.text || "")}
              disabled={!savedResume}
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reload analyzed resume
            </button>
          </div>

          <p className="mb-4 text-sm leading-6 text-slate-400">
            Your extracted resume text is filled in automatically when
            an analyzed resume is available. You can edit it before
            generating suggestions.
          </p>

          <textarea
            value={resumeText}
            onChange={(event) => setResumeText(event.target.value)}
            rows={14}
            maxLength={30000}
            placeholder="Your analyzed resume text will appear here. You can also paste text manually."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm leading-7 text-white outline-none focus:border-cyan-500"
          />

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
            >
              Improve Resume Content
            </button>

            <button
              type="button"
              onClick={() => {
                setResumeText("");
                setResults([]);
                setError("");
                setSuccess("");
              }}
              className="rounded-xl border border-slate-700 px-6 py-3 font-medium text-slate-300 hover:bg-slate-800"
            >
              Clear editor
            </button>
          </div>
        </form>

        {error && (
          <p
            role="alert"
            className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
          >
            {error}
          </p>
        )}

        {success && (
          <p
            role="status"
            className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300"
          >
            {success}
          </p>
        )}

        {/* Results */}
        {results.length > 0 && (
          <section className="mt-10">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Improvement results</h2>
                <p className="mt-2 text-slate-400">
                  Review and edit each suggestion before using it.
                </p>
              </div>

              <button
                type="button"
                onClick={copyAll}
                className="rounded-lg bg-blue-600 px-4 py-3 font-medium hover:bg-blue-700"
              >
                Copy All Improved Text
              </button>
            </div>

            <div className="space-y-6">
              {results.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                >
                  <h3 className="mb-3 font-semibold text-cyan-300">
                    Statement {item.id}
                  </h3>

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Original statement
                  </p>

                  <p className="mt-2 break-words leading-7 text-slate-300">
                    {item.original}
                  </p>

                  <div className="mt-5">
                    <label
                      htmlFor={`improved-${item.id}`}
                      className="text-xs font-semibold uppercase tracking-wider text-emerald-300"
                    >
                      Suggested version — editable
                    </label>

                    <textarea
                      id={`improved-${item.id}`}
                      value={item.improved}
                      onChange={(event) =>
                        updateImprovedText(item.id, event.target.value)
                      }
                      rows={3}
                      className="mt-2 w-full rounded-xl border border-emerald-500/20 bg-slate-950 p-4 leading-7 text-white outline-none focus:border-emerald-400"
                    />

                    <button
                      type="button"
                      onClick={() => copyText(item.improved)}
                      className="mt-3 rounded-lg border border-emerald-500/30 px-4 py-2 text-sm text-emerald-300 hover:bg-emerald-500/10"
                    >
                      Copy Improved Version
                    </button>
                  </div>

                  <div className="mt-5 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                    <h4 className="mb-3 font-semibold text-blue-300">
                      Further suggestions
                    </h4>

                    <ul className="space-y-2">
                      {item.suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className="text-sm leading-6 text-slate-300"
                        >
                          • {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm leading-6 text-amber-100">
              <strong>Important:</strong> This version uses basic,
              rule-based rewriting, not a real AI model. Review every
              suggestion and only include skills, responsibilities, and
              achievements that accurately represent your experience.
              Add numbers only when you can verify them.
            </div>
          </section>
        )}
      </main>
    </div>
  );
}