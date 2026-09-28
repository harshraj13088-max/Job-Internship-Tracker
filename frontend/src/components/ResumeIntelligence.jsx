import { useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import "./ResumeIntelligence.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

function ResumeIntelligence() {
  const fileInputRef = useRef(null);

  const [resume, setResume] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState(null);

  /* -----------------------------------------
     OPEN FILE SELECTOR
  ----------------------------------------- */

  function handleChooseResume() {
    fileInputRef.current?.click();
  }

  /* -----------------------------------------
     HANDLE RESUME UPLOAD
  ----------------------------------------- */

  async function handleResumeChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setResume(null);
    setResumeText("");
    setAnalysis(null);
    setLoading(true);

    try {
      let text = "";

      if (file.type === "application/pdf") {
        text = await extractPdfText(file);
      } else if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.name.toLowerCase().endsWith(".docx")
      ) {
        text = await extractDocxText(file);
      } else {
        throw new Error(
          "Please upload a PDF or DOCX resume."
        );
      }

      if (!text || !text.trim()) {
        throw new Error(
          "I could not find readable text in this resume."
        );
      }

      setResume(file);
      setResumeText(text.trim());

      console.log("========== RESUME UPLOADED ==========");
      console.log("File:", file.name);
      console.log("Extracted text:", text);
      console.log("=====================================");
    } catch (err) {
      console.error(
        "Resume processing error:",
        err
      );

      setError(
        err.message ||
          "Something went wrong while reading the resume."
      );

      setResume(null);
      setResumeText("");
      setAnalysis(null);
    } finally {
      setLoading(false);
    }

    // Allow the same file to be selected again.
    event.target.value = "";
  }

  /* -----------------------------------------
     EXTRACT PDF TEXT
  ----------------------------------------- */

  async function extractPdfText(file) {
    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
    }).promise;

    let fullText = "";

    for (
      let pageNumber = 1;
      pageNumber <= pdf.numPages;
      pageNumber++
    ) {
      const page = await pdf.getPage(pageNumber);

      const content = await page.getTextContent();

      const pageText = content.items
        .map((item) => item.str || "")
        .join(" ");

      fullText += pageText + "\n";
    }

    return fullText;
  }

  /* -----------------------------------------
     EXTRACT DOCX TEXT
  ----------------------------------------- */

  async function extractDocxText(file) {
    const arrayBuffer = await file.arrayBuffer();

    const result = await mammoth.extractRawText({
      arrayBuffer,
    });

    return result.value || "";
  }

  /* -----------------------------------------
     ANALYZE RESUME
  ----------------------------------------- */

  function handleAnalyzeResume() {
    if (!resumeText.trim()) {
      setError("Please upload a resume first.");
      return;
    }

    setError("");
    setIsAnalyzing(true);
    setAnalysis(null);

    // Small delay to show the analyzing state.
    setTimeout(() => {
      try {
        const text = resumeText.trim();
        const lowerText = text.toLowerCase();

        /* -----------------------------------------
           WORD + CHARACTER COUNT
        ----------------------------------------- */

        const words = text
          .split(/\s+/)
          .filter(Boolean);

        const wordCount = words.length;
        const characterCount = text.length;

        /* -----------------------------------------
           SKILL DETECTION
        ----------------------------------------- */

        const possibleSkills = [
          "python",
          "java",
          "javascript",
          "typescript",
          "c++",
          "c",
          "react",
          "react.js",
          "node.js",
          "node",
          "express",
          "html",
          "css",
          "tailwind",
          "bootstrap",
          "sql",
          "mysql",
          "postgresql",
          "mongodb",
          "git",
          "github",
          "docker",
          "aws",
          "azure",
          "machine learning",
          "data science",
          "artificial intelligence",
          "figma",
          "excel",
          "power bi",
          "tableau",
        ];

        const detectedSkills = [];

        possibleSkills.forEach((skill) => {
          if (lowerText.includes(skill)) {
            if (!detectedSkills.includes(skill)) {
              detectedSkills.push(skill);
            }
          }
        });

        /* -----------------------------------------
           RESUME SECTIONS
        ----------------------------------------- */

        const sections = [
          {
            name: "Education",
            keywords: [
              "education",
              "university",
              "college",
              "degree",
              "b.tech",
              "btech",
              "b.e",
              "bachelor",
              "school",
            ],
          },
          {
            name: "Experience",
            keywords: [
              "experience",
              "internship",
              "employment",
              "work experience",
              "professional experience",
            ],
          },
          {
            name: "Projects",
            keywords: [
              "projects",
              "project",
              "personal project",
            ],
          },
          {
            name: "Skills",
            keywords: [
              "skills",
              "technical skills",
              "technologies",
              "technical expertise",
            ],
          },
          {
            name: "Certifications",
            keywords: [
              "certification",
              "certifications",
              "certificate",
              "certificates",
            ],
          },
          {
            name: "Achievements",
            keywords: [
              "achievement",
              "achievements",
              "award",
              "awards",
            ],
          },
        ];

        const detectedSections = sections
          .filter((section) =>
            section.keywords.some((keyword) =>
              lowerText.includes(keyword)
            )
          )
          .map((section) => section.name);

        const missingSections = sections
          .filter(
            (section) =>
              !section.keywords.some((keyword) =>
                lowerText.includes(keyword)
              )
          )
          .map((section) => section.name);

        /* -----------------------------------------
           PROFILE LINKS
        ----------------------------------------- */

        const hasGithub =
          lowerText.includes("github");

        const hasLinkedin =
          lowerText.includes("linkedin");

        /* -----------------------------------------
           STRENGTHS
        ----------------------------------------- */

        const strengthPoints = [];

        if (detectedSkills.length >= 3) {
          strengthPoints.push(
            `Detected ${detectedSkills.length} technical skills.`
          );
        } else if (detectedSkills.length > 0) {
          strengthPoints.push(
            "Technical skills are present in the resume."
          );
        }

        if (detectedSections.includes("Education")) {
          strengthPoints.push(
            "Education section detected."
          );
        }

        if (detectedSections.includes("Projects")) {
          strengthPoints.push(
            "Projects section detected."
          );
        }

        if (detectedSections.includes("Experience")) {
          strengthPoints.push(
            "Experience section detected."
          );
        }

        if (hasGithub) {
          strengthPoints.push(
            "GitHub profile detected."
          );
        }

        if (hasLinkedin) {
          strengthPoints.push(
            "LinkedIn profile detected."
          );
        }

        if (strengthPoints.length === 0) {
          strengthPoints.push(
            "Resume text was successfully extracted."
          );
        }

        /* -----------------------------------------
           RECOMMENDATIONS
        ----------------------------------------- */

        const recommendations = [];

        if (detectedSkills.length === 0) {
          recommendations.push(
            "Add a clear technical skills section."
          );
        }

        if (!hasGithub) {
          recommendations.push(
            "Consider adding your GitHub profile if you have one."
          );
        }

        if (!hasLinkedin) {
          recommendations.push(
            "Consider adding your LinkedIn profile."
          );
        }

        if (!detectedSections.includes("Projects")) {
          recommendations.push(
            "Add 2–3 relevant projects with measurable results."
          );
        }

        if (!detectedSections.includes("Experience")) {
          recommendations.push(
            "Add internship, freelance, volunteer, or practical experience if applicable."
          );
        }

        if (!detectedSections.includes("Certifications")) {
          recommendations.push(
            "Add relevant certifications if you have completed any."
          );
        }

        if (wordCount < 150) {
          recommendations.push(
            "The resume appears quite short. Consider adding relevant projects, achievements, coursework, or experience."
          );
        }

        if (wordCount > 900) {
          recommendations.push(
            "The resume may be too long. Consider removing information that is not relevant to the jobs you are targeting."
          );
        }

        if (recommendations.length === 0) {
          recommendations.push(
            "The resume contains the main sections and information expected in a technical resume."
          );
        }

        /* -----------------------------------------
           RESUME ANALYSIS RESULT
        ----------------------------------------- */

        const result = {
          wordCount,
          characterCount,
          detectedSkills,
          detectedSections,
          missingSections,
          strengthPoints,
          recommendations,
        };

        setAnalysis(result);
        setIsAnalyzing(false);

        console.log(
          "========== RESUME ANALYSIS =========="
        );
        console.log(
          "Word count:",
          wordCount
        );
        console.log(
          "Character count:",
          characterCount
        );
        console.log(
          "Skills:",
          detectedSkills
        );
        console.log(
          "Sections:",
          detectedSections
        );
        console.log(
          "Missing sections:",
          missingSections
        );
        console.log(
          "Recommendations:",
          recommendations
        );
        console.log(
          "====================================="
        );
      } catch (err) {
        console.error(
          "Resume analysis error:",
          err
        );

        setError(
          "Something went wrong while analyzing the resume."
        );

        setIsAnalyzing(false);
      }
    }, 700);
  }

  /* -----------------------------------------
     UI
  ----------------------------------------- */

  return (
    <section className="resume-intelligence-section">

      {/* HEADING */}

      <div className="resume-heading">

        <p className="eyebrow">
          02 / RESUME INTELLIGENCE
        </p>

        <h2>
          Understand your
          <br />
          <em>career profile.</em>
        </h2>

        <p>
          Upload your resume and Jobly will analyze your
          skills, strengths, weaknesses and suitable
          career opportunities.
        </p>

      </div>

      {/* UPLOAD BOX */}

      <div
        className={`resume-upload-box ${
          resume ? "has-resume" : ""
        }`}
      >

        <div className="resume-upload-icon">
          ↑
        </div>

        {!resume ? (

          <>
            <h3>
              Upload your resume
            </h3>

            <p>
              Upload your latest resume to start your
              career analysis.
            </p>

            <button
              type="button"
              className="resume-upload-button"
              onClick={handleChooseResume}
              disabled={loading}
            >
              {loading
                ? "Reading..."
                : "Choose Resume"}

              <span>
                →
              </span>
            </button>

            <small>
              Supported formats: PDF, DOCX
            </small>
          </>

        ) : (

          <>
            <h3>
              Resume uploaded ✓
            </h3>

            <p className="resume-file-name">
              {resume.name}
            </p>

            {loading ? (

              <p className="resume-status">
                Reading your resume...
              </p>

            ) : (

              <p className="resume-status success">
                Resume text extracted successfully.
              </p>

            )}

            <button
              type="button"
              className="resume-upload-button"
              onClick={handleChooseResume}
              disabled={loading}
            >
              Choose Another

              <span>
                →
              </span>
            </button>
          </>

        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleResumeChange}
          hidden
        />

      </div>

      {/* ERROR */}

      {error && (
        <div className="resume-error">
          {error}
        </div>
      )}

      {/* EXTRACTED RESUME */}

      {resumeText && !loading && (

        <>
          <div className="resume-preview">

            <div className="resume-preview-header">

              <div>

                <p className="eyebrow">
                  RESUME CONTENT
                </p>

                <h3>
                  Text extracted successfully.
                </h3>

              </div>

              <span>
                {resumeText.length.toLocaleString()}{" "}
                characters
              </span>

            </div>

            <div className="resume-preview-content">
              {resumeText}
            </div>

          </div>

          {/* ANALYZE BUTTON */}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "28px",
            }}
          >

            <button
              type="button"
              className="resume-upload-button"
              onClick={handleAnalyzeResume}
              disabled={isAnalyzing}
            >

              {isAnalyzing
                ? "Analyzing..."
                : "Analyze Resume"}

              <span>
                →
              </span>

            </button>

          </div>

        </>

      )}

      {/* ANALYSIS */}

      {analysis && (

        <div className="resume-preview">

          {/* ANALYSIS HEADER */}

          <div className="resume-preview-header">

            <div>

              <p className="eyebrow">
                RESUME ANALYSIS
              </p>

              <h3>
                Your career profile
              </h3>

            </div>

            <span>
              Analysis complete
            </span>

          </div>

          {/* ANALYSIS CONTENT */}

          <div className="resume-preview-content">

            {/* OVERVIEW */}

            <h4>
              Overview
            </h4>

            <p>
              <strong>
                Word count:
              </strong>{" "}
              {analysis.wordCount}
            </p>

            <p>
              <strong>
                Characters:
              </strong>{" "}
              {analysis.characterCount.toLocaleString()}
            </p>

            <br />

            {/* SKILLS */}

            <h4>
              Detected Skills
            </h4>

            {analysis.detectedSkills.length > 0 ? (

              <p>
                {analysis.detectedSkills.join(" • ")}
              </p>

            ) : (

              <p>
                No common technical skills were detected.
              </p>

            )}

            <br />

            {/* SECTIONS */}

            <h4>
              Detected Sections
            </h4>

            {analysis.detectedSections.length > 0 ? (

              <p>
                {analysis.detectedSections.join(" • ")}
              </p>

            ) : (

              <p>
                No standard resume sections were detected.
              </p>

            )}

            <br />

            {/* STRENGTHS */}

            <h4>
              Strengths
            </h4>

            <ul>
              {analysis.strengthPoints.map(
                (strength, index) => (
                  <li key={index}>
                    {strength}
                  </li>
                )
              )}
            </ul>

            <br />

            {/* MISSING SECTIONS */}

            <h4>
              Sections to Consider Adding
            </h4>

            {analysis.missingSections.length > 0 ? (

              <ul>
                {analysis.missingSections.map(
                  (section, index) => (
                    <li key={index}>
                      {section}
                    </li>
                  )
                )}
              </ul>

            ) : (

              <p>
                No major standard sections appear to be missing.
              </p>

            )}

            <br />

            {/* RECOMMENDATIONS */}

            <h4>
              Recommendations
            </h4>

            <ul>
              {analysis.recommendations.map(
                (recommendation, index) => (
                  <li key={index}>
                    {recommendation}
                  </li>
                )
              )}
            </ul>

          </div>

        </div>

      )}

    </section>
  );
}

export default ResumeIntelligence;