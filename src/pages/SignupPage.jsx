import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../App";
import {
  FiUser, FiMail, FiLock, FiEye, FiEyeOff,
  FiAlertCircle, FiCheckCircle, FiArrowRight, FiArrowLeft
} from "react-icons/fi";
import { MdRocketLaunch } from "react-icons/md";

// password strength util
const getStrength = (pw) => {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: "", color: "" },
    { label: "Weak", color: "#ef4444" },
    { label: "Fair", color: "#f59e0b" },
    { label: "Good", color: "#3b82f6" },
    { label: "Strong", color: "#22c55e" },
  ];
  return { score, ...map[score] };
};

const Req = ({ met, text }) => (
  <span className={`pw-req ${met ? "met" : ""}`}>
    <FiCheckCircle size={11} /> {text}
  </span>
);

export default function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "", email: "", password: "", confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  const strength = getStrength(form.password);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    else if (form.name.trim().length < 2) e.name = "Name must be at least 2 characters.";

    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address.";

    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 8)
      e.password = "Password must be at least 8 characters.";
    else if (strength.score < 2)
      e.password = "Password is too weak. Add uppercase letters or numbers.";

    if (!form.confirm) e.confirm = "Please confirm your password.";
    else if (form.confirm !== form.password) e.confirm = "Passwords do not match.";

    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    if (apiError) setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    const result = register({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
    });
    setLoading(false);

    if (result.success) {
      navigate("/", { replace: true });
    } else {
      setApiError(result.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />

      <button className="auth-back-btn" onClick={() => navigate("/")}>
        <FiArrowLeft size={16} /> Back to Home
      </button>

      <div className="auth-card auth-card-tall">
        {/* brand */}
        <div className="auth-brand">
          <div className="auth-logo">
            <MdRocketLaunch size={22} />
          </div>
          <span>Nexus</span>
        </div>

        <div className="auth-header">
          <h1>Create your account</h1>
          <p>Join thousands of teams already using Nexus</p>
        </div>

        {apiError && (
          <div className="alert-error">
            <FiAlertCircle size={16} />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* name */}
          <div className={`form-group ${focused === "name" ? "focused" : ""} ${errors.name ? "has-error" : ""}`}>
            <label htmlFor="name">Full Name</label>
            <div className="input-wrap">
              <FiUser className="input-icon" size={17} />
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused("")}
              />
            </div>
            {errors.name && (
              <span className="field-error">
                <FiAlertCircle size={12} /> {errors.name}
              </span>
            )}
          </div>

          {/* email */}
          <div className={`form-group ${focused === "email" ? "focused" : ""} ${errors.email ? "has-error" : ""}`}>
            <label htmlFor="email">Email address</label>
            <div className="input-wrap">
              <FiMail className="input-icon" size={17} />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused("")}
              />
            </div>
            {errors.email && (
              <span className="field-error">
                <FiAlertCircle size={12} /> {errors.email}
              </span>
            )}
          </div>

          {/* password */}
          <div className={`form-group ${focused === "password" ? "focused" : ""} ${errors.password ? "has-error" : ""}`}>
            <label htmlFor="password">Password</label>
            <div className="input-wrap">
              <FiLock className="input-icon" size={17} />
              <input
                id="password"
                name="password"
                type={showPass ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused("")}
              />
              <button
                type="button"
                className="toggle-pass"
                onClick={() => setShowPass((p) => !p)}
              >
                {showPass ? <FiEyeOff size={17} /> : <FiEye size={17} />}
              </button>
            </div>

            {/* strength bar */}
            {form.password && (
              <div className="strength-wrap">
                <div className="strength-bars">
                  {[1, 2, 3, 4].map((s) => (
                    <div
                      key={s}
                      className="strength-bar"
                      style={{
                        background: strength.score >= s ? strength.color : "var(--border)",
                        transition: "background 0.3s",
                      }}
                    />
                  ))}
                </div>
                <span className="strength-label" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}

            {/* requirements */}
            <div className="pw-reqs">
              <Req met={form.password.length >= 8} text="8+ chars" />
              <Req met={/[A-Z]/.test(form.password)} text="Uppercase" />
              <Req met={/[0-9]/.test(form.password)} text="Number" />
              <Req met={/[^A-Za-z0-9]/.test(form.password)} text="Symbol" />
            </div>

            {errors.password && (
              <span className="field-error">
                <FiAlertCircle size={12} /> {errors.password}
              </span>
            )}
          </div>

          {/* confirm */}
          <div className={`form-group ${focused === "confirm" ? "focused" : ""} ${errors.confirm ? "has-error" : ""}`}>
            <label htmlFor="confirm">Confirm Password</label>
            <div className="input-wrap">
              <FiLock className="input-icon" size={17} />
              <input
                id="confirm"
                name="confirm"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={form.confirm}
                onChange={handleChange}
                onFocus={() => setFocused("confirm")}
                onBlur={() => setFocused("")}
              />
              <button
                type="button"
                className="toggle-pass"
                onClick={() => setShowConfirm((p) => !p)}
              >
                {showConfirm ? <FiEyeOff size={17} /> : <FiEye size={17} />}
              </button>
            </div>
            {errors.confirm && (
              <span className="field-error">
                <FiAlertCircle size={12} /> {errors.confirm}
              </span>
            )}
            {form.confirm && form.confirm === form.password && (
              <span className="field-success">
                <FiCheckCircle size={12} /> Passwords match
              </span>
            )}
          </div>

          <button
            type="submit"
            className={`btn-primary btn-block ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? (
              <span className="btn-spinner" />
            ) : (
              <>
                Create Account <FiArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </p>

        <p className="auth-terms">
          By signing up, you agree to our{" "}
          <span className="auth-link">Terms of Service</span> and{" "}
          <span className="auth-link">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
