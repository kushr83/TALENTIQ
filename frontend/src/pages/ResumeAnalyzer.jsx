import { useState } from "react";
import { Link } from "react-router-dom";

function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resume, setResume] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    setResume(null);
    setMessage("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (
      selectedFile.type !== "application/pdf" ||
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setFile(null);
      setMessage("Please select a PDF file.");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setFile(null);
      setMessage("Your PDF must be 5 MB or smaller.");
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

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch(
        "http://localhost:5000/api/resume/analyze",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-slate-800">
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
          Upload your PDF resume to extract text and identify
          skills mentioned in it.
        </p>

        <form
          onSubmit={handleUpload}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8"
        >
          <label
            htmlFor="resume"
            className="block text-sm font-medium text-slate-300 mb-3"
          >
            Choose your resume (PDF, maximum 5 MB)
          </label>

          <input
            id="resume"
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-3 file:font-medium file:text-white hover:file:bg-blue-700"
          />

          {file && (
            <p className="text-slate-400 text-sm mt-3">
              Selected: {file.name}
            </p>
          )}

          <button
            type="submit"
            disabled={!file || loading}
            className="mt-6 w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium"
          >
            {loading ? "Analyzing resume..." : "Analyze Resume"}
          </button>

          {message && (
            <p
              role="status"
              className={`mt-5 text-sm ${
                resume ? "text-green-400" : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}
        </form>

        {resume && (
          <section className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-semibold">
              Resume Analysis Results
            </h2>

            {/* Resume statistics */}
            <div className="grid sm:grid-cols-3 gap-4 mt-6 mb-8">
              <div className="bg-slate-950 rounded-lg p-4">
                <p className="text-slate-400 text-sm">File</p>
                <p className="font-medium mt-2 break-words">
                  {resume.fileName}
                </p>
              </div>

              <div className="bg-slate-950 rounded-lg p-4">
                <p className="text-slate-400 text-sm">Pages</p>
                <p className="text-2xl font-bold mt-2">
                  {resume.pages}
                </p>
              </div>

              <div className="bg-slate-950 rounded-lg p-4">
                <p className="text-slate-400 text-sm">Characters</p>
                <p className="text-2xl font-bold mt-2">
                  {resume.characterCount}
                </p>
              </div>
            </div>

            {/* Detected skills */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">
                Detected Skills ({resume.skillsFound ?? 0})
              </h3>

              {resume.skills?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
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
                <p className="text-slate-400 text-sm">
                  No skills from the current detection list were found.
                  This list can be expanded in future versions.
                </p>
              )}

              <p className="text-slate-500 text-xs mt-3">
                Skills are identified by keyword matching, not by
                verifying your proficiency.
              </p>
            </div>

            {/* Extracted text */}
            <h3 className="text-lg font-semibold mb-3">
              Extracted Resume Text
            </h3>

            <pre className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-300 bg-slate-950 border border-slate-800 rounded-xl p-5 max-h-[500px] overflow-y-auto">
              {resume.text}
            </pre>
          </section>
        )}
      </main>
    </div>
  );
}

export default ResumeAnalyzer;