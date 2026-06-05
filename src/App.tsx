import { useEffect, useState } from "react";
import { serviceCategories, type ServiceCategory } from "./data/services";

const apiBaseUrl = import.meta.env.VITE_API_URL ?? "";
const adminTokenStorageKey = "mittal-admin-token";

type AdminEnquiry = {
  _id: string;
  name: string;
  phone: string;
  service: string;
  urgency: string;
  requirement: string;
  status: string;
  createdAt: string;
};

type AdminStats = {
  totalRequests: number;
  newRequests: number;
  urgentRequests: number;
};

const adminStatuses = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];

const processSteps = [
  {
    title: "Discovery & scope alignment",
    detail: "We understand the filing, compliance, or notice context and define the exact service path before work begins.",
  },
  {
    title: "Document collection",
    detail: "Clients receive a guided checklist so the advisory team gets the right records the first time.",
  },
  {
    title: "Review & structured handling",
    detail: "Our team reviews computations, reconciles gaps, and prepares the filing, reply, or advisory note.",
  },
  {
    title: "Approval & submission",
    detail: "The client reviews the recommendation, then we complete portal filing, reply submission, or compliance action.",
  },
];

const trustSignals = [
  "Service coverage across filings, registrations, notices, NRI, and compliance work",
  "Document-led workflows designed to reduce back-and-forth",
  "Urgency-aware intake for notices and deadline-sensitive filings",
];

const platformPillars = [
  {
    title: "Structured service journeys",
    text: "Every service can evolve into a dedicated landing page with documents, process, FAQ, and consultation flow.",
  },
  {
    title: "Lead quality over lead volume",
    text: "Forms are shaped to collect intent, urgency, and document readiness so follow-up is sharper.",
  },
  {
    title: "Built for later operations",
    text: "The front end is intentionally aligned with future admin workflows, document tracking, and CRM-style handling.",
  },
];

const stats = [
  ["8", "Core advisory categories"],
  ["30+", "Mapped deliverables"],
  ["15-30 days", "Typical notice response window"],
  ["Quarterly", "Recurring TDS cycle"],
];

const adminWorkflowSteps = [
  "Receive enquiry",
  "Review scope",
  "Collect documents",
  "Confirm engagement",
  "Track follow-up",
];

const dashboardSignals = [
  "New enquiry counts update automatically from the database.",
  "Urgency indicators highlight notice and deadline-sensitive matters.",
  "Status controls help track new, contacted, and closed requests.",
  "Saved enquiries stay organised for internal follow-up.",
];

const servicePageSteps = [
  "Initial consultation to confirm the service scope and urgency",
  "Checklist-based document collection for accurate review",
  "Review, computation, drafting, or compliance preparation",
  "Submission, acknowledgement, and follow-up support where applicable",
];

function getActiveServiceIdFromHash() {
  const hash = window.location.hash.replace(/^#/, "");
  if (hash.startsWith("service/")) {
    return hash.replace("service/", "");
  }

  return null;
}

function isAdminHash() {
  return window.location.hash.replace(/^#/, "") === "admin";
}

function scrollToHashSection(hash: string) {
  window.setTimeout(() => {
    document.getElementById(hash)?.scrollIntoView({ behavior: "auto" });
  }, 0);
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getUrgencyLabel(urgency: string) {
  if (urgency === "deadline") {
    return "Deadline this month";
  }

  if (urgency === "notice") {
    return "Notice / urgent";
  }

  return "Routine advisory";
}

function getServiceName(id: string) {
  const service = serviceCategories.find((item) => item.id === id);
  return service ? service.title : "Consultation";
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <p className="footer-label">Mittal's Consultancy & Advisory</p>
          <p className="footer-copy">
            Structured compliance, documentation, and advisory support for individuals, businesses,
            founders, and NRI clients.
          </p>
        </div>
        <div>
          <p className="footer-label">Key Services</p>
          <ul className="footer-list">
            <li>ITR Filing</li>
            <li>GST Compliance</li>
            <li>Income Tax Notices</li>
            <li>Business Registration</li>
          </ul>
        </div>
        <div>
          <p className="footer-label">Consultation Flow</p>
          <ul className="footer-list">
            <li>Scope discussion</li>
            <li>Document review</li>
            <li>Engagement confirmation</li>
            <li>Execution support</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>Prepared for structured advisory presentation.</span>
        <a href="#top">Back to top</a>
      </div>
    </footer>
  );
}

type ConsultationProps = {
  name: string;
  phone: string;
  selectedService: string;
  urgency: string;
  requirement: string;
  isSubmitted: boolean;
  isSubmitting: boolean;
  submitError: string;
  setName: (value: string) => void;
  setPhone: (value: string) => void;
  setSelectedService: (value: string) => void;
  setUrgency: (value: string) => void;
  setRequirement: (value: string) => void;
  handleSubmit: (event: React.FormEvent) => void;
  handleReset: () => void;
  getServiceName: (id: string) => string;
  title?: string;
  description?: string;
};

function ConsultationSection({
  name,
  phone,
  selectedService,
  urgency,
  requirement,
  isSubmitted,
  isSubmitting,
  submitError,
  setName,
  setPhone,
  setSelectedService,
  setUrgency,
  setRequirement,
  handleSubmit,
  handleReset,
  getServiceName,
  title = "Share the matter, timeline, and service need. We’ll shape the next flow from there.",
  description = "This stays intentionally practical: a stronger front-end consultation experience now, with backend routing, document upload, notifications, and dashboard handling in the next product slices.",
}: ConsultationProps) {
  return (
    <section className="section enquiry-shell" id="enquiry">
      <div className="enquiry-copy">
        <p className="eyebrow">Consultation intake</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <div className="enquiry-form-container">
        {isSubmitted ? (
          <div className="enquiry-form success-card">
            <div className="success-icon-glow">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="success-check-svg"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3>Request Submitted Successfully</h3>
            <p className="success-text">
              Thank you, <strong>{name}</strong>. We've received your request for{" "}
              <strong>{getServiceName(selectedService)}</strong>.
            </p>
            <p className="success-detail">
              Our advisory desk will contact you at <strong>{phone}</strong> shortly to align on documents and next steps.
            </p>
            <button type="button" className="success-reset-btn" onClick={handleReset}>
              Submit another query
            </button>
          </div>
        ) : (
          <form className="enquiry-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                Full name
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                />
              </label>
              <label>
                Mobile number
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </label>
            </div>

            <div className="form-grid">
              <label>
                Service needed
                <select
                  required
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                >
                  <option value="" disabled>
                    Select a service
                  </option>
                  {serviceCategories.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Urgency
                <select required value={urgency} onChange={(e) => setUrgency(e.target.value)}>
                  <option value="" disabled>
                    Select urgency
                  </option>
                  <option value="routine">Routine advisory</option>
                  <option value="deadline">Deadline this month</option>
                  <option value="notice">Notice or urgent response</option>
                </select>
              </label>
            </div>

            <label>
              Brief requirement
              <textarea
                required
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                placeholder="Example: I received an income tax notice and need a response prepared before the deadline."
              />
            </label>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving request..." : "Request professional consultation"}
            </button>
            {submitError ? <p className="form-status error">{submitError}</p> : null}
          </form>
        )}
      </div>
    </section>
  );
}

function ServiceDetailPage({ service }: { service: ServiceCategory }) {
  return (
    <section className="section service-detail-page" id="top">
      <div className="service-detail-hero">
        <div className="service-detail-copy">
          <a className="back-link" href="#">
            Back to all services
          </a>
          <p className="eyebrow">Detailed service page</p>
          <h1>{service.title}</h1>
          <p className="hero-text detail-text">{service.detailIntro}</p>
        </div>

        <aside className="service-detail-panel">
          <p className="service-label">Engagement basis</p>
          <strong className="service-price">{service.startingPrice}</strong>
          <p className="panel-detail">{service.pricingNote}</p>
          <p className="panel-scope">{service.scopeNote}</p>
          {service.urgency ? <p className="detail-urgency">{service.urgency}</p> : null}
        </aside>
      </div>

      <div className="detail-grid">
        <article className="detail-card">
          <p className="detail-section-label">Who this service is for</p>
          <h3>Suited for</h3>
          <p>{service.audience}</p>
        </article>

        <article className="detail-card">
          <p className="detail-section-label">Engagement note</p>
          <h3>Scope and engagement approach</h3>
          <p>{service.scopeNote}</p>
          <p>{service.timeline}</p>
        </article>
      </div>

      <div className="detail-content-grid">
        <article className="detail-card">
          <p className="detail-section-label">Required documents</p>
          <h3>What we usually need from the client</h3>
          <ul className="detail-list">
            {service.documents.map((document) => (
              <li key={document}>{document}</li>
            ))}
          </ul>
        </article>

        <article className="detail-card">
          <p className="detail-section-label">Included support</p>
          <h3>What the service normally covers</h3>
          <ul className="detail-list">
            {service.deliverables.map((deliverable) => (
              <li key={deliverable}>{deliverable}</li>
            ))}
          </ul>
        </article>
      </div>

      <section className="detail-process">
        <div className="section-heading compact">
          <p className="eyebrow">How this engagement usually works</p>
          <h2>A clear sequence from review to completion.</h2>
        </div>
        <div className="detail-process-grid">
          {servicePageSteps.map((step, index) => (
            <article className="detail-step-card" key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{step}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="detail-faq">
        <div className="section-heading compact">
          <p className="eyebrow">Frequently asked questions</p>
          <h2>Important things clients usually ask before starting.</h2>
        </div>
        <div className="faq-grid">
          {service.faqs.map((faq) => (
            <article className="detail-card" key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

function AdminPortal() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(() => localStorage.getItem(adminTokenStorageKey) ?? "");
  const [enquiries, setEnquiries] = useState<AdminEnquiry[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalRequests: 0,
    newRequests: 0,
    urgentRequests: 0,
  });
  const [loginError, setLoginError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [selectedRequirement, setSelectedRequirement] = useState<AdminEnquiry | null>(null);
  const [activeRequestId, setActiveRequestId] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const fetchAdminData = async (adminToken: string) => {
    setIsLoadingData(true);
    setLoadError("");

    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/enquiries`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message ?? "Could not load admin data.");
      }

      setStats(data.stats);
      setEnquiries(data.enquiries);
    } catch (error) {
      localStorage.removeItem(adminTokenStorageKey);
      setToken("");
      setLoadError(error instanceof Error ? error.message : "Could not load admin data.");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (token) {
      void fetchAdminData(token);
    }
  }, [token]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message ?? "Could not verify admin credentials.");
      }

      localStorage.setItem(adminTokenStorageKey, data.token);
      setToken(data.token);
      setPassword("");
    } catch (error) {
      setLoginError(
        error instanceof Error ? error.message : "Could not verify admin credentials.",
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(adminTokenStorageKey);
    setToken("");
    setEnquiries([]);
  };

  const handleStatusChange = async (id: string, status: string) => {
    setActiveRequestId(id);
    setLoadError("");

    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message ?? "Could not update request.");
      }

      await fetchAdminData(token);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Could not update request.");
    } finally {
      setActiveRequestId("");
    }
  };

  const handleDelete = async (enquiry: AdminEnquiry) => {
    const confirmed = window.confirm(`Delete request from ${enquiry.name}?`);

    if (!confirmed) {
      return;
    }

    setActiveRequestId(enquiry._id);
    setLoadError("");

    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/enquiries/${enquiry._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message ?? "Could not delete request.");
      }

      await fetchAdminData(token);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Could not delete request.");
    } finally {
      setActiveRequestId("");
    }
  };

  if (!token) {
    return (
      <section className="section admin-login-shell" id="admin">
        <div className="admin-login-copy">
          <p className="eyebrow">Admin portal</p>
          <h1>Client request dashboard</h1>
          <p>Use the admin credentials from the environment file to view client enquiries.</p>
        </div>

        <form className="admin-login-card" onSubmit={handleLogin}>
          <label>
            Admin username
            <input
              type="text"
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Admin username"
            />
          </label>
          <label>
            Admin password
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Admin password"
            />
          </label>
          <button type="submit" disabled={isLoggingIn}>
            {isLoggingIn ? "Verifying..." : "Open admin portal"}
          </button>
          {loginError || loadError ? (
            <p className="form-status error">{loginError || loadError}</p>
          ) : null}
        </form>
      </section>
    );
  }

  return (
    <section className="section admin-dashboard" id="admin">
      <div className="admin-dashboard-header">
        <div>
          <p className="eyebrow">Admin portal</p>
          <h1>Client enquiry dashboard</h1>
          <p>Review consultation requests and pick up the clients that need follow-up.</p>
        </div>
        <div className="admin-actions">
          <button type="button" onClick={() => void fetchAdminData(token)} disabled={isLoadingData}>
            {isLoadingData ? "Refreshing..." : "Refresh"}
          </button>
          <button type="button" className="secondary-admin-action" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>

      <div className="admin-stat-grid">
        <article>
          <span>Total requests</span>
          <strong>{stats.totalRequests}</strong>
        </article>
        <article>
          <span>New requests</span>
          <strong>{stats.newRequests}</strong>
        </article>
        <article>
          <span>Urgent / deadline</span>
          <strong>{stats.urgentRequests}</strong>
        </article>
      </div>

      {loadError ? <p className="form-status error">{loadError}</p> : null}

      <div className="admin-table-card">
        {enquiries.length === 0 ? (
          <p className="admin-empty-state">No client enquiries yet.</p>
        ) : (
          <div className="admin-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Phone</th>
                  <th>Service</th>
                  <th>Urgency</th>
                  <th>Requirement</th>
                  <th>Status</th>
                  <th>Received</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((enquiry) => (
                  <tr key={enquiry._id}>
                    <td>
                      <strong>{enquiry.name}</strong>
                      <span>{enquiry.status}</span>
                    </td>
                    <td>
                      <a href={`tel:${enquiry.phone}`}>{enquiry.phone}</a>
                    </td>
                    <td>{getServiceName(enquiry.service)}</td>
                    <td>
                      <span className={`admin-urgency admin-urgency-${enquiry.urgency}`}>
                        {getUrgencyLabel(enquiry.urgency)}
                      </span>
                    </td>
                    <td>
                      <p className="requirement-preview">{enquiry.requirement}</p>
                      <button
                        type="button"
                        className="admin-text-action"
                        onClick={() => setSelectedRequirement(enquiry)}
                      >
                        View full requirement
                      </button>
                    </td>
                    <td>
                      <select
                        className="admin-status-select"
                        value={enquiry.status}
                        disabled={activeRequestId === enquiry._id}
                        onChange={(event) => void handleStatusChange(enquiry._id, event.target.value)}
                      >
                        {adminStatuses.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{formatDateTime(enquiry.createdAt)}</td>
                    <td>
                      <div className="admin-row-actions">
                        <a href={`tel:${enquiry.phone}`}>Call</a>
                        <button
                          type="button"
                          onClick={() => void handleDelete(enquiry)}
                          disabled={activeRequestId === enquiry._id}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedRequirement ? (
        <div className="admin-modal-backdrop" role="dialog" aria-modal="true">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <div>
                <p className="detail-section-label">Requirement details</p>
                <h2>{selectedRequirement.name}</h2>
              </div>
              <button type="button" onClick={() => setSelectedRequirement(null)}>
                Close
              </button>
            </div>
            <div className="admin-modal-meta">
              <span>{getServiceName(selectedRequirement.service)}</span>
              <span>{getUrgencyLabel(selectedRequirement.urgency)}</span>
              <span>{formatDateTime(selectedRequirement.createdAt)}</span>
            </div>
            <p className="admin-modal-requirement">{selectedRequirement.requirement}</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export function App() {
  const [activeServiceId, setActiveServiceId] = useState<string | null>(() =>
    typeof window !== "undefined" ? getActiveServiceIdFromHash() : null,
  );
  const [isAdminRoute, setIsAdminRoute] = useState(() =>
    typeof window !== "undefined" ? isAdminHash() : false,
  );
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [urgency, setUrgency] = useState("");
  const [requirement, setRequirement] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [activeOpsTab, setActiveOpsTab] = useState<"workflow" | "dashboard">("workflow");

  // Scroll header state
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, "");
      const nextActiveServiceId = getActiveServiceIdFromHash();
      const nextIsAdminRoute = isAdminHash();

      setActiveServiceId(nextActiveServiceId);
      setIsAdminRoute(nextIsAdminRoute);

      if (nextActiveServiceId || nextIsAdminRoute || hash === "") {
        window.scrollTo({ top: 0, behavior: "auto" });
        return;
      }

      scrollToHashSection(hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (activeServiceId) {
      setSelectedService(activeServiceId);
    }
  }, [activeServiceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (name && phone && selectedService && urgency && requirement) {
      setIsSubmitting(true);
      try {
        const response = await fetch(`${apiBaseUrl}/api/enquiries`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            phone,
            service: selectedService,
            urgency,
            requirement,
          }),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.message ?? "Could not submit your request right now.");
        }

        setIsSubmitted(true);
      } catch (error) {
        setSubmitError(
          error instanceof Error
            ? error.message
            : "Could not submit your request right now.",
        );
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setSubmitError("Please complete all fields before submitting.");
    }
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    if (!isSubmitting) {
      void handleSubmit(event);
    } else {
      event.preventDefault();
    }
  };

  const handleReset = () => {
    setName("");
    setPhone("");
    setSelectedService(activeServiceId ?? "");
    setUrgency("");
    setRequirement("");
    setSubmitError("");
    setIsSubmitted(false);
  };

  const activeService =
    activeServiceId !== null && !isAdminRoute
      ? serviceCategories.find((service) => service.id === activeServiceId) ?? null
      : null;

  return (
    <main className="page-shell">
      <header className={`site-header ${scrolled ? "scrolled" : ""} ${activeService ? "detail-header" : "landing-header"}`}>
        <a className="brand" href="#" aria-label="Mittal's Consultancy & Advisory home">
          <span className="brand-mark">M</span>
          <span className="brand-text">
            Mittal's
            <strong>Consultancy & Advisory</strong>
          </span>
        </a>
        <nav aria-label="Primary navigation">
          <a href={activeService ? "#" : "#services"}>Services</a>
          <a href={activeService ? "#enquiry" : "#process"}>Process</a>
          <a href="#enquiry">Consultation</a>
        </nav>
        <a className="header-cta" href="#enquiry">
          Schedule Consultation
        </a>
      </header>

      {isAdminRoute ? <AdminPortal /> : null}

      {!activeService && !isAdminRoute ? (
        <div className="hero-section-container">
          <div className="hero-backdrop" aria-hidden="true">
            <div className="hero-orb hero-orb-left" />
            <div className="hero-orb hero-orb-right" />
            <div className="grid-glow" />
          </div>

          <section className="hero" id="top">
            <div className="hero-copy">
              <p className="eyebrow">Consultancy and advisory platform</p>
              <h1>Structured compliance and advisory services presented with clarity.</h1>
              <p className="hero-text">
                A focused digital foundation for filings, registrations, notices, planning,
                NRI matters, TDS compliance, and capital gains advisory.
              </p>

              <div className="hero-actions">
                <a className="primary-button" href="#enquiry">
                  Start Consultation Request
                </a>
                <a className="secondary-button" href="#services">
                  Explore Service Catalogue
                </a>
              </div>

              <ul className="trust-list">
                {trustSignals.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <aside className="hero-panel" aria-label="Platform preview">
              <div className="hero-panel-header">
                <span className="panel-label">Positioning snapshot</span>
                <span className="panel-chip">Phase 1 foundation</span>
              </div>

              <div className="hero-panel-card">
                <p className="mini-heading">Primary promise</p>
                <h2>Clear service positioning with stronger lead intent capture.</h2>
                <p>
                  Built to keep advisory communication clear, then convert enquiries into structured
                  client workflows.
                </p>
              </div>

              <div className="hero-panel-metrics">
                {stats.map(([value, label]) => (
                  <div key={label}>
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </aside>
          </section>
        </div>
      ) : null}

      {activeService && !isAdminRoute ? (
        <>
          <ServiceDetailPage service={activeService} />
          <ConsultationSection
            name={name}
            phone={phone}
            selectedService={selectedService}
            urgency={urgency}
            requirement={requirement}
            isSubmitted={isSubmitted}
            isSubmitting={isSubmitting}
            submitError={submitError}
            setName={setName}
            setPhone={setPhone}
            setSelectedService={setSelectedService}
            setUrgency={setUrgency}
            setRequirement={setRequirement}
            handleSubmit={handleFormSubmit}
            handleReset={handleReset}
            getServiceName={getServiceName}
            title={`Start your ${activeService.title.toLowerCase()} consultation.`}
            description="Share the scope, timeline, and documents already available. The engagement path is confirmed after reviewing the work involved and exact service scope."
          />
        </>
      ) : !isAdminRoute ? (
        <>
          <section className="section intro-strip">
            <div className="section-heading compact">
              <p className="eyebrow">Why this platform direction works</p>
              <h2>Made for a practice that wants to look established, responsive, and detail-driven.</h2>
            </div>
            <div className="pillar-grid">
              {platformPillars.map((pillar) => (
                <article className="pillar-card" key={pillar.title}>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="section ops-section" id="process">
            <div className="section-heading compact">
              <p className="eyebrow">Client intake operations</p>
              <h2>From first enquiry to structured follow-up.</h2>
              <p>
                The public site collects the client’s requirement, service area, urgency, and contact
                details, then keeps those requests ready for structured internal follow-up.
              </p>
            </div>

            <div className="ops-tabs" role="tablist" aria-label="Platform operation tabs">
              <button
                type="button"
                className={`ops-tab ${activeOpsTab === "workflow" ? "active" : ""}`}
                onClick={() => setActiveOpsTab("workflow")}
                aria-selected={activeOpsTab === "workflow"}
              >
                Intake workflow
              </button>
              <button
                type="button"
                className={`ops-tab ${activeOpsTab === "dashboard" ? "active" : ""}`}
                onClick={() => setActiveOpsTab("dashboard")}
                aria-selected={activeOpsTab === "dashboard"}
              >
                Follow-up view
              </button>
            </div>

            {activeOpsTab === "workflow" ? (
              <div className="ops-panel">
                <div className="ops-copy">
                  <p className="detail-section-label">Structured client intake</p>
                  <h3>Every request moves through a simple review sequence.</h3>
                  <p>
                    The site keeps intake focused: capture the client’s matter, understand the
                    urgency, collect documents, confirm the engagement path, and track the next
                    follow-up internally.
                  </p>
                </div>
                <div className="workflow-steps">
                  {adminWorkflowSteps.map((step, index) => (
                    <article className="workflow-step-card" key={step}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{step}</strong>
                    </article>
                  ))}
                </div>
              </div>
            ) : (
              <div className="ops-panel">
                <div className="ops-copy">
                  <p className="detail-section-label">Live enquiry dashboard</p>
                  <h3>Saved requests become a practical follow-up list.</h3>
                  <p>
                    The follow-up view shows total requests, new requests, urgent matters, full
                    requirements, contact links, status updates, and delete controls for cleanup.
                  </p>
                </div>
                <div className="dashboard-signal-grid">
                  {dashboardSignals.map((signal) => (
                    <article className="dashboard-signal-card" key={signal}>
                      <p>{signal}</p>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="section" id="services">
            <div className="section-heading">
              <p className="eyebrow">Service catalogue</p>
              <h2>Advisory and compliance services organised for clear client decision-making.</h2>
              <p>
                Each card now leads to its own detailed page with scope, required documents, pricing
                guidance, FAQs, and consultation intake.
              </p>
            </div>

            <div className="service-grid">
              {serviceCategories.map((service) => (
                <article className="service-card" key={service.id}>
                  <div className="card-header">
                    <div>
                      <p className="service-label">Engagement basis</p>
                      <strong className="service-price">{service.startingPrice}</strong>
                    </div>
                    {service.urgency ? <span className="urgency-badge">Urgent timelines</span> : null}
                  </div>

                  <div className="service-heading">
                    <h3>{service.title}</h3>
                    <p>{service.summary}</p>
                  </div>

                  <div className="service-meta">
                    <div>
                      <span>Suited for</span>
                      <p>{service.audience}</p>
                    </div>
                    <div>
                      <span>Typical inputs</span>
                      <p>{service.documents.slice(0, 3).join(", ")}</p>
                    </div>
                  </div>

                  <div className="deliverable-block">
                    <span>Included deliverables</span>
                    <ul>
                      {service.deliverables.slice(0, 3).map((deliverable) => (
                        <li key={deliverable}>{deliverable}</li>
                      ))}
                    </ul>
                  </div>

                  {service.urgency ? <p className="urgency-note">{service.urgency}</p> : null}

                  <a className="service-detail-link" href={`#service/${service.id}`}>
                    View detailed service page
                  </a>
                </article>
              ))}
            </div>
          </section>

          <section className="section process-section" id="process">
            <div className="process-summary">
              <p className="eyebrow">Client journey</p>
              <h2>A more reassuring process, from first enquiry to final submission.</h2>
              <p>
                The experience is designed to be orderly and reassuring, especially for clients who
                are responding to notices or dealing with deadline-driven filings.
              </p>
            </div>

            <div className="process-list">
              {processSteps.map((step, index) => (
                <article className="process-step" key={step.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <ConsultationSection
            name={name}
            phone={phone}
            selectedService={selectedService}
            urgency={urgency}
            requirement={requirement}
            isSubmitted={isSubmitted}
            isSubmitting={isSubmitting}
            submitError={submitError}
            setName={setName}
            setPhone={setPhone}
            setSelectedService={setSelectedService}
            setUrgency={setUrgency}
            setRequirement={setRequirement}
            handleSubmit={handleFormSubmit}
            handleReset={handleReset}
            getServiceName={getServiceName}
          />
        </>
      ) : null}

      <Footer />
    </main>
  );
}
