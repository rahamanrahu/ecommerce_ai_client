import React, { useState, useEffect, useRef } from "react";
import {
  FiHeart, FiGlobe, FiShield, FiUsers, FiStar, FiAward,
  FiMail, FiTwitter, FiLinkedin, FiGithub, FiArrowRight,
  FiCheckCircle, FiTrendingUp, FiPackage, FiZap
} from "react-icons/fi";
import { MdRocketLaunch, MdEco, MdSupportAgent } from "react-icons/md";
import { HiSparkles } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

/* ── ANIMATED COUNTER ───────────────────────────── */
const useInView = (ref) => {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
};

const AnimCounter = ({ end, suffix = "", prefix = "", duration = 2000 }) => {
  const ref = useRef();
  const inView = useInView(ref);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

/* ── TEAM DATA ──────────────────────────────────── */
const TEAM = [
  { name:"Aisha Patel",    role:"CEO & Co-Founder",        emoji:"👩‍💼", color:"#6366f1", bio:"Former VP at Stripe. 10+ years building commerce products at scale. Forbes 30 Under 30.", twitter:"@aishapatel", linkedin:"aisha-patel" },
  { name:"Marcus Chen",   role:"CTO & Co-Founder",        emoji:"👨‍💻", color:"#3b82f6", bio:"Ex-Google engineer. Architect of systems serving 100M+ users. Open source contributor.", twitter:"@mchen_dev", linkedin:"marcus-chen" },
  { name:"Priya Sharma",  role:"Head of Design",          emoji:"👩‍🎨", color:"#ec4899", bio:"Award-winning UX designer. Previously at Apple & Figma. Passionate about accessible design.", twitter:"@priyauxd", linkedin:"priya-sharma" },
  { name:"James Okafor",  role:"VP of Engineering",       emoji:"👨‍🔧", color:"#22c55e", bio:"Built payments infra at Shopify. Full-stack expert with deep React & Node.js background.", twitter:"@jamesokafor", linkedin:"james-okafor" },
  { name:"Sofia Reyes",   role:"Head of Marketing",       emoji:"👩‍📊", color:"#f59e0b", bio:"Growth hacker who scaled 3 startups to Series B. SEO & content strategy specialist.", twitter:"@sofiagrowth", linkedin:"sofia-reyes" },
  { name:"Raj Mehta",     role:"Lead Product Manager",    emoji:"👨‍💼", color:"#8b5cf6", bio:"INSEAD MBA. Built 0-to-1 products at Razorpay and Flipkart. User-obsessed PM.", twitter:"@rajmehta", linkedin:"raj-mehta" },
];

/* ── TIMELINE ───────────────────────────────────── */
const TIMELINE = [
  { year:"2019", title:"The Idea", desc:"Aisha and Marcus met at a hackathon and sketched Nexus on a napkin — a single platform replacing 8 tools.", color:"#6366f1" },
  { year:"2020", title:"Seed Round", desc:"Raised $2.1M from Y Combinator W20. Built the core team of 5 and shipped the MVP in 90 days.", color:"#3b82f6" },
  { year:"2021", title:"Product-Market Fit", desc:"10,000 teams signed up in month 1. Featured in TechCrunch. Grew to 30 employees across 3 continents.", color:"#22c55e" },
  { year:"2022", title:"Series A", desc:"Raised $18M Series A led by Sequoia. Launched Collections and marketplace with 500+ curated products.", color:"#f59e0b" },
  { year:"2023", title:"Global Expansion", desc:"Expanded to 47 countries. Launched Nexus Pro and Enterprise tiers. 1M+ active users milestone.", color:"#ec4899" },
  { year:"2024", title:"Today", desc:"50K+ teams, $120M ARR, 120 employees worldwide. Launching AI-powered features and Nexus Platform v2.0.", color:"#8b5cf6" },
];

/* ── VALUES DATA ────────────────────────────────── */
const VALUES = [
  { icon: FiHeart,       title:"Customer First",    desc:"Every decision starts with 'how does this help our users?' We obsess over the customer experience.", color:"#ef4444" },
  { icon: FiShield,      title:"Radical Transparency", desc:"We share wins, losses, financials, and roadmaps openly — with our team and our community.", color:"#3b82f6" },
  { icon: MdEco,         title:"Sustainability",    desc:"Carbon-neutral since 2022. We offset 110% of emissions and donate 1% of revenue to reforestation.", color:"#22c55e" },
  { icon: FiZap,         title:"Move Fast",         desc:"We ship weekly. Perfection is the enemy of good. We iterate fast, learn faster, and build with purpose.", color:"#f59e0b" },
  { icon: FiGlobe,       title:"Inclusive by Design", desc:"Our team spans 18 nationalities. Our products are built to work for everyone, everywhere.", color:"#8b5cf6" },
  { icon: MdSupportAgent,title:"Extraordinary Support", desc:"Median first response: 3 minutes. 97% CSAT. We believe support is a product feature, not an afterthought.", color:"#06b6d4" },
];

/* ── PRESS LOGOS ────────────────────────────────── */
const PRESS = ["TechCrunch", "Forbes", "Wired", "The Verge", "Fast Company", "Product Hunt"];

/* ── COMPONENT ──────────────────────────────────── */
export default function AboutPage() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [activeTeamIdx, setActiveTeamIdx] = useState(null);

  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  return (
    <div className={`about-page${mounted ? " page-mounted" : ""}`}>

      {/* ── HERO ── */}
      <div className="page-hero about-hero">
        <div className="page-hero-orb orb-a" />
        <div className="page-hero-orb orb-b" />
        <div className="page-hero-content">
          <span className="hero-eyebrow"><HiSparkles size={13} /> Our Story</span>
          <h1>Built by builders,<br /><span className="gradient-text">for builders</span></h1>
          <p>We're on a mission to make great software accessible to every team on the planet.</p>
          <div className="hero-cta-group">
            <button className="btn-primary btn-lg" onClick={() => navigate("/signup")}>
              Join Us <FiArrowRight size={16} />
            </button>
            <button className="btn-ghost btn-lg" onClick={() => navigate("/collections")}>
              Browse Products
            </button>
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="about-stats-row">
        {[
          { end:50000, suffix:"+" , label:"Teams Worldwide",  color:"#6366f1", icon:FiUsers },
          { end:2,     suffix:"M+", label:"Tasks Completed",  color:"#22c55e", icon:FiCheckCircle },
          { end:120,   suffix:"",   label:"Team Members",     color:"#3b82f6", icon:FiAward },
          { end:47,    suffix:"",   label:"Countries Served", color:"#f59e0b", icon:FiGlobe },
          { end:99.9,  suffix:"%",  label:"Uptime SLA",       color:"#ec4899", icon:FiZap },
        ].map(({ end, suffix, label, color, icon: Icon }) => (
          <div className="about-stat-card" key={label} style={{ "--accent": color }}>
            <div className="about-stat-icon" style={{ background: color + "18", color }}>
              <Icon size={20} />
            </div>
            <span className="about-stat-num" style={{ color }}>
              <AnimCounter end={end} suffix={suffix} />
            </span>
            <span className="about-stat-label">{label}</span>
          </div>
        ))}
      </div>

      {/* ── MISSION ── */}
      <section className="about-section mission-section">
        <div className="mission-layout">
          <div className="mission-text">
            <span className="section-label">OUR MISSION</span>
            <h2>One platform.<br />Infinite possibilities.</h2>
            <p>
              Nexus was born from frustration. In 2019, our founders were juggling 8 different tools
              just to run their team — Slack for chat, Notion for docs, Jira for tasks, Figma for design,
              and more. The context-switching was killing productivity.
            </p>
            <p>
              We built Nexus to be the single platform that replaces them all. Not by being average at
              everything, but by being exceptional at the things that matter most: communication,
              project tracking, and shipping product.
            </p>
            <div className="mission-points">
              {["Ship features weekly", "Listen obsessively to users", "Build for the long term"].map(p => (
                <div key={p} className="mission-point">
                  <FiCheckCircle size={16} style={{ color: "#22c55e" }} />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mission-visual">
            <div className="mission-card-stack">
              {[
                { emoji:"⚡", label:"10× Faster", sub:"than legacy tools", color:"#6366f1" },
                { emoji:"🛡️", label:"SOC 2 Type II", sub:"certified", color:"#22c55e" },
                { emoji:"🌍", label:"47 Countries", sub:"served globally", color:"#f59e0b" },
              ].map(({ emoji, label, sub, color }) => (
                <div key={label} className="mission-mini-card" style={{ "--accent": color }}>
                  <span className="mc-emoji">{emoji}</span>
                  <div>
                    <strong style={{ color }}>{label}</strong>
                    <span>{sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="about-section values-section">
        <div className="section-center-header">
          <span className="section-label">WHAT WE BELIEVE</span>
          <h2>Our Core Values</h2>
          <p>Six principles that guide every decision we make</p>
        </div>
        <div className="values-grid">
          {VALUES.map(({ icon: Icon, title, desc, color }) => (
            <div className="value-card" key={title} style={{ "--accent": color }}>
              <div className="value-icon" style={{ background: color + "18", color }}>
                <Icon size={22} />
              </div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="about-section timeline-section">
        <div className="section-center-header">
          <span className="section-label">OUR JOURNEY</span>
          <h2>How We Got Here</h2>
          <p>Five years of building, learning, and growing together</p>
        </div>
        <div className="timeline">
          {TIMELINE.map(({ year, title, desc, color }, i) => (
            <div key={year} className={`timeline-item${i % 2 === 0 ? " left" : " right"}`}>
              <div className="timeline-connector">
                <div className="timeline-dot" style={{ background: color, boxShadow: `0 0 12px ${color}66` }} />
              </div>
              <div className="timeline-card" style={{ "--accent": color }}>
                <span className="timeline-year" style={{ color }}>{year}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            </div>
          ))}
          <div className="timeline-line" />
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="about-section team-section">
        <div className="section-center-header">
          <span className="section-label">THE TEAM</span>
          <h2>Meet the People Behind Nexus</h2>
          <p>A global team united by a love of building great products</p>
        </div>
        <div className="team-grid">
          {TEAM.map((member, i) => (
            <div
              key={member.name}
              className={`team-card${activeTeamIdx === i ? " expanded" : ""}`}
              style={{ "--accent": member.color }}
              onClick={() => setActiveTeamIdx(activeTeamIdx === i ? null : i)}
            >
              <div className="team-avatar" style={{ background: member.color + "22", color: member.color }}>
                {member.emoji}
              </div>
              <h3 className="team-name">{member.name}</h3>
              <span className="team-role">{member.role}</span>
              {activeTeamIdx === i && (
                <div className="team-expanded">
                  <p className="team-bio">{member.bio}</p>
                  <div className="team-socials">
                    <span className="social-tag"><FiTwitter size={13} /> {member.twitter}</span>
                    <span className="social-tag"><FiLinkedin size={13} /> {member.linkedin}</span>
                  </div>
                </div>
              )}
              <span className="team-expand-hint">{activeTeamIdx === i ? "▲ Less" : "▼ More"}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRESS ── */}
      <section className="about-section press-section">
        <div className="section-center-header">
          <span className="section-label">AS FEATURED IN</span>
        </div>
        <div className="press-logos">
          {PRESS.map(name => (
            <div key={name} className="press-logo">{name}</div>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="about-section contact-section">
        <div className="contact-card">
          <div className="contact-left">
            <span className="section-label">GET IN TOUCH</span>
            <h2>We'd love to hear from you</h2>
            <p>Have a question, idea, or want to partner? Our team responds within 3 hours on business days.</p>
            <div className="contact-links">
              <a className="contact-link" href="mailto:hello@nexus.io">
                <FiMail size={16} /> hello@nexus.io
              </a>
              <a className="contact-link" href="#">
                <FiTwitter size={16} /> @nexusplatform
              </a>
              <a className="contact-link" href="#">
                <FiGithub size={16} /> /nexus-platform
              </a>
            </div>
          </div>
          <div className="contact-right">
            <button className="btn-primary btn-lg" onClick={() => navigate("/signup")}>
              <MdRocketLaunch size={18} /> Start Building Free
            </button>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "10px" }}>No credit card required</p>
          </div>
        </div>
      </section>

    </div>
  );
}
