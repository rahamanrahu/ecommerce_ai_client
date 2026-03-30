import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../App";
import {
  FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle,
  FiArrowRight, FiArrowLeft
} from "react-icons/fi";
import { MdRocketLaunch } from "react-icons/md";
import { HiSparkles } from "react-icons/hi2";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address.";
    if (!form.password) e.password = "Password is required.";
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
    try {
      const result = await login({ email: form.email, password: form.password });
      if (result.success) {
        navigate("/", { replace: true });
      } else {
        setApiError(result.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      setApiError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* background orbs */}
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />

      {/* back nav */}
      <button className="auth-back-btn" onClick={() => navigate("/")}>
        <FiArrowLeft size={16} /> Back to Home
      </button>

      <div className="auth-card">
        {/* brand */}
        <div className="auth-brand">
          <div className="auth-logo">
            <MdRocketLaunch size={22} />
          </div>
          <span>Nexus</span>
        </div>

        <div className="auth-header">
          <h1>Welcome back</h1>
          <p>Sign in to continue to your dashboard</p>
        </div>

        {/* global api error */}
        {apiError && (
          <div className="alert-error">
            <FiAlertCircle size={16} />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
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
            <div className="label-row">
              <label htmlFor="password">Password</label>
              <span className="forgot-link">Forgot password?</span>
            </div>
            <div className="input-wrap">
              <FiLock className="input-icon" size={17} />
              <input
                id="password"
                name="password"
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused("")}
              />
              <button
                type="button"
                className="toggle-pass"
                onClick={() => setShowPass((p) => !p)}
                aria-label="Toggle password"
              >
                {showPass ? <FiEyeOff size={17} /> : <FiEye size={17} />}
              </button>
            </div>
            {errors.password && (
              <span className="field-error">
                <FiAlertCircle size={12} /> {errors.password}
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
                Sign In <FiArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div className="auth-demo-box">
          <HiSparkles size={14} />
          <span>No account? Try demo credentials or&nbsp;</span>
          <Link to="/signup" className="auth-link">create one free</Link>
        </div>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/signup" className="auth-link">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}
