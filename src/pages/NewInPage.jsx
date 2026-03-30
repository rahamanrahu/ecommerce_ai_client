import React, { useState, useEffect } from "react";
import { FiBell, FiBellOff, FiX, FiCheckCircle, FiClock, FiPackage, FiTrendingUp, FiStar, FiHeart, FiArrowRight, FiShoppingCart } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { MdNewReleases, MdLocalFireDepartment } from "react-icons/md";

const USD_TO_INR = 82;
const formatINR = (usd) => `₹${(usd * USD_TO_INR).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* ── NEW ARRIVALS DATA ──────────────────────────── */
const NEW_ITEMS = [
  { id:101, name:"Holo Gradient Watch",      category:"Accessories", price:245, emoji:"⌚", color:"#6366f1", image:"https://images.unsplash.com/photo-1579586337270-0aed1d4c7c04?auto=format&fit=crop&w=1000&q=80", daysAgo:1, rating:4.9, reviews:42,  isNew:true,  hot:true,  desc:"Holographic gradient dial, sapphire crystal glass, 5ATM water resistant. Swiss quartz movement. Comes in premium leather strap or stainless steel bracelet." },
  { id:102, name:"Neural Noise Cancelling Headphones", category:"Tech", price:299, emoji:"🎧", color:"#8b5cf6", image:"https://images.unsplash.com/photo-1518443169507-5568c9de0298?auto=format&fit=crop&w=1000&q=80", daysAgo:2, rating:4.8, reviews:87, isNew:true, hot:true, desc:"40-hour ANC headphones with spatial audio, bone-conduction mic, and aptX HD. Foldable, includes premium carry case and 3 ear cushion sizes." },
  { id:103, name:"Ceramic Pour-Over Set",    category:"Home",        price:82,  emoji:"☕", color:"#f59e0b", image:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=80", daysAgo:2, rating:4.7, reviews:23,  isNew:true,  hot:false, desc:"Handcrafted ceramic pour-over dripper and matching carafe. Matte glaze finish, holds 600ml. Includes 40 organic paper filters and a bamboo stand." },
  { id:104, name:"Arc Minimalist Backpack",  category:"Fashion",     price:165, emoji:"🎒", color:"#ec4899", image:"https://images.unsplash.com/photo-1600181952852-52f3c09f8bb4?auto=format&fit=crop&w=1000&q=80", daysAgo:3, rating:4.8, reviews:65,  isNew:true,  hot:true,  desc:"30L waterproof recycled nylon. Hidden back pocket, laptop sleeve to 16 inches, magnetic closures. TSA-friendly. Available in 5 colourways." },
  { id:105, name:"Foam Roller Pro",          category:"Fitness",     price:55,  emoji:"🏃", color:"#22c55e", image:"https://images.unsplash.com/photo-1571019613619-2a7f7e5c2b1a?auto=format&fit=crop&w=1000&q=80", daysAgo:3, rating:4.6, reviews:34,  isNew:true,  hot:false, desc:"High-density EVA foam with textured grid pattern for myofascial release. 33cm x 14cm. Supports up to 140kg. Includes online recovery guide." },
  { id:106, name:"Smart F Monitor",      category:"Home",        price:49,  emoji:"🪴", color:"#84cc16", image:"https://images.unsplash.com/photo-1595433707802-8f0ed6a9055c?auto=format&fit=crop&w=1000&q=80", daysAgo:4, rating:4.5, reviews:19,  isNew:true,  hot:false, desc:"Bluetooth soil sensor monitors moisture, light, nutrients, and temperature. App alerts when your plant needs water. Works with 6000+ plant species." },
  { id:107, name:"Gradient Desk Lamp",       category:"Home",        price:95,  emoji:"💡", color:"#06b6d4", image:"https://images.unsplash.com/photo-1523408283687-5a7349f2aa06?auto=format&fit=crop&w=1000&q=80", daysAgo:5, rating:4.7, reviews:51,  isNew:true,  hot:false, desc:"Touch-dimming LED desk lamp with USB-C charging pad base, 5 colour temperatures, and circadian rhythm mode. 50,000 hour lifespan." },
  { id:108, name:"Carbon Fibre Card Wallet", category:"Accessories", price:68,  emoji:"💳", color:"#374151", image:"https://images.unsplash.com/photo-1495111922310-9e0b42b72f94?auto=format&fit=crop&w=1000&q=80", daysAgo:5, rating:4.8, reviews:78,  isNew:true,  hot:true,  desc:"RFID-blocking carbon fibre wallet holds 6–12 cards plus cash. Spring-loaded card ejector. 0.6cm thin, 28g. Lifetime warranty." },
];

const UPCOMING = [
  { id:201, name:"AI Smart Ring",           releaseDate:"Dec 28",  emoji:"💍", color:"#6366f1", subscribers:2341, category:"Tech" },
  { id:202, name:"Self-Heating Mug 2.0",    releaseDate:"Jan 3",   emoji:"🫖", color:"#f59e0b", subscribers:1876, category:"Home" },
  { id:203, name:"Zero-G Sleep Mask",        releaseDate:"Jan 10",  emoji:"😴", color:"#8b5cf6", subscribers:3210, category:"Wellness" },
  { id:204, name:"Modular Sneaker System",  releaseDate:"Jan 15",  emoji:"👟", color:"#ec4899", subscribers:5432, category:"Fashion" },
];

/* ── NOTIFICATION MODAL ─────────────────────────── */
function NotificationModal({ item, onClose, subscribed, onToggle }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr("Please enter a valid email address."); return;
    }
    setErr("");
    setSubmitted(true);
    onToggle(item.id);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target.classList.contains("modal-overlay") && onClose()}>
      <div className="modal-card notif-modal animate-in" style={{ "--accent": item.color }}>
        <button className="modal-close" onClick={onClose}><FiX size={20} /></button>

        <div className="notif-modal-header">
          <div className="notif-item-emoji">{item.emoji}</div>
          <div className="notif-modal-meta">
            <span className="notif-modal-cat" style={{ color: item.color, background: item.color + "18" }}>{item.category}</span>
            <h2 className="notif-modal-title">{item.name}</h2>
            <p className="notif-modal-date"><FiClock size={13} /> Drops {item.releaseDate}</p>
          </div>
        </div>

        <div className="notif-modal-hype">
          <div className="hype-stat">
            <FiBell size={16} style={{ color: item.color }} />
            <span><strong style={{ color: item.color }}>{item.subscribers.toLocaleString()}</strong> people subscribed</span>
          </div>
          <div className="hype-bar">
            <div className="hype-fill" style={{ width: `${Math.min((item.subscribers / 6000) * 100, 100)}%`, background: item.color }} />
          </div>
          <p className="hype-note">Join the waitlist — subscribed users get 24h early access + 10% off launch price.</p>
        </div>

        {submitted || subscribed ? (
          <div className="notif-success-state">
            <FiCheckCircle size={40} style={{ color: "var(--success)" }} />
            <h3>You're on the list!</h3>
            <p>We'll notify you the moment <strong>{item.name}</strong> drops on {item.releaseDate}.</p>
            <button className="btn-primary" onClick={onClose}><FiArrowRight size={14} /> Done</button>
          </div>
        ) : (
          <form className="notif-form" onSubmit={handleSubmit} noValidate>
            <label>Notify me at:</label>
            <div className="notif-input-row">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setErr(""); }}
              />
              <button type="submit" className="btn-primary" style={{ background: item.color }}>
                <FiBell size={14} /> Notify Me
              </button>
            </div>
            {err && <span className="field-error">{err}</span>}
            <p className="notif-disclaimer">No spam. Unsubscribe any time.</p>
          </form>
        )}
      </div>
    </div>
  );
}

/* ── NEW ITEM CARD ──────────────────────────────── */
function NewItemCard({ item, onNotify, wishlist, onWishlist }) {
  const [hovered, setHovered] = useState(false);
  const wished = wishlist.includes(item.id);
  const daysText = item.daysAgo === 1 ? "Today" : item.daysAgo === 2 ? "Yesterday" : `${item.daysAgo}d ago`;

  return (
    <div
      className={`product-card new-item-card${hovered ? " hovered" : ""}`}
      style={{ "--accent": item.color }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="product-img-wrap">
        {item.image ? (
          <img className="product-image" src={item.image} alt={item.name} />
        ) : (
          <div className="product-emoji-display">{item.emoji}</div>
        )}
        <div className="new-item-arrival-badge">
          <MdNewReleases size={12} /> {daysText}
        </div>
        {item.hot && (
          <div className="new-item-hot-badge">
            <MdLocalFireDepartment size={12} /> Hot
          </div>
        )}
        <button className={`wishlist-btn${wished ? " wished" : ""}`} onClick={() => onWishlist(item.id)}>
          <FiHeart size={16} />
        </button>
      </div>

      <div className="product-info">
        <div className="product-category-tag" style={{ color: item.color, background: item.color + "18" }}>{item.category}</div>
        <h3 className="product-name">{item.name}</h3>
        <div className="product-rating">
          <div className="stars">
            {[1,2,3,4,5].map(s => (
              <FiStar key={s} size={12} fill={s <= Math.floor(item.rating) ? item.color : "none"} stroke={s <= Math.floor(item.rating) ? item.color : "var(--text-muted)"} />
            ))}
          </div>
          <span className="rating-score">{item.rating}</span>
          <span className="rating-count">({item.reviews})</span>
        </div>
        <p className="new-item-desc">{item.desc.substring(0, 90)}…</p>
        <div className="product-price-row">
          <span className="product-price">{formatINR(item.price)}</span>
          <span className="new-price-badge">New</span>
        </div>
      </div>

      <div className="product-card-footer">
        <button className="btn-add-cart">
          <FiShoppingCart size={14} /> Add to Cart
        </button>
      </div>
    </div>
  );
}

/* ── UPCOMING CARD ──────────────────────────────── */
function UpcomingCard({ item, subscribed, onNotify }) {
  return (
    <div className="upcoming-card" style={{ "--accent": item.color }}>
      <div className="upcoming-emoji">{item.emoji}</div>
      <div className="upcoming-info">
        <span className="upcoming-cat" style={{ color: item.color }}>{item.category}</span>
        <h3>{item.name}</h3>
        <div className="upcoming-meta">
          <span><FiClock size={12} /> {item.releaseDate}</span>
          <span><FiBell size={12} /> {item.subscribers.toLocaleString()} waiting</span>
        </div>
      </div>
      <button
        className={`btn-notify${subscribed ? " subscribed" : ""}`}
        style={subscribed ? { color: item.color, borderColor: item.color } : {}}
        onClick={() => onNotify(item)}
      >
        {subscribed ? <><FiCheckCircle size={14} /> Subscribed</> : <><FiBell size={14} /> Notify Me</>}
      </button>
    </div>
  );
}

/* ── MAIN PAGE ─────────────────────────────────── */
export default function NewInPage() {
  const [notifItem, setNotifItem] = useState(null);
  const [subscribed, setSubscribed] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  const toggleSubscribe = (id) =>
    setSubscribed(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleWishlist = (id) =>
    setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);

  return (
    <div className={`newin-page${mounted ? " page-mounted" : ""}`}>
      {/* hero */}
      <div className="page-hero newin-hero">
        <div className="page-hero-orb orb-a" style={{ background: "radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 70%)" }} />
        <div className="page-hero-orb orb-b" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)" }} />
        <div className="page-hero-content">
          <span className="hero-eyebrow"><MdNewReleases size={14} /> Fresh Drops</span>
          <h1>New In</h1>
          <p>Just arrived — the latest additions to our collection</p>
        </div>
      </div>

      {/* stats bar */}
      <div className="newin-stats-bar">
        <div className="newin-stat"><FiPackage size={18} style={{ color: "#6366f1" }} /><span><strong>{NEW_ITEMS.length}</strong> new arrivals this week</span></div>
        <div className="newin-stat"><FiBell size={18} style={{ color: "#ec4899" }} /><span><strong>{UPCOMING.length}</strong> drops coming soon</span></div>
        <div className="newin-stat"><FiTrendingUp size={18} style={{ color: "#22c55e" }} /><span><strong>12,400+</strong> products sold this month</span></div>
      </div>

      {/* new arrivals grid */}
      <section className="newin-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-heading"><HiSparkles size={18} style={{ color: "#f59e0b" }} /> Latest Arrivals</h2>
            <p className="section-sub">Added in the last 7 days</p>
          </div>
        </div>
        <div className="products-grid">
          {NEW_ITEMS.map((item, i) => (
            <div key={item.id} className="product-animate-wrap" style={{ animationDelay: `${i * 70}ms` }}>
              <NewItemCard item={item} onNotify={setNotifItem} wishlist={wishlist} onWishlist={toggleWishlist} />
            </div>
          ))}
        </div>
      </section>

      {/* coming soon */}
      <section className="newin-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-heading"><FiBell size={18} style={{ color: "#6366f1" }} /> Coming Soon</h2>
            <p className="section-sub">Subscribe to get early access + launch discounts</p>
          </div>
        </div>
        <div className="upcoming-grid">
          {UPCOMING.map((item, i) => (
            <div key={item.id} className="product-animate-wrap" style={{ animationDelay: `${i * 80}ms` }}>
              <UpcomingCard item={item} subscribed={subscribed.includes(item.id)} onNotify={setNotifItem} />
            </div>
          ))}
        </div>
      </section>

      {/* notification modal */}
      {notifItem && (
        <NotificationModal
          item={notifItem}
          onClose={() => setNotifItem(null)}
          subscribed={subscribed.includes(notifItem.id)}
          onToggle={toggleSubscribe}
        />
      )}
    </div>
  );
}
