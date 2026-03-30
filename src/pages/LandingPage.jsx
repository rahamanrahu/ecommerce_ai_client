import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import {
  FiZap, FiShield, FiTrendingUp, FiUsers, FiCheckCircle,
  FiArrowRight, FiLogOut, FiGrid, FiStar, FiAward,
  FiActivity, FiBarChart2, FiClock, FiPlus, FiBell,
  FiSettings, FiUser, FiLayers
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { MdRocketLaunch } from "react-icons/md";

// ── animated counter hook ──────────────────────────────
const useCounter = (end, duration = 1800, start = 0) => {
  const [count, setCount] = useState(start);
  useEffect(() => {
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * (end - start) + start));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
};

// ── stat card (dashboard) ─────────────────────────────
const StatCard = ({ icon: Icon, label, value, suffix = "", color, delay = 0 }) => {
  const animated = useCounter(value, 1600);
  return (
    <div className="stat-card" style={{ animationDelay: `${delay}ms` }}>
      <div className="stat-icon-wrap" style={{ background: color + "22", color }}>
        <Icon size={22} />
      </div>
      <div className="stat-info">
        <span className="stat-value">
          {animated}{suffix}
        </span>
        <span className="stat-label">{label}</span>
      </div>
    </div>
  );
};

// ── feature card (public landing) ────────────────────
const FeatureCard = ({ icon: Icon, title, desc, accent }) => (
  <div className="feature-card">
    <div className="feature-icon" style={{ color: accent, background: accent + "18" }}>
      <Icon size={26} />
    </div>
    <h3>{title}</h3>
    <p>{desc}</p>
  </div>
);

// ── activity item ─────────────────────────────────────
const ActivityItem = ({ icon: Icon, text, time, color }) => (
  <div className="activity-item">
    <div className="activity-icon" style={{ background: color + "22", color }}>
      <Icon size={14} />
    </div>
    <div className="activity-text">
      <span>{text}</span>
      <small>{time}</small>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────────────
export default function LandingPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting("Good morning");
    else if (h < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  // ── DASHBOARD VIEW ─────────────────────────────────
  if (currentUser) {
    const { name, email, stats = {}, createdAt } = currentUser;
    const joined = new Date(createdAt).toLocaleDateString("en-US", {
      month: "long", year: "numeric",
    });

    const activities = [
      { icon: FiCheckCircle, text: "Project Alpha marked complete", time: "2 min ago", color: "#22c55e" },
      { icon: FiUsers, text: "3 new team members joined", time: "1 hr ago", color: "#3b82f6" },
      { icon: FiTrendingUp, text: "Monthly report generated", time: "3 hrs ago", color: "#a855f7" },
      { icon: FiStar, text: "You earned 'Top Performer' badge", time: "Yesterday", color: "#f59e0b" },
      { icon: FiActivity, text: "Sprint review scheduled", time: "Yesterday", color: "#ec4899" },
    ];

    return (
      <div className="dashboard-root">
        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <MdRocketLaunch size={22} />
            <span>Nexus</span>
          </div>
          <nav className="sidebar-nav">
            {[
              { icon: FiGrid, label: "Dashboard", active: true },
              { icon: FiLayers, label: "Projects" },
              { icon: FiUsers, label: "Team" },
              { icon: FiBarChart2, label: "Analytics" },
              { icon: FiClock, label: "Timeline" },
              { icon: FiSettings, label: "Settings" },
            ].map(({ icon: Icon, label, active }) => (
              <div key={label} className={`nav-item${active ? " active" : ""}`}>
                <Icon size={18} />
                <span>{label}</span>
              </div>
            ))}
          </nav>
          <div className="sidebar-user">
            <div className="avatar-sm">{name.charAt(0).toUpperCase()}</div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{name.split(" ")[0]}</span>
              <span className="sidebar-user-role">Pro Member</span>
            </div>
            <button className="logout-icon-btn" onClick={handleLogout} title="Log out">
              <FiLogOut size={16} />
            </button>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="dashboard-main">
          {/* top bar */}
          <header className="dash-topbar">
            <div>
              <p className="greeting-sub">{greeting},</p>
              <h1 className="greeting-name">{name} 👋</h1>
            </div>
            <div className="topbar-actions">
              <div className="notif-wrap">
                <button
                  className="icon-btn"
                  onClick={() => setShowNotif((p) => !p)}
                >
                  <FiBell size={18} />
                  <span className="notif-dot" />
                </button>
                {showNotif && (
                  <div className="notif-dropdown">
                    <p className="notif-title">Notifications</p>
                    {activities.slice(0, 3).map((a, i) => (
                      <ActivityItem key={i} {...a} />
                    ))}
                  </div>
                )}
              </div>
              <button className="icon-btn"><FiUser size={18} /></button>
              <button className="btn-primary dash-new-btn">
                <FiPlus size={16} /> New Project
              </button>
            </div>
          </header>

          {/* stats row */}
          <section className="stats-row">
            <StatCard icon={FiGrid}       label="Active Projects"  value={stats.projects || 7}         color="#6366f1" delay={0}   />
            <StatCard icon={FiCheckCircle} label="Tasks Completed" value={stats.tasks || 34}           color="#22c55e" delay={100} />
            <StatCard icon={FiUsers}       label="Team Members"    value={stats.teamMembers || 5}       color="#3b82f6" delay={200} />
            <StatCard icon={FiTrendingUp}  label="Completion Rate" value={stats.completionRate || 78}  color="#f59e0b" suffix="%" delay={300} />
          </section>

          {/* lower grid */}
          <section className="dash-lower-grid">
            {/* activity feed */}
            <div className="dash-card activity-feed">
              <div className="dash-card-header">
                <h2><FiActivity size={16} /> Recent Activity</h2>
                <span className="badge-live">Live</span>
              </div>
              <div className="activity-list">
                {activities.map((a, i) => (
                  <ActivityItem key={i} {...a} />
                ))}
              </div>
            </div>

            {/* profile info */}
            <div className="dash-card profile-card">
              <div className="dash-card-header">
                <h2><FiUser size={16} /> My Profile</h2>
              </div>
              <div className="profile-avatar-lg">
                {name.charAt(0).toUpperCase()}
                <span className="avatar-badge"><FiAward size={12} /></span>
              </div>
              <p className="profile-name">{name}</p>
              <p className="profile-email">{email}</p>
              <div className="profile-meta">
                <span><FiClock size={12} /> Member since {joined}</span>
              </div>
              <div className="profile-skills">
                {["React", "Node.js", "MongoDB", "REST API"].map((s) => (
                  <span key={s} className="skill-tag">{s}</span>
                ))}
              </div>
              <button className="btn-outline full-width mt-12" onClick={handleLogout}>
                <FiLogOut size={14} /> Sign Out
              </button>
            </div>

            {/* quick progress */}
            <div className="dash-card progress-card">
              <div className="dash-card-header">
                <h2><FiBarChart2 size={16} /> Sprint Progress</h2>
              </div>
              {[
                { label: "Design System", pct: 92, color: "#6366f1" },
                { label: "API Integration", pct: 67, color: "#3b82f6" },
                { label: "User Testing", pct: 45, color: "#f59e0b" },
                { label: "Documentation", pct: 28, color: "#ec4899" },
              ].map(({ label, pct, color }) => (
                <div className="progress-item" key={label}>
                  <div className="progress-meta">
                    <span>{label}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    );
  }

  // ── PUBLIC LANDING VIEW ───────────────────────────
  return (
    <div className="landing-root">
      {/* HERO */}
      <section className="hero-section">
        <div className="hero-badge">
          <HiSparkles size={14} /> Introducing Nexus Platform v2.0
        </div>
        <h1 className="hero-headline">
          Build, Ship &amp; Scale<br />
          <span className="gradient-text">Without Limits</span>
        </h1>
        <p className="hero-sub">
          The all-in-one workspace for modern teams. Manage projects, track
          progress, and collaborate in real-time — from idea to launch.
        </p>
        <div className="hero-cta-group">
          <button className="btn-primary btn-lg" onClick={() => navigate("/signup")}>
            Start for Free <FiArrowRight size={16} />
          </button>
          <button className="btn-ghost btn-lg" onClick={() => navigate("/login")}>
            Sign In
          </button>
        </div>
        <p className="hero-trust">
          <FiShield size={13} /> No credit card required &nbsp;·&nbsp; Free forever plan
        </p>

        {/* floating orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <p className="section-label">WHY NEXUS</p>
        <h2 className="section-title">Everything your team needs</h2>
        <div className="features-grid">
          <FeatureCard
            icon={FiZap}
            title="Lightning Fast"
            desc="Blazing performance with real-time updates. Zero lag, zero friction in every workflow."
            accent="#6366f1"
          />
          <FeatureCard
            icon={FiShield}
            title="Enterprise Security"
            desc="End-to-end encryption, role-based access, and SOC 2 compliance baked in."
            accent="#22c55e"
          />
          <FeatureCard
            icon={FiTrendingUp}
            title="Powerful Analytics"
            desc="Beautiful dashboards and reports that surface insights exactly when you need them."
            accent="#f59e0b"
          />
          <FeatureCard
            icon={FiUsers}
            title="Team Collaboration"
            desc="Real-time collaboration tools that keep distributed teams perfectly in sync."
            accent="#ec4899"
          />
          <FeatureCard
            icon={FiGrid}
            title="Project Management"
            desc="Kanban, Gantt, and list views. Work the way that suits you best."
            accent="#3b82f6"
          />
          <FeatureCard
            icon={FiAward}
            title="Gamified Progress"
            desc="Badges, streaks, and milestones that keep your team motivated and engaged."
            accent="#a855f7"
          />
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="proof-section">
        <div className="proof-inner">
          {[
            { num: "50K+", label: "Happy Teams" },
            { num: "2M+", label: "Tasks Shipped" },
            { num: "99.9%", label: "Uptime SLA" },
            { num: "4.9★", label: "Average Rating" },
          ].map(({ num, label }) => (
            <div className="proof-item" key={label}>
              <span className="proof-num">{num}</span>
              <span className="proof-label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BOTTOM */}
      <section className="cta-section">
        <h2>Ready to transform how your team works?</h2>
        <p>Join thousands of teams already using Nexus to ship faster.</p>
        <button className="btn-primary btn-lg" onClick={() => navigate("/signup")}>
          Create Your Free Account <FiArrowRight size={16} />
        </button>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="footer-brand">
          <MdRocketLaunch size={18} /> Nexus
        </div>
        <p>© {new Date().getFullYear()} Nexus Platform. Built with React + localStorage magic.</p>
      </footer>
    </div>
  );
}
