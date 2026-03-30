import React, { createContext, useContext, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate, Link } from "react-router-dom";
import { FiSun, FiMoon, FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { MdRocketLaunch } from "react-icons/md";
import axios from "axios";
import API_BASE_URL, { API_ENDPOINTS } from "./api";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CollectionsPage from "./pages/CollectionsPage";
import NewInPage from "./pages/NewInPage";
import SalePage from "./pages/SalePage";
import AboutPage from "./pages/AboutPage";
import "./App.css";

/* ── THEME CONTEXT ─────────────────────────────────── */
export const ThemeContext = createContext(null);
export const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem("nexus_theme") || "dark");
  const toggleTheme = () =>
    setTheme(t => { const n = t === "dark" ? "light" : "dark"; localStorage.setItem("nexus_theme", n); return n; });
  useEffect(() => { document.documentElement.setAttribute("data-theme", theme); }, [theme]);
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

/* ── AUTH CONTEXT ──────────────────────────────────── */
export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const SESSION_KEY = "nexus_session";
const TOKEN_KEY = "nexus_token";

const api = {
  login: async ({ email, password }) => {
    try {
      console.log('Making login request to:', `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`);
      console.log('Request body:', { email, password });

      const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
        email,
        password
      });

      console.log('Login response:', response.data);

      return {
        success: true,
        user: response.data.data.user,
        token: response.data.data.token
      };
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);

      const message = error.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, message };
    }
  },
  saveSession: (user, token) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, token);
  },
  getSession: () => {
    try {
      const user = JSON.parse(localStorage.getItem(SESSION_KEY));
      const token = localStorage.getItem(TOKEN_KEY);
      return user && token ? { user, token } : null;
    } catch {
      return null;
    }
  },
  clearSession: () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
  },
};

const GuestRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/" replace /> : children;
};

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const s = api.getSession();
    if (s) {
      setCurrentUser(s.user);
      // Set axios default header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${s.token}`;
    }
    setLoading(false);
  }, []);
  const login = async (c) => {
    const r = await api.login(c);
    if (r.success) {
      api.saveSession(r.user, r.token);
      setCurrentUser(r.user);
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${r.token}`;
    }
    return r;
  };
  const register = async (d) => {
    // TODO: Implement register API call
    return { success: false, message: "Registration not implemented yet" };
  };
  const logout = () => { api.clearSession(); setCurrentUser(null); delete axios.defaults.headers.common['Authorization']; };
  if (loading) return <div className="app-loader"><div className="loader-ring" /></div>;
  return <AuthContext.Provider value={{ currentUser, login, logout, register }}>{children}</AuthContext.Provider>;
};

/* ── GLOBAL NAVBAR ─────────────────────────────────── */
function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => setMenuOpen(false), [location.pathname]);

  const links = [
    { to: "/", label: "Home" },
    { to: "/collections", label: "Collections" },
    { to: "/new-in", label: "New In" },
    { to: "/sale", label: "Sale", badge: "HOT" },
    { to: "/about", label: "About" },
  ];

  return (
    <nav className={`global-nav${scrolled ? " nav-scrolled" : ""}`}>
      <div className="nav-inner">
        <Link to="/" className="nav-brand-link">
          <MdRocketLaunch size={20} /><span>Nexus</span>
        </Link>
        <div className={`nav-center-links${menuOpen ? " mobile-open" : ""}`}>
          {links.map(({ to, label, badge }) => (
            <Link key={to} to={to} className={`nav-link${location.pathname === to ? " active" : ""}`}>
              {label}{badge && <span className="nav-badge">{badge}</span>}
            </Link>
          ))}
        </div>
        <div className="nav-right">
          <button className="nav-icon-btn" onClick={toggleTheme} title="Toggle theme">
            {theme === "dark" ? <FiSun size={17} /> : <FiMoon size={17} />}
          </button>
          {currentUser ? (
            <>
              <div className="nav-avatar" title={currentUser.name}>{currentUser.name.charAt(0).toUpperCase()}</div>
              <button className="nav-icon-btn" onClick={() => { logout(); navigate("/"); }} title="Log out">
                <FiLogOut size={17} />
              </button>
            </>
          ) : (
            <>
              <button className="btn-ghost nav-auth-btn" onClick={() => navigate("/login")}>Sign In</button>
              <button className="btn-primary nav-auth-btn" onClick={() => navigate("/signup")}>Sign Up</button>
            </>
          )}
          <button className="nav-icon-btn mobile-menu-btn" onClick={() => setMenuOpen(p => !p)}>
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
}

function PageWrapper({ children, noNav }) {
  return (
    <div className="page-wrapper">
      {!noNav && <Navbar />}
      <div className="page-content">{children}</div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
            <Route path="/collections" element={<PageWrapper><CollectionsPage /></PageWrapper>} />
            <Route path="/new-in" element={<PageWrapper><NewInPage /></PageWrapper>} />
            <Route path="/sale" element={<PageWrapper><SalePage /></PageWrapper>} />
            <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
            <Route path="/login" element={<GuestRoute><PageWrapper noNav><LoginPage /></PageWrapper></GuestRoute>} />
            <Route path="/signup" element={<GuestRoute><PageWrapper noNav><SignupPage /></PageWrapper></GuestRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
