import "./InterviewPrep.css";

function InterviewPrep({ applications, onEdit }) {
  const interviewApplications = applications.filter(
    (application) =>
      application.status === "Interview" ||
      application.status === "Shortlisted"
  );

  const getDaysLeft = (deadline) => {
    const today = new Date();
    const target = new Date(deadline);

    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    return Math.ceil(
      (target.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24)
    );
  };

  return (
    <section className="interview-prep-section">
      <div className="interview-prep-header">
        <div>
          <p className="eyebrow">05 / PREPARE</p>

          <h2>
            Interview
            <br />
            <em>Prep.</em>
          </h2>

          <p className="interview-prep-description">
            Know what is coming next and prepare
            before the opportunity arrives.
          </p>
        </div>

        <div className="prep-count">
          <strong>{interviewApplications.length}</strong>
          <span>ACTIVE</span>
        </div>
      </div>

      {interviewApplications.length === 0 ? (
        <div className="prep-empty">
          <div className="prep-empty-icon">✦</div>

          <div>
            <h3>No interview preparation yet.</h3>
            <p>
              When an application reaches Shortlisted
              or Interview, it will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="prep-grid">
          {interviewApplications.map((application) => {
            const daysLeft = getDaysLeft(
              application.deadline
            );

            return (
              <article
                className="prep-card"
                key={application.id}
              >
                <div className="prep-card-top">
                  <div className="prep-logo">
                    {application.company
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>

                  <span
                    className={`prep-status ${
                      application.status === "Interview"
                        ? "interview"
                        : "shortlisted"
                    }`}
                  >
                    {application.status}
                  </span>
                </div>

                <h3>{application.company}</h3>

                <p className="prep-role">
                  {application.role}
                </p>

                <div className="prep-deadline">
                  <span>DEADLINE</span>

                  <strong
                    className={
                      daysLeft <= 2 ? "urgent" : ""
                    }
                  >
                    {daysLeft < 0
                      ? "Expired"
                      : daysLeft === 0
                      ? "Today"
                      : daysLeft === 1
                      ? "Tomorrow"
                      : `${daysLeft} days left`}
                  </strong>
                </div>

                <div className="prep-checklist">
                  <div>
                    <span>01</span>
                    <p>Research company</p>
                  </div>

                  <div>
                    <span>02</span>
                    <p>Revise DSA</p>
                  </div>

                  <div>
                    <span>03</span>
                    <p>Prepare questions</p>
                  </div>
                </div>

                <button
                  className="prep-button"
                  onClick={() => onEdit(application)}
                >
                  Open Application →
                </button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default InterviewPrep;