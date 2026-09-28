import ApplicationDetails from "./components/ApplicationDetails";
import CodingPrep from "./components/CodingPrep";
import ResumeIntelligence from "./components/ResumeIntelligence";
import DeadlineAlerts from "./components/DeadlineAlerts";
import ResumeAnalyzer from "./components/ResumeAnalyzer";
import NextAction from "./components/NextAction";
import JobMatch from "./components/JobMatch";
import InterviewPrep from "./components/InterviewPrep";
import { useEffect, useMemo, useState } from "react";
import "./App.css";

const INITIAL_APPLICATIONS = [
  {
    id: 1,
    company: "Google",
    role: "Software Engineering Intern",
    status: "Interview",
    deadline: "2026-09-29",
    nextAction: "Prepare for interview",
    notes: "Prepare DSA and system design questions.",
    jobDescription: "",
    important: false,
  },
  {
    id: 2,
    company: "Microsoft",
    role: "Software Engineer Intern",
    status: "Applied",
    deadline: "2026-10-02",
    nextAction: "Follow up on application",
    notes: "",
    jobDescription: "",
    important: false,
  },
  {
    id: 3,
    company: "Amazon",
    role: "SDE Intern",
    status: "Shortlisted",
    deadline: "2026-10-05",
    nextAction: "Check interview details",
    notes: "Waiting for interview mail.",
    jobDescription: "",
    important: false,
  },
  {
    id: 4,
    company: "Adobe",
    role: "Frontend Developer Intern",
    status: "Applied",
    deadline: "2026-10-10",
    nextAction: "Follow up on application",
    notes: "",
    jobDescription: "",
    important: false,
  },
];

const STATUS_OPTIONS = [
  "Applied",
  "Shortlisted",
  "Interview",
  "Offer",
  "Rejected",
];


const [user, setUser] = useState(null);

useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  if (params.get("login") === "success") {
    const userData = params.get("user");

    if (userData) {
      try {
        const googleUser = JSON.parse(decodeURIComponent(userData));

        setUser(googleUser);

        localStorage.setItem(
          "joblyUser",
          JSON.stringify(googleUser)
        );

        // Remove login information from URL
        window.history.replaceState({}, document.title, "/");
      } catch (error) {
        console.error("Unable to read Google user:", error);
      }
    }
  }
}, []);

function App() {
  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem("jobly-applications");

      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Could not load saved applications:", error);
    }

    return INITIAL_APPLICATIONS;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    status: "Applied",
    deadline: "",
    notes: "",
    jobDescription: "",
  });

  useEffect(() => {
    localStorage.setItem(
      "jobly-applications",
      JSON.stringify(applications)
    );
  }, [applications]);

  const statistics = useMemo(() => {
    return {
      total: applications.length,

      shortlisted: applications.filter(
        (app) => app.status === "Shortlisted"
      ).length,

      interviews: applications.filter(
        (app) => app.status === "Interview"
      ).length,

      offers: applications.filter(
        (app) => app.status === "Offer"
      ).length,
    };
  }, [applications]);

  const filteredApplications = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesSearch =
        !search ||
        application.company.toLowerCase().includes(search) ||
        application.role.toLowerCase().includes(search);

      const matchesStatus =
        filterStatus === "All" ||
        application.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, filterStatus]);

  const upcomingApplications = useMemo(() => {
    return [...applications]
      .sort(
        (a, b) =>
          new Date(a.deadline) - new Date(b.deadline)
      )
      .slice(0, 3);
  }, [applications]);

  const nextActions = useMemo(() => {
    return applications
      .map((application) => {
        let action = "";
        let label = "";
        let priority = "normal";

        switch (application.status) {
          case "Applied":
            action = "Follow up on application";
            label = "FOLLOW UP";
            break;

          case "Shortlisted":
            action = "Check interview details";
            label = "NEXT STEP";
            priority = "high";
            break;

          case "Interview":
            action = "Prepare for interview";
            label = "ACTION NEEDED";
            priority = "high";
            break;

          case "Offer":
            action = "Review your offer";
            label = "OFFER";
            priority = "success";
            break;

          case "Rejected":
            action = "No action needed";
            label = "CLOSED";
            priority = "normal";
            break;

          default:
            action = "Review application";
            label = "NEXT STEP";
        }

        const daysLeft = getDaysLeft(
          application.deadline
        );

        if (
          application.status !== "Rejected" &&
          daysLeft <= 2
        ) {
          priority = "urgent";
        }

        return {
          ...application,
          action,
          label,
          priority,
          daysLeft,
        };
      })
      .filter(
        (application) =>
          application.status !== "Rejected"
      )
      .sort((a, b) => {
        const priorityOrder = {
          urgent: 0,
          high: 1,
          success: 2,
          normal: 3,
        };

        if (
          priorityOrder[a.priority] !==
          priorityOrder[b.priority]
        ) {
          return (
            priorityOrder[a.priority] -
            priorityOrder[b.priority]
          );
        }

        return a.daysLeft - b.daysLeft;
      })
      .slice(0, 4);
  }, [applications]);

  function getDaysLeft(deadline) {
    const today = new Date();
    const target = new Date(deadline);

    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const difference =
      target.getTime() - today.getTime();

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  }

  function formatDeadline(deadline) {
    const date = new Date(deadline);

    if (Number.isNaN(date.getTime())) {
      return "No date";
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  function getInitials(company) {
    return company
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  function openAddModal() {
    setEditingId(null);

    setFormData({
      company: "",
      role: "",
      status: "Applied",
      deadline: "",
      notes: "",
      jobDescription: "",
    });

    setShowModal(true);
  }

  function openEditModal(application) {
    setEditingId(application.id);

    setFormData({
      company: application.company || "",
      role: application.role || "",
      status: application.status || "Applied",
      deadline: application.deadline || "",
      notes: application.notes || "",
      jobDescription: application.jobDescription || "",
    });

    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingId(null);

    setFormData({
      company: "",
      role: "",
      status: "Applied",
      deadline: "",
      notes: "",
      jobDescription: "",
    });
  }

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function saveApplication(event) {
    event.preventDefault();

    if (
      !formData.company.trim() ||
      !formData.role.trim() ||
      !formData.deadline
    ) {
      return;
    }

    if (editingId !== null) {
      setApplications((current) =>
        current.map((application) =>
          application.id === editingId
            ? {
                ...application,
                ...formData,
                company: formData.company.trim(),
                role: formData.role.trim(),
                notes: formData.notes.trim(),
                jobDescription:
                  formData.jobDescription.trim(),
              }
            : application
        )
      );
    } else {
      const newApplication = {
        id: Date.now(),
        company: formData.company.trim(),
        role: formData.role.trim(),
        status: formData.status,
        deadline: formData.deadline,
        notes: formData.notes.trim(),
        jobDescription:
          formData.jobDescription.trim(),
        important: false,
      };

      setApplications((current) => [
        newApplication,
        ...current,
      ]);
    }

    closeModal();
  }

  function deleteApplication(id) {
    const shouldDelete = window.confirm(
      "Delete this application?"
    );

    if (!shouldDelete) {
      return;
    }

    setApplications((current) =>
      current.filter(
        (application) => application.id !== id
      )
    );

    if (selectedApplication?.id === id) {
      setSelectedApplication(null);
    }
  }

  function toggleImportant(id) {
    setApplications((current) =>
      current.map((application) =>
        application.id === id
          ? {
              ...application,
              important: !application.important,
            }
          : application
      )
    );
  }

  function scrollToSection(id) {
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
      });
  }

  return (
    <div className="app-shell">
      {/* NAVIGATION */}

      <header className="topbar">
        <div className="brand">
          JOBLY<span>.</span>
        </div>

        <nav className="navigation">
          <button onClick={() => scrollToSection("home")}>
            Home
          </button>

          <button
            onClick={() =>
              scrollToSection("applications")
            }
          >
            Applications
          </button>

          <button
            onClick={() =>
              scrollToSection("journey")
            }
          >
            Journey
          </button>

          <button
            onClick={() =>
              scrollToSection("analytics")
            }
          >
            Analytics
          </button>
        </nav>

        <div className="topbar-right">
          <div className="mini-search">
            <span>⌕</span>

            <input
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search..."
            />
          </div>

<a
  href="http://localhost:5001/api/auth/google"
  className="profile"
>
  <div className="profile-avatar">
    {user?.picture ? (
      <img src={user.picture} alt={user.name} />
    ) : (
      "H"
    )}
  </div>

  <span>{user?.name || "Harsh"}</span>
</a>
        </div>
      </header>

      <main>
        {/* HERO */}

        <section
          className="hero-section"
          id="home"
        >
          <div className="hero-art">
            <div className="sun"></div>

            <div className="cloud cloud-a"></div>
            <div className="cloud cloud-b"></div>
            <div className="cloud cloud-c"></div>

            <div className="star star-a">✦</div>
            <div className="star star-b">✦</div>
            <div className="star star-c">✦</div>

            <div className="mountain mountain-back"></div>
            <div className="mountain mountain-front"></div>

            <div className="city-silhouette">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="road"></div>

            <div className="runner">
              <div className="runner-head"></div>
              <div className="runner-body"></div>
              <div className="runner-arm arm-left"></div>
              <div className="runner-arm arm-right"></div>
              <div className="runner-leg leg-left"></div>
              <div className="runner-leg leg-right"></div>
            </div>

            <div className="milestone milestone-apply">
              <b>01</b>
              <span>APPLY</span>
            </div>

            <div className="milestone milestone-interview">
              <b>02</b>
              <span>INTERVIEW</span>
            </div>

            <div className="milestone milestone-offer">
              <b>03</b>
              <span>OFFER</span>
            </div>
          </div>

          <div className="hero-overlay"></div>

          <div className="hero-content">
            <div className="hero-copy">
              <p className="eyebrow">
                YOUR CAREER, IN MOTION
              </p>

              <h1>
                Keep track.
                <br />
                <em>Keep moving.</em>
              </h1>

              <p className="hero-text">
                Keep every application, deadline and
                opportunity moving in the right direction.
              </p>

              <div className="hero-actions">
                <button
                  className="primary-button"
                  onClick={openAddModal}
                >
                  Add Application
                  <span>→</span>
                </button>

                <button
                  className="secondary-button"
                  onClick={() =>
                    scrollToSection("applications")
                  }
                >
                  Explore Applications
                </button>
              </div>
            </div>

            <div className="hero-note">
              <span>✦</span>

              <p>
                Every application
                <br />
                is a step closer.
              </p>
            </div>
          </div>

          <div className="hero-stat-row">
            <div className="hero-stat">
              <strong>
                {String(statistics.total).padStart(
                  2,
                  "0"
                )}
              </strong>

              <span>Applications</span>
            </div>

            <div className="hero-stat">
              <strong>
                {String(
                  statistics.shortlisted
                ).padStart(2, "0")}
              </strong>

              <span>Shortlisted</span>
            </div>

            <div className="hero-stat">
              <strong>
                {String(
                  statistics.interviews
                ).padStart(2, "0")}
              </strong>

              <span>Interviews</span>
            </div>

            <div className="hero-stat">
              <strong>
                {String(statistics.offers).padStart(
                  2,
                  "0"
                )}
              </strong>

              <span>Offers</span>
            </div>
          </div>
        </section>

        {/* INTRO */}

        <section className="intro-section">
          <div className="section-index">01</div>

          <div className="intro-copy">
            <p className="eyebrow">
              THE BIG PICTURE
            </p>

            <h2>
              Your job search
              <br />
              is more than <em>a list.</em>
            </h2>

            <p>
              Opportunities move quickly. Jobly gives you
              one calm place to track what you applied for,
              what comes next and where you are going.
            </p>
          </div>

          <div className="intro-illustration">
            <div className="illustration-sun"></div>

            <div className="illustration-mountain one"></div>
            <div className="illustration-mountain two"></div>

            <div className="illustration-house">
              <div className="house-roof"></div>
              <div className="house-body"></div>
              <div className="house-window"></div>
            </div>

            <div className="illustration-person">
              <div></div>
            </div>

            <span className="illustration-label">
              KEEP GOING →
            </span>
          </div>
        </section>
          {/* RESUME INTELLIGENCE */}



<ResumeAnalyzer />
        {/* WHAT TO DO NEXT */}

        <ResumeIntelligence />

        <section className="next-actions-section">
          <div className="next-actions-header">
            <div>
              <p className="eyebrow">
                01 / NEXT MOVE
              </p>

              <h2>
                What to do
                <br />
                <em>next.</em>
              </h2>

              <p className="next-actions-description">
                Stay ahead of every application with
                your next action in one place.
              </p>
            </div>

            <div className="next-actions-count">
              <strong>{nextActions.length}</strong>
              <span>ACTIONS</span>
            </div>
          </div>

          <div className="next-actions-list">
            {nextActions.length === 0 ? (
              <div className="next-actions-empty">
                <span>✓</span>

                <div>
                  <h3>
                    You're all caught up.
                  </h3>

                  <p>
                    Add an application to see your
                    next steps here.
                  </p>
                </div>
              </div>
            ) : (
              nextActions.map(
                (application, index) => (
                  <article
                    className={`next-action-card priority-${application.priority}`}
                    key={application.id}
                  >
                    <div className="next-action-number">
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </div>

                    <div className="next-action-company">
                      <div className="next-action-logo">
                        {getInitials(
                          application.company
                        )}
                      </div>

                      <div>
                        <h3>
                          {application.company}
                        </h3>

                        <p>
                          {application.role}
                        </p>
                      </div>
                    </div>

                    <div className="next-action-info">
                      <span>
                        {application.label}
                      </span>

                      <strong>
                        {application.action}
                      </strong>
                    </div>

                    <div className="next-action-deadline">
                      <small>DEADLINE</small>

                      <b
                        className={
                          application.daysLeft <= 2
                            ? "urgent"
                            : ""
                        }
                      >
                        {application.daysLeft < 0
                          ? "Expired"
                          : application.daysLeft === 0
                          ? "Today"
                          : application.daysLeft === 1
                          ? "Tomorrow"
                          : `${application.daysLeft} days`}
                      </b>

                      <span>
                        {formatDeadline(
                          application.deadline
                        )}
                      </span>
                    </div>

                    <button
                      className="next-action-edit"
                      onClick={() =>
                        openEditModal(application)
                      }
                      title="Open application"
                    >
                      →
                    </button>
                  </article>
                )
              )
            )}
          </div>
        </section>

        {/* APPLICATIONS */}

        <section
          className="applications-section"
          id="applications"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">02</p>

              <h2>Recent Applications</h2>
            </div>

            <button
              className="small-dark-button"
              onClick={openAddModal}
            >
              + Add New
            </button>
          </div>

          <div className="application-toolbar">
            <div className="large-search">
              <span>⌕</span>

              <input
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search company or role..."
              />
            </div>

            <div className="filters">
              <button
                className={
                  filterStatus === "All"
                    ? "filter active"
                    : "filter"
                }
                onClick={() =>
                  setFilterStatus("All")
                }
              >
                All
              </button>

              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status}
                  className={
                    filterStatus === status
                      ? "filter active"
                      : "filter"
                  }
                  onClick={() =>
                    setFilterStatus(status)
                  }
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="applications-list">
            {filteredApplications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">⌕</div>

                <h3>No applications found</h3>

                <p>
                  Try another search or add a new
                  application.
                </p>

                <button
                  className="primary-button"
                  onClick={openAddModal}
                >
                  Add Application →
                </button>
              </div>
            ) : (
              filteredApplications.map(
                (application, index) => {
                  const daysLeft = getDaysLeft(
                    application.deadline
                  );

                  return (
                    <article
                      className="application-row"
                      key={application.id}
                      onClick={() =>
                        setSelectedApplication(
                          application
                        )
                      }
                    >
                      <div className="application-number">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </div>

                      <div className="company-mark">
                        {getInitials(
                          application.company
                        )}
                      </div>

                      <div className="application-company">
                        <h3>
                          {application.company}
                        </h3>

                        <p>
                          {application.role}
                        </p>
                      </div>

                      <div
                        className={`status-badge status-${application.status.toLowerCase()}`}
                      >
                        {application.status}
                      </div>

                      <div className="deadline">
                        <small>DEADLINE</small>

                        <span>
                          {formatDeadline(
                            application.deadline
                          )}
                        </span>

                        <b
                          className={
                            daysLeft <= 2
                              ? "urgent"
                              : ""
                          }
                        >
                          {daysLeft < 0
                            ? "Expired"
                            : daysLeft === 0
                            ? "Today"
                            : `${daysLeft} days left`}
                        </b>
                      </div>

                      <div className="row-actions">
                        <button
                          className={`important-btn ${
                            application.important
                              ? "active"
                              : ""
                          }`}
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleImportant(
                              application.id
                            );
                          }}
                          title={
                            application.important
                              ? "Remove important"
                              : "Mark important"
                          }
                        >
                          {application.important
                            ? "★"
                            : "☆"}
                        </button>

                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            openEditModal(
                              application
                            );
                          }}
                          title="Edit"
                        >
                          ✎
                        </button>

                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            deleteApplication(
                              application.id
                            );
                          }}
                          title="Delete"
                        >
                          ×
                        </button>
                      </div>
                    </article>
                  );
                }
              )
            )}
          </div>
        </section>

        {/* NEXT ACTION COMPONENT */}

        <NextAction
          applications={applications}
          onEdit={openEditModal}
        />

        {/* INTERVIEW PREP */}

        <InterviewPrep
          applications={applications}
        />

        {/* DEADLINE ALERTS */}

        <DeadlineAlerts
          applications={applications}
          onEdit={openEditModal}
        />

        {/* CODING PREP */}

        <CodingPrep />

        {/* JOB MATCH */}

<section className="job-match-section">
  <div className="section-heading">
    <div>
      <p className="eyebrow">05 / JOB MATCH</p>

      <h2>
        Match yourself
        <br />
        <em>to the opportunity.</em>
      </h2>

      <p>
        Select an application to compare its job
        description with your tracked skills.
      </p>
    </div>
  </div>

  <div className="job-match-selector">
    <label>
      SELECT APPLICATION

      <select
        value={
          selectedApplication?.id || ""
        }
        onChange={(event) => {
          const application = applications.find(
            (item) =>
              item.id === Number(event.target.value)
          );

          setSelectedApplication(
            application || null
          );
        }}
      >
        <option value="">
          Choose an application
        </option>

        {applications.map((application) => (
          <option
            key={application.id}
            value={application.id}
          >
            {application.company} —{" "}
            {application.role}
          </option>
        ))}
      </select>
    </label>
  </div>

  {selectedApplication ? (
    <JobMatch
      jobDescription={
        selectedApplication.jobDescription || ""
      }
    />
  ) : (
    <div className="job-match-empty">
      <span>✦</span>

      <div>
        <strong>
          Choose an application
        </strong>

        <p>
          Select an application above to see
          how your skills match the role.
        </p>
      </div>
    </div>
  )}
</section>

        {/* ANALYTICS */}

        <section
          className="analytics-section"
          id="analytics"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">03</p>

              <h2>Application Activity</h2>
            </div>

            <div className="analytics-total">
              <span>TOTAL</span>
              <strong>
                {statistics.total}
              </strong>
            </div>
          </div>

          <div className="analytics-card">
            <div className="chart-side-labels">
              <span>20</span>
              <span>15</span>
              <span>10</span>
              <span>05</span>
              <span>00</span>
            </div>

            <div className="chart-wrapper">
              <div className="chart-grid">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>

              <svg
                className="activity-chart"
                viewBox="0 0 1000 360"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="chartArea"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#aabd67"
                      stopOpacity="0.42"
                    />

                    <stop
                      offset="100%"
                      stopColor="#aabd67"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                <path
                  className="chart-fill"
                  d="
                    M0 310
                    C70 300 90 275 150 280
                    C210 285 240 235 300 245
                    C370 255 390 205 450 220
                    C520 238 550 160 610 180
                    C670 198 700 130 760 150
                    C820 170 850 90 910 105
                    C950 115 970 75 1000 70
                    L1000 360
                    L0 360
                    Z
                  "
                />

                <path
                  className="chart-stroke"
                  d="
                    M0 310
                    C70 300 90 275 150 280
                    C210 285 240 235 300 245
                    C370 255 390 205 450 220
                    C520 238 550 160 610 180
                    C670 198 700 130 760 150
                    C820 170 850 90 910 105
                    C950 115 970 75 1000 70
                  "
                />

                <circle
                  className="chart-point"
                  cx="760"
                  cy="150"
                  r="8"
                />
              </svg>

              <div className="chart-tooltip">
                Growing steadily
              </div>
            </div>
          </div>

          <div className="chart-months">
            <span>JAN</span>
            <span>FEB</span>
            <span>MAR</span>
            <span>APR</span>
            <span>MAY</span>
            <span>JUN</span>
            <span>JUL</span>
            <span>AUG</span>
            <span>SEP</span>
            <span>OCT</span>
          </div>
        </section>

        {/* JOURNEY */}

        <section
          className="journey-section"
          id="journey"
        >
          <div className="journey-heading">
            <div>
              <p className="eyebrow">04</p>

              <h2>
                Your <em>Journey.</em>
              </h2>
            </div>

            <p>
              From first application
              <br />
              to your next opportunity.
            </p>
          </div>

          <div className="journey-track">
            <div className="journey-line"></div>

            <div className="journey-progress"></div>

            <div className="journey-step complete">
              <div className="journey-circle">
                01
              </div>

              <h3>Apply</h3>

              <p>
                Find opportunities that match
                your goals.
              </p>
            </div>

            <div className="journey-step complete">
              <div className="journey-circle">
                02
              </div>

              <h3>Prepare</h3>

              <p>
                Track deadlines and prepare
                with confidence.
              </p>
            </div>

            <div className="journey-step">
              <div className="journey-circle">
                03
              </div>

              <h3>Interview</h3>

              <p>
                Keep notes and stay ready
                for every conversation.
              </p>
            </div>

            <div className="journey-step">
              <div className="journey-circle">
                04
              </div>

              <h3>Grow</h3>

              <p>
                Learn from every opportunity
                and keep moving.
              </p>
            </div>
          </div>
        </section>

        {/* DEADLINES */}

        <section className="deadline-section">
          <div className="deadline-art">
            <div className="deadline-sun"></div>

            <div className="deadline-cloud"></div>

            <div className="deadline-mountain back"></div>
            <div className="deadline-mountain front"></div>

            <div className="deadline-road"></div>

            <div className="tiny-runner">
              <span></span>
            </div>
          </div>

          <div className="deadline-content">
            <p className="eyebrow">
              DON'T MISS THE NEXT STEP
            </p>

            <h2>
              Upcoming
              <br />
              <em>deadlines.</em>
            </h2>

            <div className="deadline-list">
              {upcomingApplications.map(
                (application) => {
                  const days = getDaysLeft(
                    application.deadline
                  );

                  return (
                    <div
                      className="deadline-item"
                      key={application.id}
                    >
                      <div>
                        <strong>
                          {application.company}
                        </strong>

                        <span>
                          {application.role}
                        </span>
                      </div>

                      <b
                        className={
                          days <= 2
                            ? "urgent"
                            : ""
                        }
                      >
                        {days < 0
                          ? "Expired"
                          : days === 0
                          ? "Today"
                          : `${days} days`}
                      </b>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}

        <section className="final-section">
          <div className="final-art">
            <div className="final-sun"></div>

            <div className="final-mountain final-one"></div>
            <div className="final-mountain final-two"></div>

            <div className="final-city">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <div className="final-content">
            <p className="eyebrow">KEEP GOING</p>

            <h2>
              Your next
              <br />
              opportunity
              <br />
              <em>is out there.</em>
            </h2>

            <button
              className="primary-button"
              onClick={openAddModal}
            >
              Add Application
              <span>→</span>
            </button>
          </div>
        </section>
      </main>

      {/* APPLICATION DETAILS */}

      {selectedApplication && (
        <ApplicationDetails
          application={selectedApplication}
          onClose={() =>
            setSelectedApplication(null)
          }
          onEdit={openEditModal}
        />
      )}

      {/* FOOTER */}

      <footer className="footer">
        <div className="brand">
          JOBLY<span>.</span>
        </div>

        <p>
          Small steps. Big opportunities.
        </p>

        <span>© 2026 Jobly</span>
      </footer>

      {/* MODAL */}

      {showModal && (
        <div
          className="modal-backdrop"
          onMouseDown={closeModal}
        >
          <div
            className="modal"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <button
              className="modal-close"
              onClick={closeModal}
              type="button"
            >
              ×
            </button>

            <p className="eyebrow">
              {editingId !== null
                ? "UPDATE OPPORTUNITY"
                : "NEW OPPORTUNITY"}
            </p>

            <h2>
              {editingId !== null
                ? "Edit application."
                : "Add application."}
            </h2>

            <p className="modal-subtitle">
              Keep the next step on your map.
            </p>

            <form onSubmit={saveApplication}>
              <label>
                Company

                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="e.g. Google"
                  autoComplete="off"
                />
              </label>

              <label>
                Job Role

                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  placeholder="e.g. Software Engineer Intern"
                  autoComplete="off"
                />
              </label>

              <div className="form-grid">
                <label>
                  Status

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    {STATUS_OPTIONS.map(
                      (status) => (
                        <option
                          value={status}
                          key={status}
                        >
                          {status}
                        </option>
                      )
                    )}
                  </select>
                </label>

                <label>
                  Deadline

                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                  />
                </label>
              </div>

              <label>
                Notes

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Interview notes, preparation, links..."
                  rows="4"
                />
              </label>

              <label>
                Job Description

                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                  placeholder="Paste the job description here..."
                  rows="7"
                />
              </label>

              <button
                className="modal-submit"
                type="submit"
              >
                {editingId !== null
                  ? "Save Changes"
                  : "Add to Journey"}

                <span>→</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;