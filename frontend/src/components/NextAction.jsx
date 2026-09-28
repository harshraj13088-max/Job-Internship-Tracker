import "./NextAction.css";

function getDaysLeft(deadline) {
  const today = new Date();
  const target = new Date(deadline);

  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const difference = target.getTime() - today.getTime();

  return Math.ceil(difference / (1000 * 60 * 60 * 24));
}

function getInitials(company) {
  return company
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getNextAction(application) {
  switch (application.status) {
    case "Interview":
      return {
        label: "INTERVIEW",
        action: "Prepare for interview",
      };

    case "Shortlisted":
      return {
        label: "NEXT STEP",
        action: "Check interview details",
      };

    case "Applied":
      return {
        label: "FOLLOW UP",
        action: "Follow up on application",
      };

    case "Offer":
      return {
        label: "OFFER",
        action: "Review your offer",
      };

    default:
      return {
        label: "NEXT STEP",
        action: "Check application status",
      };
  }
}

export default function NextAction({ applications, onEdit }) {
  return (
    <section className="next-action-section" id="next-action">
      <div className="next-action-header">
        <div>
          <p className="next-action-eyebrow">01 / NEXT MOVE</p>

          <h2>
            What to do
            <br />
            <em>next.</em>
          </h2>

          <p className="next-action-description">
            Stay ahead of every application with your next action in one place.
          </p>
        </div>

        <div className="next-action-count">
          <strong>{applications.length}</strong>
          <span>ACTIONS</span>
        </div>
      </div>

      <div className="next-action-list">
        {applications.map((application, index) => {
          const nextAction = getNextAction(application);
          const daysLeft = getDaysLeft(application.deadline);

          return (
            <article className="next-action-row" key={application.id}>
              <div className="next-action-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="next-action-company">
                <div className="next-action-logo">
                  {getInitials(application.company)}
                </div>

                <div>
                  <h3>{application.company}</h3>
                  <p>{application.role}</p>
                </div>
              </div>

              <div className="next-action-task">
                <span>{nextAction.label}</span>
                <strong>{nextAction.action}</strong>
              </div>

              <div className="next-action-deadline">
                <span>DEADLINE</span>

                <small>
                  {daysLeft <= 0
                    ? "Today"
                    : daysLeft === 1
                    ? "Tomorrow"
                    : `${daysLeft} days`}
                </small>

                <strong>
                  {new Date(application.deadline).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </strong>
              </div>

              <button
                className="next-action-arrow"
                type="button"
                onClick={() => onEdit(application)}
                title={`Edit ${application.company} application`}
              >
                →
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}