import JobMatch from "./JobMatch";

function ApplicationDetails({ application, onClose, onEdit }) {
  if (!application) return null;

  const companyName =
    application.company || "Unknown Company";

  const roleName =
    application.role || "Unknown Role";

  const logoText = companyName
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function formatDate(date) {
    if (!date) return "Not added";

    try {
      const parsedDate = new Date(date);

      if (Number.isNaN(parsedDate.getTime())) {
        return date;
      }

      return parsedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return date;
    }
  }

  function getStatusClass(status) {
    if (!status) return "";

    return status
      .toLowerCase()
      .replace(/\s+/g, "-");
  }

  const status = application.status || "Applied";

  /*
   * JOB DESCRIPTION
   *
   * We support both:
   * application.jobDescription
   * application.description
   *
   * This makes the component work even if your
   * application data uses either field name.
   */
  const jobDescription =
    application.jobDescription ||
    application.description ||
    "";

  return (
    <div
      className="details-backdrop"
      onClick={onClose}
    >
      <div
        className="details-panel"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* CLOSE BUTTON */}

        <button
          type="button"
          className="details-close"
          onClick={onClose}
          aria-label="Close application details"
        >
          ×
        </button>

        {/* HEADER */}

        <p className="eyebrow">
          APPLICATION DETAILS
        </p>

        <div className="details-company">
          <div className="details-logo">
            {logoText}
          </div>

          <div>
            <h2>{companyName}</h2>

            <p>{roleName}</p>
          </div>
        </div>

        {/* STATUS */}

        <div className="details-status">
          <span>STATUS</span>

          <strong
            className={`application-status ${getStatusClass(
              status
            )}`}
          >
            {status}
          </strong>
        </div>

        {/* LOCATION */}

        <div className="details-deadline">
          <span>LOCATION</span>

          <strong>
            {application.location || "Not added"}
          </strong>
        </div>

        {/* APPLIED DATE */}

        <div className="details-deadline">
          <span>APPLIED DATE</span>

          <strong>
            {formatDate(application.appliedDate)}
          </strong>
        </div>

        {/* DEADLINE */}

        <div className="details-deadline">
          <span>DEADLINE</span>

          <strong>
            {formatDate(application.deadline)}
          </strong>
        </div>

        {/* NEXT ACTION */}

        <div className="details-deadline">
          <span>NEXT ACTION</span>

          <strong>
            {application.nextAction ||
              "No next action added"}
          </strong>
        </div>

        {/* NEXT ACTION DATE */}

        {application.nextActionDate && (
          <div className="details-deadline">
            <span>NEXT ACTION DATE</span>

            <strong>
              {formatDate(
                application.nextActionDate
              )}
            </strong>
          </div>
        )}

        {/* JOB URL */}

        {application.jobUrl && (
          <div className="details-notes">
            <span>JOB LINK</span>

            <p>
              <a
                href={application.jobUrl}
                target="_blank"
                rel="noreferrer"
                className="details-job-link"
              >
                Open job posting →
              </a>
            </p>
          </div>
        )}

        {/* RESUME */}

        {application.resumeUsed && (
          <div className="details-notes">
            <span>RESUME USED</span>

            <p>{application.resumeUsed}</p>
          </div>
        )}

        {/* NOTES */}

        <div className="details-notes">
          <span>NOTES</span>

          <p>
            {application.notes
              ? application.notes
              : "No notes added yet."}
          </p>
        </div>

        {/* ================================
            JOB MATCH
        ================================= */}

        <div className="application-job-match">
          <JobMatch
            jobDescription={jobDescription}
          />
        </div>

        {/* ACTIONS */}

        <div className="details-actions">
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              if (onEdit) {
                onEdit(application);
              }

              if (onClose) {
                onClose();
              }
            }}
          >
            Edit Application →
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApplicationDetails;