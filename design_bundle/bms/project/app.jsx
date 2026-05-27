/* ============================
   BMS — App root
   Login → main app with router state
   ============================ */

const PAGE_INFO = {
  dashboard:   { title: "ภาพรวม",                  crumb: "Operations / Dashboard" },
  drivers:     { title: "พนักงานขับรถ",             crumb: "Operations / Driver" },
  buses:       { title: "รถบัส",                   crumb: "Operations / Bus Fleet" },
  companies:   { title: "บริษัทขนส่ง",              crumb: "Operations / Transport Company" },
  maintenance: { title: "การบำรุงรักษา",            crumb: "Operations / Maintenance" },
  cost:        { title: "การควบคุมค่าใช้จ่าย",       crumb: "Operations / Cost Control" },
  fuel:        { title: "การเติมน้ำมัน (ATG)",       crumb: "Operations / Fuel" },
  training:    { title: "การอบรม",                 crumb: "Operations / Training" },
  license:     { title: "ใบขับขี่ & ประกันภัย",       crumb: "Operations / License & Insurance" },
  complaint:   { title: "เรื่องร้องเรียน",             crumb: "Operations / Customer Complaint" },
  safety:      { title: "มาตรการความปลอดภัย",       crumb: "Operations / Safety Measurement" },
  purchase:    { title: "การจัดซื้อ",               crumb: "Operations / Purchase" },
  users:       { title: "การจัดการผู้ใช้งาน",          crumb: "Admin / User Management" },
};

const ACCOUNTS = [
  { email: "admin@bms.co.th", password: "admin123", role: "admin",     name: "พรทิพย์ น." },
  { email: "ops@bms.co.th",   password: "ops123",   role: "operation", name: "สมหญิง พ." },
];

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd]     = useState("");
  const [err, setErr]     = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow]   = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setErr("");
    if (!email.trim() || !pwd) {
      setErr("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }
    setLoading(true);
    // Simulate auth check
    setTimeout(() => {
      const acct = ACCOUNTS.find(a => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === pwd);
      if (!acct) {
        setErr("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        setLoading(false);
        return;
      }
      onLogin(acct);
    }, 450);
  };

  const fill = (acct) => { setEmail(acct.email); setPwd(acct.password); setErr(""); };

  return (
    <div className="login-shell">
      <form className="login-card" onSubmit={submit} noValidate>
        <div className="logo-row">
          <img className="logo-img" src="assets/logo-bms-full.png" alt="BMS — MinebeaMitsumi"/>
          <div>
            <h1>Bus Management System</h1>
            <div className="tag">ระบบจัดการรถบัส · MinebeaMitsumi</div>
          </div>
        </div>

        {err && (
          <div className="login-error" role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9"/><path d="M12 8v4"/><circle cx="12" cy="16" r="0.6" fill="currentColor"/>
            </svg>
            <span>{err}</span>
          </div>
        )}

        <div className="field">
          <label>อีเมล</label>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setErr(""); }}
            placeholder="name@bms.co.th"
            autoFocus
            className={err ? "input-error" : ""}
          />
        </div>
        <div className="field">
          <label>รหัสผ่าน</label>
          <div className="pwd-wrap">
            <input
              type={show ? "text" : "password"}
              value={pwd}
              onChange={e => { setPwd(e.target.value); setErr(""); }}
              placeholder="••••••••"
              className={err ? "input-error" : ""}
            />
            <button type="button" className="pwd-toggle" onClick={() => setShow(s => !s)} aria-label={show ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}>
              {show ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 2l20 20"/>
                  <path d="M6.7 6.7C4 8.5 2 12 2 12s4 7 10 7c2 0 3.7-.5 5.3-1.3"/>
                  <path d="M10 5.2A11 11 0 0112 5c6 0 10 7 10 7s-.9 1.6-2.6 3.3"/>
                  <path d="M14.1 14.1A3 3 0 019.9 9.9"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center" style={{marginBottom:18, fontSize:12.5}}>
          <label style={{display:"flex", alignItems:"center", gap:6, color:"var(--text-muted)"}}>
            <input type="checkbox" defaultChecked/> จดจำการเข้าสู่ระบบ
          </label>
          <a href="#" onClick={e => { e.preventDefault(); setForgotOpen(true); }} style={{color:"var(--navy-700)", fontWeight:600}}>ลืมรหัสผ่าน?</a>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{width:"100%", justifyContent:"center", padding:"11px"}}>
          {loading ? (
            <>
              <span className="spinner"></span> กำลังเข้าสู่ระบบ…
            </>
          ) : "เข้าสู่ระบบ"}
        </button>

        <div className="demo-creds">
          <div className="demo-creds-head">บัญชีทดลอง — คลิกเพื่อกรอกอัตโนมัติ</div>
          <div className="demo-creds-rows">
            {ACCOUNTS.map(a => (
              <button type="button" key={a.email} className="demo-row" onClick={() => fill(a)}>
                <div>
                  <div className="demo-email">{a.email}</div>
                  <div className="demo-pw mono">รหัส: {a.password}</div>
                </div>
                <span className={"role-badge " + (a.role === "admin" ? "role-admin" : "role-op")}>
                  {a.role === "admin" ? "Admin" : "Operation"}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={{textAlign:"center", marginTop:18, fontSize:11.5, color:"var(--text-faint)"}}>
          v2.4.1 • © 2569 BMS · MinebeaMitsumi IT Operations
        </div>
      </form>

      {forgotOpen && (
        <div className="modal-scrim" onClick={() => setForgotOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
            <button className="modal-close" onClick={() => setForgotOpen(false)} aria-label="ปิด">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
            </button>
            <div className="modal-ico">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="10" rx="2"/>
                <path d="M7 11V8a5 5 0 0110 0v3"/>
                <circle cx="12" cy="16" r="1.2" fill="currentColor"/>
              </svg>
            </div>
            <h3 className="modal-title">ลืมรหัสผ่าน</h3>
            <p className="modal-text">
              กรุณาติดต่อผู้ดูแลระบบเพื่อรีเซ็ตรหัสผ่านของคุณ
            </p>
            <div className="modal-contact">
              <div className="modal-contact-row">
                <span className="modal-contact-label">ผู้ดูแลระบบ</span>
                <span className="modal-contact-value">ฝ่าย IT Operations · MinebeaMitsumi</span>
              </div>
              <div className="modal-contact-row">
                <span className="modal-contact-label">อีเมล</span>
                <a className="modal-contact-value link" href="mailto:it.support@minebeamitsumi.co.th">it.support@minebeamitsumi.co.th</a>
              </div>
              <div className="modal-contact-row">
                <span className="modal-contact-label">โทรภายใน</span>
                <span className="modal-contact-value mono">ต่อ 1234</span>
              </div>
              <div className="modal-contact-row">
                <span className="modal-contact-label">เวลาทำการ</span>
                <span className="modal-contact-value">จ.–ศ. 08:00–17:30</span>
              </div>
            </div>
            <button className="btn btn-primary modal-cta" onClick={() => setForgotOpen(false)}>
              เข้าใจแล้ว
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(null); // null = not logged in
  const [page, setPage] = useState("dashboard");
  const [role, setRole] = useState("admin");
  const [toasts, setToasts] = useState([]);

  const pushToast = (t) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(ts => [...ts, { ...t, id }]);
    setTimeout(() => setToasts(ts => ts.filter(x => x.id !== id)), 2800);
  };

  const handleLogin = (acct) => {
    setUser(acct);
    setRole(acct.role);
    setPage("dashboard");
    pushToast({ msg: "ยินดีต้อนรับ " + acct.name, kind: "success" });
  };

  const handleLogout = () => {
    setUser(null);
    setPage("dashboard");
  };

  // Hide users page if role switched to operation
  useEffect(() => {
    if (role === "operation" && page === "users") setPage("dashboard");
  }, [role, page]);

  if (!user) return <Login onLogin={handleLogin}/>;

  const Page = {
    dashboard:   Dashboard,
    drivers:     Drivers,
    buses:       Buses,
    companies:   Companies,
    maintenance: Maintenance,
    cost:        CostControl,
    fuel:        Fuel,
    training:    Training,
    license:     License,
    complaint:   Complaint,
    safety:      Safety,
    purchase:    Purchase,
    users:       Users,
  }[page] || Dashboard;

  const info = PAGE_INFO[page];

  return (
    <div className="app">
      <Sidebar active={page} onNav={setPage} role={role} onLogout={handleLogout} user={user} />
      <div className="main">
        <Topbar title={info.title} crumb={info.crumb} role={role} onRoleChange={setRole} onToast={pushToast}/>
        <div className="content">
          <Page onToast={pushToast}/>
        </div>
      </div>
      <ToastStack items={toasts}/>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
