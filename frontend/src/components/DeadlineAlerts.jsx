function DeadlineAlerts({ applications, onEdit }) {
  const getDaysLeft = (deadline) => {
    const today = new Date();
    const target = new Date(deadline);

    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    return Math.ceil(
      (target - today) / (1000 * 60 * 60 * 24)
    );
  };

  const urgentApplications = applications
    .map((application) => ({
      ...application,
      daysLeft: getDaysLeft(application.deadline),
    }))
    .filter(
      (application) =>
        application.daysLeft >= 0 &&
        application.daysLeft <= 3 &&
        application.status !== "Rejected"
    )
    .sort((a, b) => a.daysLeft - b.daysLeft);

  if (urgentApplications.length === 0) {
    return (
      <section className="deadline-alerts">
        <div className="deadline-alert-header">
          <div>
            <p className="eyebrow">DEADLINE WATCH</p>
            <h2>
              You're <em>clear.</em>
            </h2>
          </div>

          <span className="deadline-alert-icon">✓</span>
        </div>

        <p className="deadline-alert-empty">
          No deadlines are coming up in the next 3 days.
        </p>
      </section>
    );
  }

  return (
    <section className="deadline-alerts">
      <div className="deadline-alert-header">
        <div>
          <p className="eyebrow">DEADLINE WATCH</p>

          <h2>
            Don't miss
            <br />
            the <em>moment.</em>
          </h2>

          <p className="deadline-alert-description">
            These applications need your attention soon.
          </p>
        </div>

        <div className="deadline-alert-count">
          <strong>{urgentApplications.length}</strong>
          <span>URGENT</span>
        </div>
      </div>

      <div className="deadline-alert-list">
        {urgentApplications.map((application) => (
          <article
            className="deadline-alert-card"
            key={application.id}
          >
            <div className="deadline-alert-company">
              <div className="deadline-alert-logo">
                {application.company
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <div>
                <h3>{application.company}</h3>
                <p>{application.role}</p>
              </div>
            </div>

            <div className="deadline-alert-status">
              {application.daysLeft === 0
                ? "TODAY"
                : application.daysLeft === 1
                ? "TOMORROW"
                : `${application.daysLeft} DAYS`}
            </div>

            <button
              onClick={() => onEdit(application)}
              className="deadline-alert-button"
            >
              Review →
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default DeadlineAlerts;