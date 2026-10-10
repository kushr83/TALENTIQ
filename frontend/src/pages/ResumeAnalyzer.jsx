import { useState } from "react";
import { Link } from "react-router-dom";

const SKILL_KEYWORDS = [
  "C++", "Python", "Java", "JavaScript", "TypeScript",
  "HTML", "CSS", "React", "Next.js", "Node.js", "Express",
  "FastAPI", "Flask", "Django", "SQL", "MySQL",
  "PostgreSQL", "MongoDB", "DuckDB", "Git", "GitHub",
  "Linux", "Data Structures", "Algorithms", "OOP",
  "Machine Learning", "Deep Learning", "Artificial Intelligence",
  "Natural Language Processing", "Data Analysis", "Statistics",
  "TensorFlow", "PyTorch", "Scikit-learn", "NumPy", "Pandas",
  "REST API", "Docker", "Kubernetes", "AWS", "Nginx",
  "Communication", "Problem Solving", "System Design",
  "Jenkins", "Android Studio", "DevOps",
];

function findSkills(text) {
  const lowerText = text.toLowerCase();

  return SKILL_KEYWORDS.filter((skill) => {
    const escaped = skill.toLowerCase().replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const pattern = new RegExp(
      `(^|[^a-z0-9+#])${escaped}(?=$|[^a-z0-9+#])`,
      "i"
    );

    return pattern.test(lowerText);
  });
}

function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [matchResult, setMatchResult] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    setFile(null);
    setResume(null);
    setMatchResult(null);
    setMessage("");

    if (!selectedFile) return;

    if (
      selectedFile.type !== "application/pdf" ||
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setMessage("Please select a PDF file.");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      setMessage("Your PDF must be 50 MB or smaller.");
      event.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage("Please select a PDF resume first.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please log in before uploading your resume.");
      return;
    }

    setLoading(true);
    setMessage("");
    setResume(null);
    setMatchResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch(
        "http://localhost:5000/api/resume/analyze",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to analyze your resume.");
        return;
      }

      setResume(data.resume);
      setMessage(data.message);
    } catch (error) {
      console.error("Resume upload error:", error);
      setMessage("Unable to connect to the TalentIQ server.");
    } finally {
      setLoading(false);
    }
  };

  const handleJobMatch = (event) => {
    event.preventDefault();
    setMatchResult(null);
    setMessage("");

    if (!resume) {
      setMessage("Analyze your resume first.");
      return;
    }

    if (!jobDescription.trim()) {
      setMessage("Please paste a job description.");
      return;
    }

    const requiredSkills = findSkills(jobDescription);

    if (requiredSkills.length === 0) {
      setMessage(
        "No recognized skills found. Try including skills such as Python, SQL, React, or AWS."
      );
      return;
    }

    const resumeSkills = new Set(
      (resume.skills || []).map((skill) => skill.toLowerCase())
    );

    const matchedSkills = requiredSkills.filter((skill) =>
      resumeSkills.has(skill.toLowerCase())
    );

    const missingSkills = requiredSkills.filter(
      (skill) => !resumeSkills.has(skill.toLowerCase())
    );

    setMatchResult({
      requiredSkills,
      matchedSkills,
      missingSkills,
      percentage: Math.round(
        (matchedSkills.length / requiredSkills.length) * 100
      ),
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="flex justify-between items-center px-6 md:px-10 py-5 border-b border-slate-800">
        <Link to="/" className="text-2xl font-bold">
          Talent<span className="text-blue-500">IQ</span>
        </Link>
        <Link
          to="/dashboard"
          className="text-slate-300 hover:text-white"
        >
          Back to Dashboard
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <p className="text-blue-400 mb-3">RESUME INTELLIGENCE</p>
        <h1 className="text-3xl md:text-4xl font-bold">
          Understand your resume
        </h1>
        <p className="text-slate-400 mt-3 mb-8">
          Upload your PDF resume to extract text and identify skills.
        </p>

        <form
          onSubmit={handleUpload}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8"
        >
         <label
  htmlFor="resume"
  className="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-500/60 bg-slate-950 px-6 py-8 text-center transition hover:border-blue-400 hover:bg-blue-500/5"
>
  <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/15 text-blue-400">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 16V4" />
      <path d="m7 9 5-5 5 5" />
      <path d="M20 16.5v2A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5v-2" />
    </svg>
  </span>

  <span className="text-lg font-semibold text-white">
    Upload Resume PDF
  </span>

  <span className="mt-2 text-sm text-slate-400">
    Click here to browse files on your device
  </span>

  <span className="mt-1 text-xs text-slate-500">
    PDF format · Maximum 50 MB
  </span>
</label>

<input
  id="resume"
  name="resume"
  type="file"
  accept=".pdf,application/pdf"
  onChange={handleFileChange}
  className="sr-only"
/>

          {file && (
            <p className="text-slate-400 text-sm mt-3">
              Selected: {file.name}
            </p>
          )}

          <button
            type="submit"
            disabled={!file || loading}
            className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg font-medium"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </form>

        {message && (
          <p role="status" className="mt-5 text-sm text-blue-300">
            {message}
          </p>
        )}

        {resume && (
          <>
            <section className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-semibold">
                Resume Analysis Results
              </h2>

              <div className="grid sm:grid-cols-3 gap-4 my-6">
                <div className="bg-slate-950 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">File</p>
                  <p className="mt-2 break-words">{resume.fileName}</p>
                </div>
                <div className="bg-slate-950 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Pages</p>
                  <p className="text-2xl font-bold mt-2">{resume.pages}</p>
                </div>
                <div className="bg-slate-950 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Characters</p>
                  <p className="text-2xl font-bold mt-2">
                    {resume.characterCount}
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-3">
                Detected Skills ({resume.skillsFound ?? resume.skills?.length ?? 0})
              </h3>

              {resume.skills?.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-4">
                  {resume.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-sm mb-4">
                  No recognized skills were found.
                </p>
              )}

              <p className="text-slate-500 text-xs">
                Keyword detection does not verify your proficiency.
              </p>

              <h3 className="text-lg font-semibold mt-8 mb-3">
                Extracted Resume Text
              </h3>
              <pre className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-300 bg-slate-950 border border-slate-800 rounded-xl p-5 max-h-[400px] overflow-y-auto">
                {resume.text}
              </pre>
            </section>

            <section className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
              <p className="text-blue-400 text-sm mb-2">
                CAREER INTELLIGENCE
              </p>
              <h2 className="text-2xl font-semibold">
                Job Description Matching
              </h2>
              <p className="text-slate-400 text-sm mt-3 mb-5">
                Compare the recognized skills in your resume with a job's requirements.
              </p>

              <form onSubmit={handleJobMatch}>
                <label
                  htmlFor="jobDescription"
                  className="block text-sm text-slate-300 mb-3"
                >
                  Paste job description
                </label>

                <textarea
                  id="jobDescription"
                  rows={7}
                  value={jobDescription}
                  onChange={(event) => {
                    setJobDescription(event.target.value);
                    setMatchResult(null);
                  }}
                  placeholder="Example: We need Python, SQL, Machine Learning, AWS, and Docker skills..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 p-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />

                <button
                  type="submit"
                  className="mt-5 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
                >
                  Match Job Description
                </button>
              </form>

              {matchResult && (
                <div className="mt-8">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                    <p className="text-slate-400 text-sm">
                      Keyword match
                    </p>
                    <p className="text-4xl font-bold text-blue-400 mt-2">
                      {matchResult.percentage}%
                    </p>
                    <p className="text-slate-400 text-sm mt-2">
                      {matchResult.matchedSkills.length} of{" "}
                      {matchResult.requiredSkills.length} recognized skills matched
                    </p>
                    <div className="w-full bg-slate-800 rounded-full h-3 mt-4">
                      <div
                        className="bg-blue-500 h-3 rounded-full"
                        style={{ width: `${matchResult.percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5 mt-6">
                    <div className="bg-slate-950 border border-green-800/50 rounded-xl p-5">
                      <h3 className="font-semibold text-green-400 mb-4">
                        Matched Skills ({matchResult.matchedSkills.length})
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {matchResult.matchedSkills.length ? (
                          matchResult.matchedSkills.map((skill) => (
                            <span
                              key={skill}
                              className="px-3 py-2 rounded-lg bg-green-500/10 text-green-300 text-sm"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-slate-400 text-sm">
                            No matching skills found.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-amber-800/50 rounded-xl p-5">
                      <h3 className="font-semibold text-amber-400 mb-4">
                        Missing Skills ({matchResult.missingSkills.length})
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {matchResult.missingSkills.length ? (
                          matchResult.missingSkills.map((skill) => (
                            <span
                              key={skill}
                              className="px-3 py-2 rounded-lg bg-amber-500/10 text-amber-300 text-sm"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-slate-400 text-sm">
                            All recognized required skills were found.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-500 text-xs mt-5">
                    This is a keyword-overlap score, not an ATS score or a prediction of hiring success.
                  </p>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default ResumeAnalyzer;