import React, { createContext, useContext, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate, Link } from "react-router-dom";
import { FiSun, FiMoon, FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { MdRocketLaunch } from "react-icons/md";
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

const DB_KEY = "nexus_users_db";
const SESSION_KEY = "nexus_session";

const mockApi = {
  getUsers: () => { try { return JSON.parse(localStorage.getItem(DB_KEY)) || []; } catch { return []; } },
  saveUsers: (u) => localStorage.setItem(DB_KEY, JSON.stringify(u)),
  register: ({ name, email, password }) => {
    const users = mockApi.getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase()))
      return { success: false, message: "An account with this email already exists." };
    const newUser = {
      id: `usr_${Date.now()}`, name, email: email.toLowerCase(), password,
      createdAt: new Date().toISOString(),
      stats: { projects: Math.floor(Math.random()*12)+1, tasks: Math.floor(Math.random()*60)+10, teamMembers: Math.floor(Math.random()*8)+2, completionRate: Math.floor(Math.random()*40)+60 },
    };
    users.push(newUser); mockApi.saveUsers(users);
    return { success: true, user: newUser };
  },
  login: ({ email, password }) => {
    const users = mockApi.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return { success: false, message: "No account found with this email." };
    if (user.password !== password) return { success: false, message: "Incorrect password. Please try again." };
    return { success: true, user };
  },
  saveSession: (u) => localStorage.setItem(SESSION_KEY, JSON.stringify(u)),
  getSession: () => { try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; } },
  clearSession: () => localStorage.removeItem(SESSION_KEY),
};

const GuestRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/" replace /> : children;
};

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { const s = mockApi.getSession(); if (s) setCurrentUser(s); setLoading(false); }, []);
  const login = (c) => { const r = mockApi.login(c); if (r.success) { mockApi.saveSession(r.user); setCurrentUser(r.user); } return r; };
  const register = (d) => { const r = mockApi.register(d); if (r.success) { mockApi.saveSession(r.user); setCurrentUser(r.user); } return r; };
  const logout = () => { mockApi.clearSession(); setCurrentUser(null); };
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
