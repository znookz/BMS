/* ============================
   BMS — Shared components
   Sidebar, Topbar, KPI, Badge, Progress, Table helpers, Drawer, Toast
   ============================ */

const { useState, useEffect, useRef, useMemo } = React;

/* ---------- Sidebar ---------- */
const NAV = [
  { id: "dashboard",   label: "Dashboard",          icon: "home" },
  { id: "drivers",     label: "Driver",             icon: "user" },
  { id: "buses",       label: "Bus Fleet",          icon: "bus" },
  { id: "companies",   label: "Transport Company",  icon: "building" },
  { id: "maintenance", label: "Maintenance",        icon: "wrench" },
  { id: "cost",        label: "Cost Control",       icon: "coin" },
  { id: "fuel",        label: "Fuel (ATG)",         icon: "fuel" },
  { id: "training",    label: "Training",           icon: "cap" },
  { id: "license",     label: "License & Insurance",icon: "id" },
  { id: "complaint",   label: "Customer Complaint", icon: "chat" },
  { id: "safety",      label: "Safety Measurement", icon: "shield" },
  { id: "purchase",    label: "Purchase",           icon: "cart" },
  { id: "users",       label: "User Management",    icon: "users", adminOnly: true },
];

const Sidebar = ({ active, onNav, role, onLogout, user }) => (
  <aside className="sidebar">
    <div className="sidebar-brand">
      <div className="sidebar-logo"><img src="assets/logo-bms-mark.png" alt="BMS"/></div>
      <div>
        <div className="sidebar-name">BMS</div>
        <div className="sidebar-sub">MinebeaMitsumi</div>
      </div>
    </div>

    <div className="sidebar-section-label">Operations</div>
    <nav className="sidebar-nav">
      {NAV.filter(n => !n.adminOnly || role === "admin").map((n, i) => (
        <button
          key={n.id}
          className={"nav-item " + (active === n.id ? "active" : "")}
          onClick={() => onNav(n.id)}
        >
          <span className="nav-ico"><Icon name={n.icon} size={17} /></span>
          <span>{n.label}</span>
          {n.adminOnly && <span className="pill-admin">Admin</span>}
        </button>
      ))}
    </nav>

    <div className="sidebar-user">
      <div className="avatar">{user ? initials(user.name) : "พน"}</div>
      <div className="meta">
        <div className="name">{user ? user.name : "พรทิพย์ น."}</div>
        <div className="role">{role === "admin" ? "Administrator" : "Operations"}</div>
      </div>
      <button className="icon-btn" title="ออกจากระบบ" style={{color:"#94a3b8"}} onClick={onLogout}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
          <path d="M16 17l5-5-5-5"/>
          <path d="M21 12H9"/>
        </svg>
      </button>
    </div>
  </aside>
);

/* ---------- Topbar ---------- */
const Topbar = ({ title, crumb, role, onRoleChange, onToast }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const unread = NOTIFS.filter(n => n.unread).length;

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const iconFor = (k) => k === "maintenance" ? "wrench" : k === "license" ? "id" : k === "training" ? "cap" : "alert";
  const toneFor = (k) => k === "maintenance" ? {bg:"#fef3c7",fg:"#b45309"} : k === "license" ? {bg:"#dbeafe",fg:"#1d4ed8"} : k === "training" ? {bg:"#e0e7ff",fg:"#4338ca"} : {bg:"#fee2e2",fg:"#b91c1c"};

  return (
    <div className="topbar">
      <div className="topbar-title">
        <div className="crumb">{crumb}</div>
        <h1>{title}</h1>
      </div>

      <div className="topbar-search">
        <span className="ico"><Icon name="search" size={15} /></span>
        <input placeholder="ค้นหา รถ, คนขับ, เส้นทาง…" />
      </div>

      <div className="topbar-actions" ref={ref} style={{position:"relative"}}>
        <button className="icon-btn" title="Refresh" onClick={() => onToast?.({msg:"รีเฟรชข้อมูลแล้ว", kind:"success"})}>
          <Icon name="refresh" size={17} />
        </button>
        <button className="icon-btn" title="Notifications" onClick={() => setOpen(o => !o)}>
          <Icon name="bell" size={20} />
          {unread > 0 && <span className="dot">{unread}</span>}
        </button>

        {open && (
          <div className="notif-dropdown">
            <div className="notif-head">
              <h4>การแจ้งเตือน</h4>
              <button className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>ทำเป็นอ่านแล้ว</button>
            </div>
            <div className="notif-list">
              {NOTIFS.map(n => {
                const tone = toneFor(n.kind);
                return (
                  <div className="notif-item" key={n.id}>
                    <div className="ico" style={{background: tone.bg, color: tone.fg}}>
                      <Icon name={iconFor(n.kind)} size={16} />
                    </div>
                    <div className="body">
                      <div className="msg">{n.msg}</div>
                      <div className="when">{n.when}</div>
                    </div>
                    {n.unread && <div style={{width:8,height:8,borderRadius:8,background:"var(--amber-500)",alignSelf:"center"}}/>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------- KPI ---------- */
const KPI = ({ tone = "navy", icon, label, value, trend, foot }) => (
  <div className={"kpi tone-" + tone}>
    <div className="kpi-ico"><Icon name={icon} size={20} /></div>
    <div className="kpi-body">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value tnum">{value}</div>
      <div className="kpi-foot">
        {trend && (
          <span className={trend.dir === "up" ? "trend-up" : trend.dir === "down" ? "trend-down" : "trend-neutral"}>
            <Icon name={trend.dir === "up" ? "arrowUp" : trend.dir === "down" ? "arrowDown" : "dot"} size={12} />{" "}
            {trend.label}
          </span>
        )}
        {foot && <span>{foot}</span>}
      </div>
    </div>
  </div>
);

/* ---------- Status Badge ---------- */
const StatusBadge = ({ status }) => {
  const map = {
    active:      { cls: "badge-success", label: "Active",          dot: true },
    inactive:    { cls: "badge-neutral", label: "Inactive",        dot: true },
    maintenance: { cls: "badge-warning", label: "In Maintenance",  dot: true },
    retired:     { cls: "badge-neutral", label: "Retired",         dot: true },
    pending:     { cls: "badge-info",    label: "Pending",         dot: true },
    expired:     { cls: "badge-danger",  label: "Expired",         dot: true },
  };
  const s = map[status] || { cls: "badge-neutral", label: status, dot: true };
  return (
    <span className={"badge " + s.cls}>
      {s.dot && <span className="dot"></span>}
      {s.label}
    </span>
  );
};

/* ---------- Progress ---------- */
const Progress = ({ pct }) => {
  const cls = pct >= 100 ? "danger" : pct >= 80 ? "warn" : "";
  return (
    <div className={"progress " + cls}>
      <div className="bar" style={{width: Math.min(100, pct) + "%"}}></div>
    </div>
  );
};

/* ---------- Avatar ---------- */
const Avatar = ({ name, size = 28 }) => (
  <div className="avatar-sm" style={{width:size, height:size, fontSize: size*0.4}}>
    {initials(name)}
  </div>
);

/* ---------- Drawer ---------- */
const Drawer = ({ open, title, onClose, children, footer }) => (
  <>
    <div className={"drawer-scrim " + (open ? "open" : "")} onClick={onClose} />
    <div className={"drawer " + (open ? "open" : "")}>
      <div className="drawer-head">
        <h3>{title}</h3>
        <button className="icon-btn" onClick={onClose}><Icon name="close" size={18}/></button>
      </div>
      <div className="drawer-body">{children}</div>
      {footer && <div className="drawer-foot">{footer}</div>}
    </div>
  </>
);

/* ---------- Toast stack ---------- */
const ToastStack = ({ items }) => (
  <div className="toast-stack">
    {items.map(t => (
      <div className={"toast " + (t.kind || "success")} key={t.id}>
        <Icon name={t.kind === "danger" ? "alert" : t.kind === "warning" ? "alert" : "check"} size={16}
          style={{color: t.kind === "danger" ? "var(--danger)" : t.kind === "warning" ? "var(--warning)" : "var(--success)"}}/>
        <span>{t.msg}</span>
      </div>
    ))}
  </div>
);

/* ---------- Page placeholder ---------- */
const PlaceholderPage = ({ title, items = [] }) => (
  <div className="placeholder-page">
    <Icon name="settings" size={28} style={{color:"var(--text-faint)", marginBottom: 8}}/>
    <h3>{title}</h3>
    <p>หน้านี้อยู่ระหว่างการออกแบบ — โครงสร้างและองค์ประกอบหลักของระบบ</p>
    {items.length > 0 && (
      <div className="placeholder-list">
        {items.map((i, k) => <div className="pl-item" key={k}>• {i}</div>)}
      </div>
    )}
  </div>
);

/* ---------- Sparkline ---------- */
const Sparkline = ({ values, width = 80, height = 24, color = "var(--navy-700)" }) => {
  const max = Math.max(...values), min = Math.min(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1);
  const pts = values.map((v, i) => `${(i*step).toFixed(1)},${(height - ((v-min)/range)*height).toFixed(1)}`).join(" ");
  return (
    <svg width={width} height={height} style={{display:"block"}}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/* ---------- Pagination ---------- */
const Pagination = ({ page, pageSize, total, onChange }) => {
  const pages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize + 1;
  const end   = Math.min(page * pageSize, total);
  const list = [];
  const push = (p) => list.push(p);
  if (pages <= 7) for (let i = 1; i <= pages; i++) push(i);
  else {
    push(1);
    if (page > 3) push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) push(i);
    if (page < pages - 2) push("…");
    push(pages);
  }
  return (
    <div className="pagination">
      <div>แสดง {start}–{end} จาก {total} รายการ</div>
      <div className="pager">
        <button onClick={() => onChange(Math.max(1, page-1))} disabled={page === 1}><Icon name="chevleft" size={14}/></button>
        {list.map((p, i) => p === "…"
          ? <button key={i} disabled>…</button>
          : <button key={i} className={p === page ? "on" : ""} onClick={() => onChange(p)}>{p}</button>
        )}
        <button onClick={() => onChange(Math.min(pages, page+1))} disabled={page === pages}><Icon name="chevright" size={14}/></button>
      </div>
    </div>
  );
};

Object.assign(window, {
  Sidebar, Topbar, KPI, StatusBadge, Progress, Avatar,
  Drawer, ToastStack, PlaceholderPage, Sparkline, Pagination,
  NAV,
});
