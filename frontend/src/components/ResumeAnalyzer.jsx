
import "./ResumeAnalyzer.css";
import { useState } from "react";

function ResumeAnalyzer() {
  const [resume, setResume] = useState(null);

  function handleResumeChange(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setResume(file);
  }

  function removeResume() {
    setResume(null);
  }

  return (
    <section className="resume-analyzer-section">
      <div className="resume-analyzer-header">
        <div>
          <p className="eyebrow">02 / RESUME INTELLIGENCE</p>

          <h2>
            Understand your
            <br />
            <em>career profile.</em>
          </h2>

          <p className="resume-analyzer-description">
            Upload your resume and Jobly will analyze
            your skills, strengths, weaknesses and
            suitable career opportunities.
          </p>
        </div>

        <div className="resume-analyzer-icon">
          ✦
        </div>
      </div>

      <div className="resume-upload-card">
        {!resume ? (
          <>
            <div className="resume-upload-icon">
              ↑
            </div>

            <h3>Upload your resume</h3>

            <p>
              Upload your latest resume to start
              your career analysis.
            </p>

            <label
              htmlFor="resume-upload"
              className="resume-upload-button"
            >
              Choose Resume
              <span>→</span>
            </label>

            <input
              id="resume-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
              hidden
            />

            <small>
              Supported formats: PDF, DOC, DOCX
            </small>
          </>
        ) : (
          <div className="resume-selected">
            <div className="resume-file-icon">
              PDF
            </div>

            <div className="resume-file-info">
              <strong>{resume.name}</strong>

              <span>
                {(resume.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>

            <button
              type="button"
              className="resume-remove-button"
              onClick={removeResume}
            >
              ×
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default ResumeAnalyzer;