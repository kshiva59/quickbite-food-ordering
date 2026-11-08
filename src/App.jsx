import { useEffect, useMemo, useState } from "react";
import { starterRestaurants, categories } from "./data.js";

const money = (n) => `₹${Number(n).toFixed(0)}`;
const readStore = (key, fallback) => {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
  catch { return fallback; }
};
const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2, 7)}`;

function App() {
  const [restaurants, setRestaurants] = useState(() => readStore("qb-restaurants", starterRestaurants));
  const [cart, setCart] = useState(() => readStore("qb-cart", {}));
  const [orders, setOrders] = useState(() => readStore("qb-orders", []));
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [page, setPage] = useState("home");
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [notice, setNotice] = useState("");
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });
  const [adminForm, setAdminForm] = useState({ name: "", cuisine: "", category: "Indian", time: "25–35 min", fee: 25, emoji: "🍽️", description: "" });

  useEffect(() => localStorage.setItem("qb-restaurants", JSON.stringify(restaurants)), [restaurants]);
  useEffect(() => localStorage.setItem("qb-cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("qb-orders", JSON.stringify(orders)), [orders]);

  const visibleRestaurants = useMemo(() => restaurants.filter((r) => {
    const matchesCategory = activeCategory === "All" || r.category === activeCategory;
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || `${r.name} ${r.cuisine} ${r.menu.map(m => m.name).join(" ")}`.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  }), [restaurants, activeCategory, search]);

  const cartEntries = Object.entries(cart).filter(([, qty]) => qty > 0).map(([key, qty]) => {
    const [restaurantId, itemId] = key.split("::");
    const restaurant = restaurants.find(r => r.id === restaurantId);
    const item = restaurant?.menu.find(m => m.id === itemId);
    return item && restaurant ? { key, qty, item, restaurant } : null;
  }).filter(Boolean);
  const subtotal = cartEntries.reduce((sum, x) => sum + x.item.price * x.qty, 0);
  const deliveryFee = cartEntries.length ? Math.max(...cartEntries.map(x => Number(x.restaurant.fee || 0))) : 0;
  const total = subtotal + deliveryFee;
  const itemCount = cartEntries.reduce((sum, x) => sum + x.qty, 0);

  const flash = (message) => {
    setNotice(message);
    window.clearTimeout(flash.timer);
    flash.timer = window.setTimeout(() => setNotice(""), 2600);
  };

  function addItem(restaurant, item) {
    const key = `${restaurant.id}::${item.id}`;
    setCart(current => {
      const existingRestaurantIds = [...new Set(Object.keys(current).filter(k => current[k] > 0).map(k => k.split("::")[0]))];
      if (existingRestaurantIds.length && !existingRestaurantIds.includes(restaurant.id)) {
        flash("Your cart has items from another restaurant. Clear it before adding this item.");
        return current;
      }
      return { ...current, [key]: (current[key] || 0) + 1 };
    });
    flash(`${item.name} added to cart`);
  }
  function changeQty(key, delta) {
    setCart(current => {
      const next = { ...current, [key]: Math.max(0, (current[key] || 0) + delta) };
      if (!next[key]) delete next[key];
      return next;
    });
  }
  function placeOrder(event) {
    event.preventDefault();
    if (!customer.name.trim() || !customer.phone.trim() || !customer.address.trim()) {
      flash("Please complete all delivery details.");
      return;
    }
    if (!/^[0-9]{10}$/.test(customer.phone.trim())) {
      flash("Enter a valid 10-digit mobile number.");
      return;
    }
    if (!cartEntries.length) return;
    const order = {
      id: `QB${Date.now().toString().slice(-7)}`,
      createdAt: new Date().toISOString(),
      customer: { ...customer },
      items: cartEntries.map(x => ({ name: x.item.name, emoji: x.item.emoji, price: x.item.price, qty: x.qty })),
      restaurantName: cartEntries[0].restaurant.name,
      subtotal, deliveryFee, total, status: "Confirmed"
    };
    setOrders(current => [order, ...current]);
    setCart({});
    setShowCheckout(false);
    setShowCart(false);
    setPage("orders");
    flash(`Order ${order.id} placed successfully!`);
  }
  function updateOrderStatus(id, status) {
    setOrders(current => current.map(o => o.id === id ? { ...o, status } : o));
    flash(`Order ${id} updated`);
  }
  function addRestaurant(event) {
    event.preventDefault();
    if (!adminForm.name.trim() || !adminForm.cuisine.trim()) return flash("Restaurant name and cuisine are required.");
    const restaurant = {
      ...adminForm, id: makeId(), rating: 4.5, offer: "New restaurant", color: "mint",
      fee: Number(adminForm.fee), menu: [], time: adminForm.time,
      description: adminForm.description || "Fresh food, prepared with care."
    };
    setRestaurants(current => [restaurant, ...current]);
    setAdminForm({ name: "", cuisine: "", category: "Indian", time: "25–35 min", fee: 25, emoji: "🍽️", description: "" });
    flash("Restaurant added");
  }
  function deleteRestaurant(id) {
    if (!window.confirm("Delete this restaurant?")) return;
    setRestaurants(current => current.filter(r => r.id !== id));
    setCart(current => Object.fromEntries(Object.entries(current).filter(([key]) => !key.startsWith(`${id}::`))));
    flash("Restaurant deleted");
  }
  function addAdminMenuItem(restaurantId) {
    const name = window.prompt("Menu item name:");
    if (!name?.trim()) return;
    const rawPrice = window.prompt("Price in ₹:");
    const price = Number(rawPrice);
    if (!Number.isFinite(price) || price <= 0) return flash("Enter a valid price.");
    setRestaurants(current => current.map(r => r.id === restaurantId ? {
      ...r, menu: [...r.menu, { id: makeId(), name: name.trim(), description: "Freshly prepared", price, emoji: "🍽️" }]
    } : r));
    flash("Menu item added");
  }
  function deleteMenuItem(restaurantId, itemId) {
    setRestaurants(current => current.map(r => r.id === restaurantId ? { ...r, menu: r.menu.filter(m => m.id !== itemId) } : r));
    flash("Menu item deleted");
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => { setPage("home"); setSelectedRestaurant(null); }} aria-label="QuickBite home">
          <span className="brand-mark">q</span><span>quick<span className="brand-accent">bite</span></span>
        </button>
        <nav className="main-nav">
          <button className={page === "home" ? "nav-link active" : "nav-link"} onClick={() => { setPage("home"); setSelectedRestaurant(null); }}>Explore</button>
          <button className={page === "orders" ? "nav-link active" : "nav-link"} onClick={() => setPage("orders")}>My orders</button>
          <button className={page === "admin" ? "nav-link active" : "nav-link"} onClick={() => setPage("admin")}>Admin</button>
        </nav>
        <button className="cart-button" onClick={() => setShowCart(true)}><span>🛒</span><span className="cart-label">Cart</span>{itemCount > 0 && <b>{itemCount}</b>}</button>
      </header>

      <main>
        {page === "home" && !selectedRestaurant && <>
          <section className="hero">
            <div className="hero-copy">
              <span className="eyebrow">GOOD FOOD. GOOD MOOD.</span>
              <h1>Cravings? <span>Consider it</span><br/>delivered.</h1>
              <p>Discover local favourites and get the food you love, delivered fresh to your door.</p>
              <div className="hero-search"><span>⌕</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search restaurants or dishes..." /><button onClick={() => document.getElementById("restaurant-list")?.scrollIntoView({ behavior: "smooth" })}>Search</button></div>
              <div className="hero-meta"><span>✦  Fresh picks every day</span><span>◷  Easy ordering</span><span>♡  Made with care</span></div>
            </div>
            <div className="hero-art"><div className="hero-circle"></div><div className="hero-food">🍕</div><div className="float-card float-one">🥗 <span><b>Fresh choices</b><small>Made just for you</small></span></div><div className="float-card float-two">⚡ <span><b>Quick delivery</b><small>At your doorstep</small></span></div><div className="hero-sticker">YUM!</div></div>
          </section>
          <section className="content-section" id="restaurant-list">
            <div className="section-heading"><div><span className="eyebrow">PICK YOUR FAVOURITE</span><h2>Explore restaurants</h2><p>Something delicious is just around the corner.</p></div><span className="result-count">{visibleRestaurants.length} places to try</span></div>
            <div className="category-row">{categories.map(c => <button key={c} className={activeCategory === c ? "category-chip selected" : "category-chip"} onClick={() => setActiveCategory(c)}>{c === "All" ? "✨" : c === "Indian" ? "🍛" : c === "Fast Food" ? "🍔" : c === "Asian" ? "🍜" : c === "Desserts" ? "🍰" : "🥗"} {c}</button>)}</div>
            {visibleRestaurants.length ? <div className="restaurant-grid">{visibleRestaurants.map(r => <RestaurantCard key={r.id} restaurant={r} onClick={() => setSelectedRestaurant(r.id)} />)}</div> : <EmptyState title="No restaurants found" text="Try a different search or category." action={() => { setSearch(""); setActiveCategory("All"); }} />}
          </section>
        </>}

        {page === "home" && selectedRestaurant && (() => {
          const restaurant = restaurants.find(r => r.id === selectedRestaurant);
          if (!restaurant) return <EmptyState title="Restaurant not found" text="It may have been removed." action={() => setSelectedRestaurant(null)} />;
          return <section className="content-section restaurant-detail">
            <button className="back-link" onClick={() => setSelectedRestaurant(null)}>← Back to restaurants</button>
            <div className={`detail-banner ${restaurant.color || "peach"}`}><div><span className="eyebrow">YOUR NEXT FAVOURITE MEAL</span><h1>{restaurant.name}</h1><p>{restaurant.description}</p><div className="detail-meta"><span>★ {restaurant.rating || "New"}</span><span>{restaurant.cuisine}</span><span>◷ {restaurant.time}</span><span>Delivery {money(restaurant.fee || 0)}</span></div></div><div className="detail-emoji">{restaurant.emoji}</div></div>
            <div className="section-heading menu-heading"><div><span className="eyebrow">MADE FRESH FOR YOU</span><h2>Our menu</h2></div><span className="result-count">{restaurant.menu.length} items</span></div>
            {restaurant.menu.length ? <div className="menu-grid">{restaurant.menu.map(item => <div className="menu-card" key={item.id}><div className="menu-emoji">{item.emoji}</div><div className="menu-info">{item.popular && <span className="popular-tag">BESTSELLER</span>}<h3>{item.name}</h3><p>{item.description}</p><b>{money(item.price)}</b></div><button className="add-button" onClick={() => addItem(restaurant, item)}>ADD +</button></div>)}</div> : <EmptyState title="Menu coming soon" text="This restaurant has not added any dishes yet." />}
          </section>;
        })()}

        {page === "orders" && <section className="content-section page-section"><div className="section-heading"><div><span className="eyebrow">YOUR FOOD JOURNEY</span><h2>My orders</h2><p>Keep an eye on your delicious deliveries.</p></div></div>
          {orders.length ? <div className="orders-list">{orders.map(order => <OrderCard key={order.id} order={order} />)}</div> : <EmptyState title="No orders yet" text="Your next favourite meal is waiting." action={() => setPage("home")} actionLabel="Explore restaurants" />}
        </section>}

        {page === "admin" && <section className="content-section page-section"><div className="section-heading"><div><span className="eyebrow">MANAGE QUICKBITE</span><h2>Admin dashboard</h2><p>Add restaurants, manage menus and update incoming orders.</p></div><span className="admin-pill">DEMO ADMIN</span></div>
          <div className="admin-stats"><div><span>Restaurants</span><b>{restaurants.length}</b></div><div><span>Menu items</span><b>{restaurants.reduce((s,r)=>s+r.menu.length,0)}</b></div><div><span>Total orders</span><b>{orders.length}</b></div><div><span>Revenue (demo)</span><b>{money(orders.reduce((s,o)=>s+o.total,0))}</b></div></div>
          <div className="admin-panel"><div className="panel-title"><h3>Add a restaurant</h3><span>Restaurant details</span></div><form className="admin-form" onSubmit={addRestaurant}>
            <label>Restaurant name<input value={adminForm.name} onChange={e=>setAdminForm({...adminForm,name:e.target.value})} placeholder="e.g. The Noodle House" required /></label>
            <label>Cuisine<input value={adminForm.cuisine} onChange={e=>setAdminForm({...adminForm,cuisine:e.target.value})} placeholder="e.g. Asian & Chinese" required /></label>
            <label>Category<select value={adminForm.category} onChange={e=>setAdminForm({...adminForm,category:e.target.value})}>{categories.filter(c=>c!=="All").map(c=><option key={c}>{c}</option>)}</select></label>
            <label>Delivery fee (₹)<input type="number" min="0" value={adminForm.fee} onChange={e=>setAdminForm({...adminForm,fee:e.target.value})} /></label>
            <label>Delivery time<input value={adminForm.time} onChange={e=>setAdminForm({...adminForm,time:e.target.value})} /></label>
            <label>Emoji<input value={adminForm.emoji} onChange={e=>setAdminForm({...adminForm,emoji:e.target.value})} maxLength="4" /></label>
            <label className="full-field">Description<input value={adminForm.description} onChange={e=>setAdminForm({...adminForm,description:e.target.value})} placeholder="A short description" /></label>
            <button className="primary-button" type="submit">＋ Add restaurant</button>
          </form></div>
          <div className="admin-panel"><div className="panel-title"><h3>Restaurant & menu management</h3><span>{restaurants.length} restaurants</span></div>
            <div className="admin-restaurant-list">{restaurants.map(r=><div className="admin-restaurant" key={r.id}><div className="admin-restaurant-top"><div className="admin-restaurant-name"><span>{r.emoji}</span><div><b>{r.name}</b><small>{r.cuisine} · {r.menu.length} menu items</small></div></div><div className="admin-actions"><button className="small-button" onClick={()=>addAdminMenuItem(r.id)}>＋ Menu item</button><button className="small-button danger" onClick={()=>deleteRestaurant(r.id)}>Delete</button></div></div>
              {r.menu.length > 0 && <div className="admin-menu-items">{r.menu.map(m=><div key={m.id}><span>{m.emoji} {m.name} <small>{money(m.price)}</small></span><button onClick={()=>deleteMenuItem(r.id,m.id)} aria-label={`Delete ${m.name}`}>×</button></div>)}</div>}
            </div>)}</div>
          </div>
          <div className="admin-panel"><div className="panel-title"><h3>Manage orders</h3><span>{orders.length} orders</span></div>
            {orders.length ? <div className="admin-orders">{orders.map(o=><div className="admin-order" key={o.id}><div><b>#{o.id}</b><small>{o.customer.name} · {o.restaurantName} · {money(o.total)}</small></div><select value={o.status} onChange={e=>updateOrderStatus(o.id,e.target.value)}>{["Confirmed","Preparing","Out for delivery","Delivered","Cancelled"].map(s=><option key={s}>{s}</option>)}</select></div>)}</div> : <p className="muted">Orders placed by customers will appear here.</p>}
          </div>
        </section>}
      </main>

      <footer><div className="footer-brand"><span className="brand-mark">q</span> quick<span className="brand-accent">bite</span></div><p>Good food brings people together. Made with ♡ for your cravings.</p><span>© {new Date().getFullYear()} QuickBite · React demo project</span></footer>

      {showCart && <div className="overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setShowCart(false);}}><aside className="side-drawer"><div className="drawer-header"><div><span className="eyebrow">READY WHEN YOU ARE</span><h2>Your cart <span className="muted">({itemCount})</span></h2></div><button className="icon-button" onClick={()=>setShowCart(false)}>×</button></div>
        {cartEntries.length ? <><div className="cart-items">{cartEntries.map(x=><div className="cart-line" key={x.key}><span className="cart-line-emoji">{x.item.emoji}</span><div className="cart-line-info"><b>{x.item.name}</b><small>{x.restaurant.name}</small><strong>{money(x.item.price*x.qty)}</strong></div><div className="qty-control"><button onClick={()=>changeQty(x.key,-1)}>−</button><b>{x.qty}</b><button onClick={()=>changeQty(x.key,1)}>＋</button></div></div>)}</div><div className="bill"><div><span>Item total</span><b>{money(subtotal)}</b></div><div><span>Delivery fee</span><b>{money(deliveryFee)}</b></div><div className="bill-total"><span>To pay</span><b>{money(total)}</b></div></div><button className="primary-button checkout-button" onClick={()=>{setShowCart(false);setShowCheckout(true);}}>Proceed to checkout · {money(total)}</button><button className="text-button clear-cart" onClick={()=>{setCart({});flash("Cart cleared");}}>Clear cart</button></> : <div className="empty-cart"><span>🛍️</span><h3>Your cart is feeling light</h3><p>Add something tasty from a restaurant to get started.</p><button className="primary-button" onClick={()=>setShowCart(false)}>Explore food</button></div>}
      </aside></div>}

      {showCheckout && <div className="overlay modal-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setShowCheckout(false);}}><div className="checkout-modal"><div className="drawer-header"><div><span className="eyebrow">ALMOST THERE</span><h2>Delivery details</h2></div><button className="icon-button" onClick={()=>setShowCheckout(false)}>×</button></div><form onSubmit={placeOrder} className="checkout-form"><label>Full name<input value={customer.name} onChange={e=>setCustomer({...customer,name:e.target.value})} placeholder="Your name" required /></label><label>Mobile number<input inputMode="numeric" maxLength="10" value={customer.phone} onChange={e=>setCustomer({...customer,phone:e.target.value.replace(/\D/g,"")})} placeholder="10-digit mobile number" required /></label><label>Delivery address<textarea rows="3" value={customer.address} onChange={e=>setCustomer({...customer,address:e.target.value})} placeholder="House number, street, area, city" required /></label><div className="checkout-total"><span>Amount payable</span><b>{money(total)}</b></div><p className="demo-note">Demo checkout: no real payment is collected.</p><button className="primary-button" type="submit">Place order · {money(total)}</button></form></div></div>}

      {notice && <div className="toast">✓ {notice}</div>}
    </div>
  );
}

function RestaurantCard({ restaurant, onClick }) {
  return <button className="restaurant-card" onClick={onClick}>
    <div className={`restaurant-art ${restaurant.color || "peach"}`}><span className="restaurant-emoji">{restaurant.emoji}</span><span className="offer-label">{restaurant.offer || "Fresh picks"}</span><span className="heart">♡</span></div>
    <div className="restaurant-card-body"><div className="restaurant-title"><h3>{restaurant.name}</h3><span className="rating">★ {restaurant.rating || "New"}</span></div><p>{restaurant.cuisine}</p><div className="restaurant-meta"><span>◷ {restaurant.time}</span><span>·</span><span>{Number(restaurant.fee) === 0 ? "Free delivery" : `${money(restaurant.fee)} delivery`}</span></div></div>
  </button>;
}

function OrderCard({ order }) {
  const stages = ["Confirmed", "Preparing", "Out for delivery", "Delivered"];
  const statusIndex = stages.indexOf(order.status);
  const cancelled = order.status === "Cancelled";
  return <article className="order-card"><div className="order-card-head"><div><span className="eyebrow">ORDER #{order.id}</span><h3>{order.restaurantName}</h3><p>{new Date(order.createdAt).toLocaleString()}</p></div><span className={`status-badge ${cancelled ? "cancelled" : ""}`}>{order.status}</span></div><div className="ordered-items">{order.items.map((item,i)=><div key={i}><span>{item.emoji} {item.name} × {item.qty}</span><b>{money(item.price*item.qty)}</b></div>)}</div><div className="order-total"><span>Total paid (demo)</span><b>{money(order.total)}</b></div>{cancelled ? <p className="cancelled-message">This order was cancelled by the restaurant.</p> : <div className="tracking"><div className="tracking-line">{stages.map((s,i)=><div className={`tracking-step ${i <= statusIndex ? "done" : ""}`} key={s}><span>{i < statusIndex ? "✓" : i+1}</span><small>{s}</small></div>)}</div>{order.status !== "Delivered" && <p className="tracking-hint">Your order status is updated by the restaurant.</p>}</div>}</article>;
}

function EmptyState({ title, text, action, actionLabel = "Try again" }) {
  return <div className="empty-state"><span>🍽️</span><h3>{title}</h3><p>{text}</p>{action && <button className="primary-button" onClick={action}>{actionLabel}</button>}</div>;
}

export default App;
