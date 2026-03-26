import React, { useState, useEffect } from "react";
import { FiTag, FiClock, FiZap, FiShoppingCart, FiHeart, FiStar, FiPercent, FiAlertCircle } from "react-icons/fi";
import { MdLocalFireDepartment, MdFlashOn } from "react-icons/md";
import { HiSparkles } from "react-icons/hi2";

/* ── SALE PRODUCTS ──────────────────────────────── */
const SALE_PRODUCTS = [
  { id:301, name:"4K Gaming Monitor 27\"",    category:"Tech",    price:299, originalPrice:549, emoji:"🖥️", color:"#6366f1", rating:4.8, reviews:1234, stock:3,  hoursLeft:4,  badge:"Flash Sale",   desc:"IPS panel, 144Hz, 1ms response time, G-Sync compatible. USB-C 65W charging, 4 HDMI ports. Factory calibrated." },
  { id:302, name:"Leather Chelsea Boots",     category:"Fashion", price:89,  originalPrice:210, emoji:"👢", color:"#f59e0b", rating:4.7, reviews:876,  stock:7,  hoursLeft:18, badge:"Weekend Deal",  desc:"Full-grain calfskin leather, YKK zip, leather insole. Goodyear-welted sole. Handmade in Spain. Lasts decades with care." },
  { id:303, name:"Air Purifier HEPA H13",     category:"Home",    price:129, originalPrice:249, emoji:"🌬️", color:"#22c55e", rating:4.9, reviews:2341, stock:12, hoursLeft:36, badge:"Best Deal",     desc:"H13 True HEPA + activated carbon filter. Cleans 50m² in 12 min. CADR 350 m³/h. Whisper-quiet at 25dB. PM2.5 sensor." },
  { id:304, name:"Bamboo Cutting Board Set",  category:"Home",    price:38,  originalPrice:75,  emoji:"🪵", color:"#84cc16", rating:4.6, reviews:543,  stock:22, hoursLeft:48, badge:"Clearance",    desc:"3-piece FSC bamboo set (S/M/L) with juice grooves, anti-slip feet, and hanging holes. Dishwasher safe. Naturally antimicrobial." },
  { id:305, name:"Wireless Charging Pad 3-in-1", category:"Tech", price:55, originalPrice:110, emoji:"⚡", color:"#3b82f6", rating:4.7, reviews:987,  stock:8,  hoursLeft:12, badge:"Flash Sale",   desc:"Simultaneously charges phone (15W MagSafe), AirPods, and Apple Watch. LED indicator, anti-slip base, includes 45W adapter." },
  { id:306, name:"Merino Wool Crew Sweater",  category:"Fashion", price:65,  originalPrice:145, emoji:"🧶", color:"#8b5cf6", rating:4.8, reviews:432,  stock:15, hoursLeft:48, badge:"Season Sale",  desc:"100% extra-fine Merino wool, 18.5 micron. Temperature regulating, itch-free. Ethically sourced from New Zealand farms. Machine washable." },
  { id:307, name:"Protein Shaker Pro Bundle", category:"Fitness", price:28,  originalPrice:55,  emoji:"🥤", color:"#ef4444", rating:4.5, reviews:2109, stock:50, hoursLeft:72, badge:"Bundle Deal",  desc:"700ml Tritan shaker with BlenderBall, 3 storage compartments, leak-proof lid. Includes 2 replacement lids and bonus resistance band." },
  { id:308, name:"Espresso Machine Nano",     category:"Home",    price:165, originalPrice:320, emoji:"☕", color:"#f97316", rating:4.9, reviews:1543, stock:4,  hoursLeft:6,  badge:"Flash Sale",   desc:"15-bar pressure, 20g portafilter, steam wand, 1.2L tank. 25-second heat-up. Compact 15cm width. Makes café-quality espresso at home." },
];

/* ── COUNTDOWN TIMER ────────────────────────────── */
function CountdownTimer({ hoursLeft, color }) {
  const totalSec = hoursLeft * 3600;
  const [remaining, setRemaining] = useState(totalSec);

  useEffect(() => {
    const id = setInterval(() => setRemaining(r => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;
  const pad = (n) => String(n).padStart(2, "0");
  const isUrgent = hoursLeft <= 6;

  return (
    <div className={`countdown-timer${isUrgent ? " urgent" : ""}`} style={{ "--accent": color }}>
      <FiClock size={12} />
      <div className="countdown-blocks">
        <span className="cd-block"><span className="cd-num">{pad(h)}</span><span className="cd-unit">h</span></span>
        <span className="cd-sep">:</span>
        <span className="cd-block"><span className="cd-num">{pad(m)}</span><span className="cd-unit">m</span></span>
        <span className="cd-sep">:</span>
        <span className="cd-block"><span className="cd-num">{pad(s)}</span><span className="cd-unit">s</span></span>
      </div>
    </div>
  );
}

/* ── SALE CARD ──────────────────────────────────── */
function SaleCard({ product, wishlist, onWishlist, featured }) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const wished = wishlist.includes(product.id);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const isLowStock = product.stock <= 5;
  const isFlash = product.hoursLeft <= 12;

  const handleAdd = (e) => {
    e.stopPropagation();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div
      className={`product-card sale-card${hovered ? " hovered" : ""}${featured ? " sale-featured" : ""}`}
      style={{ "--accent": product.color }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="product-img-wrap">
        <div className="product-emoji-display">{product.emoji}</div>
        <div className="sale-discount-ribbon" style={{ background: isFlash ? "#ef4444" : product.color }}>
          <FiPercent size={11} />{discount}%
        </div>
        {product.badge && (
          <span className="product-badge sale-badge" style={{ background: isFlash ? "#ef4444" : product.color }}>
            {isFlash && <MdLocalFireDepartment size={11} />} {product.badge}
          </span>
        )}
        <button className={`wishlist-btn${wished ? " wished" : ""}`} onClick={() => onWishlist(product.id)}>
          <FiHeart size={16} />
        </button>
      </div>

      <div className="product-info">
        <div className="product-category-tag" style={{ color: product.color, background: product.color + "18" }}>{product.category}</div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc-mini">{product.desc.substring(0, 80)}…</p>

        <div className="product-rating">
          <div className="stars">
            {[1,2,3,4,5].map(s => (
              <FiStar key={s} size={12} fill={s <= Math.floor(product.rating) ? product.color : "none"} stroke={s <= Math.floor(product.rating) ? product.color : "var(--text-muted)"} />
            ))}
          </div>
          <span className="rating-score">{product.rating}</span>
          <span className="rating-count">({product.reviews.toLocaleString()})</span>
        </div>

        <div className="product-price-row">
          <span className="product-price sale-price" style={{ color: product.color }}>${product.price}</span>
          <span className="product-original">${product.originalPrice}</span>
          <span className="save-tag">Save ${product.originalPrice - product.price}</span>
        </div>

        <CountdownTimer hoursLeft={product.hoursLeft} color={product.color} />

        {isLowStock && (
          <div className="low-stock-warn">
            <FiAlertCircle size={12} /> Only {product.stock} left in stock
          </div>
        )}
      </div>

      <div className="product-card-footer">
        <button
          className={`btn-add-cart${added ? " added-success" : ""}`}
          style={added ? { background: "var(--success)" } : {}}
          onClick={handleAdd}
        >
          {added ? <><FiShoppingCart size={14} /> Added!</> : <><FiShoppingCart size={14} /> Add to Cart</>}
        </button>
      </div>
    </div>
  );
}

/* ── MAIN PAGE ─────────────────────────────────── */
export default function SalePage() {
  const [wishlist, setWishlist] = useState([]);
  const [filter, setFilter] = useState("All");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  const toggleWishlist = (id) =>
    setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);

  const categories = ["All", ...new Set(SALE_PRODUCTS.map(p => p.category))];

  const filtered = SALE_PRODUCTS.filter(p => filter === "All" || p.category === filter);
  const flashDeals = SALE_PRODUCTS.filter(p => p.hoursLeft <= 12);
  const maxSave = Math.max(...SALE_PRODUCTS.map(p => p.originalPrice - p.price));

  return (
    <div className={`sale-page${mounted ? " page-mounted" : ""}`}>
      {/* hero */}
      <div className="page-hero sale-hero">
        <div className="page-hero-orb orb-a" style={{ background: "radial-gradient(circle, rgba(239,68,68,0.2) 0%, transparent 70%)" }} />
        <div className="page-hero-orb orb-b" style={{ background: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)" }} />
        <div className="page-hero-content">
          <span className="hero-eyebrow sale-eyebrow"><MdLocalFireDepartment size={14} /> Limited Time Offers</span>
          <h1 className="sale-hero-title">Mega Sale <span className="gradient-text-red">Event</span></h1>
          <p>Up to <strong style={{ color: "#ef4444", fontSize: "1.2em" }}>50% off</strong> — save up to ${maxSave} on premium products</p>
        </div>
      </div>

      {/* flash deals banner */}
      {flashDeals.length > 0 && (
        <div className="flash-deals-banner">
          <div className="flash-inner">
            <span className="flash-label"><MdFlashOn size={16} /> Flash Deals — Ending Soon</span>
            <div className="flash-tags">
              {flashDeals.map(p => (
                <span key={p.id} className="flash-tag">
                  {p.emoji} {p.name} — <strong style={{ color: "#ef4444" }}>${p.price}</strong>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* overall stats */}
      <div className="sale-stats-bar">
        {[
          { icon: FiTag, label: `${SALE_PRODUCTS.length} deals active`, color: "#6366f1" },
          { icon: MdLocalFireDepartment, label: `${flashDeals.length} flash sales ending soon`, color: "#ef4444" },
          { icon: FiZap, label: `Up to 50% discount`, color: "#f59e0b" },
          { icon: FiClock, label: "Limited time only", color: "#22c55e" },
        ].map(({ icon: Icon, label, color }) => (
          <div className="newin-stat" key={label}>
            <Icon size={18} style={{ color }} /><span>{label}</span>
          </div>
        ))}
      </div>

      {/* category filter */}
      <div className="sale-filter-bar">
        <div className="category-chips">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-chip${filter === cat ? " active" : ""}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* products */}
      <section className="sale-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-heading"><FiTag size={18} /> All Sale Items</h2>
            <p className="section-sub">{filtered.length} deals — prices drop when the timer hits zero</p>
          </div>
        </div>
        <div className="products-grid">
          {filtered.map((product, i) => (
            <div key={product.id} className="product-animate-wrap" style={{ animationDelay: `${i * 70}ms` }}>
              <SaleCard product={product} wishlist={wishlist} onWishlist={toggleWishlist} />
            </div>
          ))}
        </div>
      </section>

      {/* sale ends cta */}
      <div className="sale-cta-banner">
        <HiSparkles size={20} style={{ color: "#f59e0b" }} />
        <div>
          <h3>Don't miss out — sale ends Sunday midnight</h3>
          <p>All prices revert to original after the event. No code needed — discount applied at checkout.</p>
        </div>
        <MdLocalFireDepartment size={20} style={{ color: "#ef4444" }} />
      </div>
    </div>
  );
}
