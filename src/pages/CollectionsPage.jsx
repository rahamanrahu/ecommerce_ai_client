import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiStar, FiHeart, FiShoppingCart, FiX, FiTag, FiEye, FiChevronDown } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

const USD_TO_INR = 82;
const formatINR = (usd) => `₹${(usd * USD_TO_INR).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* ── PRODUCTS DATA ──────────────────────────────── */
const PRODUCTS = [
  // Tech
  { id:1, name:"ProMax Wireless Earbuds",    category:"Tech",      price:89,  originalPrice:129, rating:4.8, reviews:2341, badge:"Best Seller", color:"#6366f1", emoji:"🎧", image:"https://images.unsplash.com/photo-1611370981504-00cd0a0d457b?auto=format&fit=crop&w=1000&q=80", desc:"Premium sound with 40h battery life, active noise cancellation, and IPX5 water resistance. Crystal clear calls with dual-mic setup. Available in Midnight Black and Arctic White.", tags:["Wireless","ANC","Waterproof"] },
  { id:2, name:"UltraSlim Laptop Stand",     category:"Tech",      price:49,  originalPrice:65,  rating:4.6, reviews:876,  badge:"Popular",     color:"#3b82f6", emoji:"💻", image:"https://images.unsplash.com/photo-1596495577886-d920f86984c9?auto=format&fit=crop&w=1000&q=80", desc:"Aircraft-grade aluminium stand compatible with all laptops 10–17 inches. Adjustable 6 angles, foldable for travel, improves airflow and reduces neck strain by 60%.", tags:["Ergonomic","Aluminum","Foldable"] },
  { id:3, name:"SmartCharge 20K Power Bank", category:"Tech",      price:65,  originalPrice:80,  rating:4.7, reviews:1543, badge:null,           color:"#0ea5e9", emoji:"🔋", image:"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1000&q=80", desc:"20,000mAh fast-charge power bank with USB-C PD 65W, 2× USB-A 18W, and LED display. Charges your laptop, phone, and tablet simultaneously.", tags:["65W PD","Display","Dual USB"] },
  { id:4, name:"MechKeyboard Pro RGB",       category:"Tech",      price:149, originalPrice:199, rating:4.9, reviews:3201, badge:"Top Rated",    color:"#8b5cf6", emoji:"⌨️", image:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80", desc:"Tenkeyless mechanical keyboard with hot-swappable switches, per-key RGB, PBT double-shot keycaps, and USB-C detachable cable. Tactile satisfying clicks.", tags:["Hot-swap","RGB","PBT Keys"] },
  { id:5, name:"4K Webcam Ultra HD",         category:"Tech",      price:119, originalPrice:159, rating:4.5, reviews:654,  badge:null,           color:"#06b6d4", emoji:"📷", image:"https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=1000&q=80", desc:"Sony sensor 4K webcam with auto-focus, HDR, stereo microphones, and privacy shutter. Plug-and-play on Windows, Mac, and Linux.", tags:["4K","Autofocus","HDR"] },
  // Fashion
  { id:6, name:"Minimalist Tote Bag",        category:"Fashion",   price:75,  originalPrice:95,  rating:4.7, reviews:1102, badge:"Trending",    color:"#f59e0b", emoji:"👜", image:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80", desc:"Full-grain leather tote with canvas lining, 3 inner pockets, and detachable zip pouch. Fits a 15-inch laptop. Handcrafted with ethically sourced materials.", tags:["Leather","Sustainable","Laptop Fit"] },
  { id:7, name:"Premium Sneakers OG",        category:"Fashion",   price:185, originalPrice:220, rating:4.8, reviews:4320, badge:"Iconic",       color:"#ec4899", emoji:"👟", image:"https://images.unsplash.com/photo-1528701800485-5c5a65a35edc?auto=format&fit=crop&w=1000&q=80", desc:"Retro-inspired silhouette with cloud-foam insole, breathable mesh upper, and vulcanized rubber sole. Limited colorways drop monthly. Sizes 36–47.", tags:["Cloud-Foam","Mesh","Limited"] },
  { id:8, name:"Oversized Hoodie Classic",   category:"Fashion",   price:68,  originalPrice:85,  rating:4.6, reviews:2876, badge:null,           color:"#6366f1", emoji:"🧥", image:"https://images.unsplash.com/photo-1520975911563-1f8ca0e920c2?auto=format&fit=crop&w=1000&q=80", desc:"400gsm heavyweight fleece, pre-shrunk, double-stitched hems. Available in 8 colourways. Ethically manufactured in Portugal. Machine washable.", tags:["400gsm","Fleece","Ethical"] },
  { id:9, name:"Silk Scarf Collection",      category:"Fashion",   price:55,  originalPrice:70,  rating:4.5, reviews:432,  badge:null,           color:"#a855f7", emoji:"🧣", image:"https://images.unsplash.com/photo-1571387687255-730f9867b8d6?auto=format&fit=crop&w=1000&q=80", desc:"100% mulberry silk, hand-rolled edges, printed with original artwork by independent artists. 90×90 cm. Includes branded gift box.", tags:["Silk","Artisan","Gift Box"] },
  // Home
  { id:10, name:"Aroma Diffuser Luna",       category:"Home",      price:45,  originalPrice:60,  rating:4.8, reviews:1876, badge:"Loved",        color:"#22c55e", emoji:"🕯️", image:"https://images.unsplash.com/photo-1542089363-1b14c3d9f2fb?auto=format&fit=crop&w=1000&q=80", desc:"Ultrasonic mist diffuser with 7-colour ambient light, 500ml tank, whisper-quiet operation, and 8-hour timer. Includes 3 essential oil samples.", tags:["Ultrasonic","7-Color","8hr Timer"] },
  { id:11, name:"Modular Shelf System",      category:"Home",      price:220, originalPrice:280, rating:4.7, reviews:543,  badge:"New",          color:"#84cc16", emoji:"🪴", image:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80", desc:"Tool-free modular shelving, 9 interchangeable panels, 60kg max load. Walnut veneer finish, FSC certified wood. Ships flat, assembles in 20 minutes.", tags:["Modular","FSC Wood","No Tools"] },
  { id:12, name:"Weighted Blanket 8kg",      category:"Home",      price:89,  originalPrice:115, rating:4.9, reviews:2104, badge:"Top Rated",    color:"#14b8a6", emoji:"🛏️", image:"https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?auto=format&fit=crop&w=1000&q=80", desc:"Glass-bead filled 8kg weighted blanket proven to reduce anxiety. Breathable cotton cover, removable and machine washable. Available in 4 calming colours.", tags:["Glass Beads","Cotton","Washable"] },
  // Fitness
  { id:13, name:"Smart Yoga Mat Pro",        category:"Fitness",   price:95,  originalPrice:120, rating:4.6, reviews:987,  badge:null,           color:"#f97316", emoji:"🧘", image:"https://images.unsplash.com/photo-1599020610209-1e7f34a7f9d0?auto=format&fit=crop&w=1000&q=80", desc:"6mm thick TPE foam with alignment guides and body position zones. Anti-slip on both sides. Comes with carrying strap and QR code linking to 50 guided sessions.", tags:["TPE","Alignment","Anti-slip"] },
  { id:14, name:"Adjustable Dumbbell Set",   category:"Fitness",   price:320, originalPrice:450, rating:4.8, reviews:3421, badge:"Best Buy",     color:"#ef4444", emoji:"🏋️", image:"https://images.unsplash.com/photo-1594737625785-8361d311ec73?auto=format&fit=crop&w=1000&q=80", desc:"Single handle adjusts from 5–52.5 lbs in 2.5 lb increments. Replaces 15 separate dumbbells. Weight selector dial, durable urethane coating, included tray.", tags:["Adjustable","Space-Saving","52.5lbs"] },
  { id:15, name:"Resistance Band Kit",       category:"Fitness",   price:35,  originalPrice:45,  rating:4.5, reviews:2341, badge:null,           color:"#fb923c", emoji:"💪", image:"https://images.unsplash.com/photo-1594737625918-170352e8fad5?auto=format&fit=crop&w=1000&q=80", desc:"5-band progressive resistance set (10–50 lbs), fabric covered, anti-snap latex. Includes door anchor, handles, ankle straps, and carry bag. Workout guide included.", tags:["5 Bands","Anti-snap","Full Kit"] },
  // Books
  { id:16, name:"The Design Thinker",        category:"Books",     price:28,  originalPrice:35,  rating:4.9, reviews:1234, badge:"Must Read",    color:"#6366f1", emoji:"📖", image:"https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1000&q=80", desc:"Award-winning guide to human-centered design by global IDEO principals. 320 pages of frameworks, case studies from Apple, Airbnb, and IDEO. Hardcover, illustrated.", tags:["Hardcover","Illustrated","Award-Win"] },
  { id:17, name:"Atomic Focus Journal",      category:"Books",     price:22,  originalPrice:28,  rating:4.7, reviews:876,  badge:null,           color:"#8b5cf6", emoji:"📓", image:"https://images.unsplash.com/photo-1517260911678-6fdaa3eadf6e?auto=format&fit=crop&w=1000&q=80", desc:"200-page guided productivity journal with habit trackers, weekly reviews, and gratitude prompts. Lay-flat binding, dotted grid, 100gsm acid-free paper.", tags:["Dotted Grid","Lay-flat","100gsm"] },
  { id:18, name:"Zero to One Masterclass",   category:"Books",     price:18,  originalPrice:24,  rating:4.8, reviews:5432, badge:"Bestseller",   color:"#0ea5e9", image:"https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1000&q=80", emoji:"🚀", desc:"Peter Thiel's seminal startup bible. Notes on startups, or how to build the future. Updated 10th anniversary edition with a new foreword and exclusive case studies.", tags:["Startup","10th Edition","Classic"] },
];

const CATEGORIES = ["All", "Tech", "Fashion", "Home", "Fitness", "Books"];

const SORT_OPTIONS = [
  { value: "featured",    label: "Featured" },
  { value: "price-asc",  label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating",     label: "Top Rated" },
  { value: "newest",     label: "Newest" },
];

/* ── PRODUCT CARD ──────────────────────────────── */
function ProductCard({ product, onSelect, wishlist, onWishlist }) {
  const [hovered, setHovered] = useState(false);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const wished = wishlist.includes(product.id);

  return (
    <div
      className={`product-card${hovered ? " hovered" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ "--accent": product.color }}
    >
      {/* image area */}
      <div className="product-img-wrap">
        {product.image ? (
          <img className="product-image" src={product.image} alt={product.name} />
        ) : (
          <div className="product-emoji-display">{product.emoji}</div>
        )}
        <div className="product-img-overlay">
          <button className="pcard-action-btn" onClick={() => onSelect(product)}>
            <FiEye size={16} /> Quick View
          </button>
        </div>
        {product.badge && <span className="product-badge">{product.badge}</span>}
        {discount > 0 && <span className="product-discount">-{discount}%</span>}
        <button
          className={`wishlist-btn${wished ? " wished" : ""}`}
          onClick={(e) => { e.stopPropagation(); onWishlist(product.id); }}
        >
          <FiHeart size={16} />
        </button>
      </div>

      {/* info */}
      <div className="product-info">
        <div className="product-category-tag" style={{ color: product.color, background: product.color + "18" }}>
          {product.category}
        </div>
        <h3 className="product-name">{product.name}</h3>
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
          <span className="product-price">{formatINR(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="product-original">{formatINR(product.originalPrice)}</span>
          )}
        </div>
        <div className="product-tags-mini">
          {product.tags.slice(0,2).map(t => <span key={t} className="mini-tag">{t}</span>)}
        </div>
      </div>

      <div className="product-card-footer">
        <button className="btn-add-cart" onClick={() => onSelect(product)}>
          <FiShoppingCart size={14} /> Add to Cart
        </button>
      </div>
    </div>
  );
}

/* ── PRODUCT MODAL ─────────────────────────────── */
function ProductModal({ product, onClose, wishlist, onWishlist }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const overlayRef = useRef();
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const wished = wishlist.includes(product.id);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={e => e.target === overlayRef.current && onClose()}>
      <div className="modal-card product-modal animate-in" style={{ "--accent": product.color }}>
        <button className="modal-close" onClick={onClose}><FiX size={20} /></button>

        <div className="modal-layout">
          {/* left: image */}
          <div className="modal-img-side">
            {product.image ? (
              <img className="modal-image" src={product.image} alt={product.name} />
            ) : (
              <div className="modal-emoji-display">{product.emoji}</div>
            )}
            <div className="modal-img-badges">
              {product.badge && <span className="product-badge">{product.badge}</span>}
              {discount > 0 && <span className="product-discount">-{discount}%</span>}
            </div>
          </div>

          {/* right: details */}
          <div className="modal-detail-side">
            <div className="product-category-tag mb-8" style={{ color: product.color, background: product.color + "18" }}>
              {product.category}
            </div>
            <h2 className="modal-title">{product.name}</h2>

            <div className="product-rating mb-12">
              <div className="stars">
                {[1,2,3,4,5].map(s => (
                  <FiStar key={s} size={14} fill={s <= Math.floor(product.rating) ? product.color : "none"} stroke={s <= Math.floor(product.rating) ? product.color : "var(--text-muted)"} />
                ))}
              </div>
              <span className="rating-score">{product.rating}</span>
              <span className="rating-count">({product.reviews.toLocaleString()} reviews)</span>
            </div>

            <p className="modal-desc">{product.desc}</p>

            <div className="modal-tags">
              {product.tags.map(t => <span key={t} className="modal-tag" style={{ borderColor: product.color + "44", color: product.color }}><FiTag size={11} />{t}</span>)}
            </div>

            <div className="modal-price-row">
              <span className="modal-price">{formatINR(product.price)}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="product-original modal-original">{formatINR(product.originalPrice)}</span>
                  <span className="modal-save-badge">Save {formatINR(product.originalPrice - product.price)}</span>
                </>
              )}
            </div>

            <div className="modal-qty-row">
              <span className="qty-label">Quantity</span>
              <div className="qty-controls">
                <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q-1))}>−</button>
                <span className="qty-val">{qty}</span>
                <button className="qty-btn" onClick={() => setQty(q => q+1)}>+</button>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className={`btn-primary btn-block modal-add-btn${added ? " added" : ""}`}
                onClick={handleAdd}
                style={{ background: added ? "var(--success)" : undefined }}
              >
                <FiShoppingCart size={16} />
                {added ? "Added to Cart! ✓" : `Add ${qty} to Cart — ${formatINR(product.price * qty)}`}
              </button>
              <button
                className={`btn-wishlist${wished ? " wished" : ""}`}
                onClick={() => onWishlist(product.id)}
              >
                <FiHeart size={16} /> {wished ? "Saved" : "Wishlist"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── MAIN PAGE ─────────────────────────────────── */
export default function CollectionsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [sortOpen, setSortOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  const toggleWishlist = (id) =>
    setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);

  const filtered = PRODUCTS
    .filter(p => activeCategory === "All" || p.category === activeCategory)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "price-asc")  return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating")     return b.rating - a.rating;
      return 0;
    });

  return (
    <div className={`collections-page${mounted ? " page-mounted" : ""}`}>
      {/* hero banner */}
      <div className="page-hero collections-hero">
        <div className="page-hero-orb orb-a" />
        <div className="page-hero-orb orb-b" />
        <div className="page-hero-content">
          <span className="hero-eyebrow"><HiSparkles size={13} /> Curated for You</span>
          <h1>Our Collections</h1>
          <p>Explore {PRODUCTS.length} hand-picked products across {CATEGORIES.length - 1} categories</p>
        </div>
      </div>

      {/* controls bar */}
      <div className="collections-controls">
        <div className="search-box">
          <FiSearch size={16} />
          <input
            placeholder="Search products…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="category-chips">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`category-chip${activeCategory === cat ? " active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
              {cat !== "All" && <span className="chip-count">{PRODUCTS.filter(p => p.category === cat).length}</span>}
            </button>
          ))}
        </div>

        <div className="sort-wrap" onClick={() => setSortOpen(p => !p)}>
          <FiChevronDown size={14} />
          <span>{SORT_OPTIONS.find(s => s.value === sort)?.label}</span>
          {sortOpen && (
            <div className="sort-dropdown">
              {SORT_OPTIONS.map(opt => (
                <div
                  key={opt.value}
                  className={`sort-option${sort === opt.value ? " active" : ""}`}
                  onClick={() => { setSort(opt.value); setSortOpen(false); }}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* results count */}
      <div className="collections-meta">
        <span className="results-count">{filtered.length} products{activeCategory !== "All" ? ` in ${activeCategory}` : ""}</span>
        {wishlist.length > 0 && <span className="wishlist-count"><FiHeart size={12} /> {wishlist.length} saved</span>}
      </div>

      {/* grid */}
      {filtered.length > 0 ? (
        <div className="products-grid">
          {filtered.map((product, i) => (
            <div key={product.id} className="product-animate-wrap" style={{ animationDelay: `${i * 60}ms` }}>
              <ProductCard
                product={product}
                onSelect={setSelectedProduct}
                wishlist={wishlist}
                onWishlist={toggleWishlist}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-emoji">🔍</span>
          <h3>No products found</h3>
          <p>Try adjusting your search or category filter.</p>
          <button className="btn-primary" onClick={() => { setSearch(""); setActiveCategory("All"); }}>
            Clear Filters
          </button>
        </div>
      )}

      {/* modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          wishlist={wishlist}
          onWishlist={toggleWishlist}
        />
      )}
    </div>
  );
}
