import { useMemo, useState } from "react";
import "./JobMatch.css";

const USER_SKILLS = [
  "C++",
  "Python",
  "JavaScript",
  "React",
  "HTML",
  "CSS",
  "SQL",
  "MongoDB",
  "Git",
  "DSA",
  "Data Structures",
  "Algorithms",
  "Node.js",
  "Express",
  "REST API",
  "Machine Learning",
  "Docker",
  "AWS",
];

function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^\w+#.]/g, " ");
}

function skillExists(text, skill) {
  const normalizedText = normalizeText(text);
  const normalizedSkill = normalizeText(skill);

  return normalizedText.includes(normalizedSkill);
}

export default function JobMatch({ jobDescription: initialDescription = "" }) {
  const [jobDescription, setJobDescription] = useState(
    initialDescription
  );

  const result = useMemo(() => {
    if (!jobDescription.trim()) {
      return {
        score: 0,
        matched: [],
        missing: USER_SKILLS,
      };
    }

    const matched = USER_SKILLS.filter((skill) =>
      skillExists(jobDescription, skill)
    );

    const missing = USER_SKILLS.filter(
      (skill) => !matched.includes(skill)
    );

    const score = Math.round(
      (matched.length / USER_SKILLS.length) * 100
    );

    return {
      score,
      matched,
      missing,
    };
  }, [jobDescription]);

  const scoreClass =
    result.score >= 75
      ? "strong"
      : result.score >= 50
      ? "medium"
      : "low";

  const matchLabel =
    result.score >= 75
      ? "Strong Match"
      : result.score >= 50
      ? "Good Match"
      : "Needs Preparation";

  return (
    <section className="job-match-section">

      {/* HEADER */}
      <div className="job-match-heading">
        <div>
          <p className="eyebrow">03 / JOB MATCH</p>

          <h2>
            How well do you
            <br />
            <em>match?</em>
          </h2>

          <p className="job-match-subtitle">
            Paste the job description and see which skills
            match your current profile.
          </p>
        </div>

        <div className={`match-score ${scoreClass}`}>
          <strong>{result.score}%</strong>
          <span>{matchLabel}</span>
        </div>
      </div>

      {/* JOB DESCRIPTION INPUT */}
      <div className="job-description-box">

        <div className="job-description-top">
          <div>
            <p className="eyebrow">JOB DESCRIPTION</p>
            <h3>Paste the opportunity details</h3>
          </div>

          {jobDescription.trim() && (
            <span className="character-count">
              {jobDescription.length} characters
            </span>
          )}
        </div>

        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
          rows={8}
        />

        <div className="job-description-footer">
          <span>
            Your skills are checked automatically.
          </span>

          {jobDescription.trim() && (
            <button
              className="clear-match-btn"
              onClick={() => setJobDescription("")}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* RESULT */}
      {jobDescription.trim() ? (
        <div className="job-match-result">

          {/* SCORE */}
          <div className="match-result-top">
            <div>
              <p className="eyebrow">MATCH ANALYSIS</p>

              <h3>
                Your profile matches this role by{" "}
                <span>{result.score}%</span>
              </h3>
            </div>
          </div>

          {/* PROGRESS */}
          <div className="match-progress">
            <div
              style={{
                width: `${result.score}%`,
              }}
            />
          </div>

          {/* TWO COLUMNS */}
          <div className="match-columns">

            {/* MATCHED */}
            <div className="match-box matched-box">

              <div className="match-box-title">
                <span className="match-icon">✓</span>

                <div>
                  <strong>Matched Skills</strong>
                  <small>
                    {result.matched.length} skills found
                  </small>
                </div>
              </div>

              {result.matched.length === 0 ? (
                <p className="no-skills">
                  No matching skills found yet.
                </p>
              ) : (
                <div className="skill-list">
                  {result.matched.map((skill) => (
                    <span key={skill}>
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* MISSING */}
            <div className="match-box missing-box">

              <div className="match-box-title">
                <span className="match-icon">+</span>

                <div>
                  <strong>Skills to Prepare</strong>
                  <small>
                    {result.missing.length} skills missing
                  </small>
                </div>
              </div>

              {result.missing.length === 0 ? (
                <p className="no-skills">
                  Great! All tracked skills match.
                </p>
              ) : (
                <div className="skill-list">
                  {result.missing.slice(0, 8).map((skill) => (
                    <span key={skill}>
                      + {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RECOMMENDATION */}
          {result.missing.length > 0 && (
            <div className="match-recommendation">

              <div className="recommendation-arrow">
                →
              </div>

              <div>
                <p className="eyebrow">
                  NEXT PREPARATION STEP
                </p>

                <p>
                  Focus your preparation on{" "}
                  <strong>
                    {result.missing
                      .slice(0, 3)
                      .join(", ")}
                  </strong>
                  .
                </p>
              </div>
            </div>
          )}

        </div>
      ) : (
        <div className="job-match-empty">

          <span className="empty-star">✦</span>

          <div>
            <strong>Waiting for a job description</strong>

            <p>
              Paste the job description above to calculate
              your skill match.
            </p>
          </div>

        </div>
      )}

    </section>
  );
}