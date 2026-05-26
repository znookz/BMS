/* ============================
   BMS — Stub pages (sketched)
   Other modules: Maintenance, Cost, Fuel, Training, License, Complaint, Safety, Purchase, Users
   ============================ */

const Maintenance = ({ onToast }) => {
  // Build records with computed pct
  const records = useMemo(() => BUSES.map(b => {
    const cycle = 10000;
    const kmToNext = b.nextServiceKm - b.currentKm;
    const pct = Math.max(0, Math.min(110, ((cycle - kmToNext) / cycle) * 100));
    return { ...b, kmToNext, pct };
  }), []);

  const [factory, setFactory] = useState("all");
  const [status, setStatus]   = useState("all"); // all | due7 | warn | over
  const [type, setType]       = useState("all"); // all | air | fan
  const [search, setSearch]   = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const [logOpen, setLogOpen] = useState(false);
  const [logTarget, setLogTarget] = useState(null);

  const [form, setForm] = useState({ busId: "", date: "2026-05-26", kind: "scheduled", cost: "", km: "", desc: "", photo: null });
  const [errors, setErrors] = useState({});

  const filtered = useMemo(() => records.filter(r => {
    if (factory !== "all" && r.factory !== factory) return false;
    if (type    !== "all" && r.type    !== type)    return false;
    if (status === "over"  && r.pct < 100) return false;
    if (status === "warn"  && (r.pct < 80 || r.pct >= 100)) return false;
    if (status === "due7"  && (r.kmToNext > 500 || r.pct >= 100)) return false; // approximate: within ~500km
    if (search) {
      const q = search.toLowerCase();
      if (!(r.plate.toLowerCase().includes(q) || r.driver.includes(search) || r.brand.toLowerCase().includes(q))) return false;
    }
    return true;
  }), [records, factory, type, status, search]);

  const stat = useMemo(() => ({
    total: records.length,
    due7:  records.filter(r => r.kmToNext <= 500 && r.pct < 100).length,
    warn:  records.filter(r => r.pct >= 80 && r.pct < 100).length,
    over:  records.filter(r => r.pct >= 100).length,
    closed: 22,
  }), [records]);

  const openLogFor = (bus) => {
    setLogTarget(bus);
    setForm({
      busId: bus ? bus.id : "",
      date: new Date().toISOString().slice(0, 10),
      kind: "scheduled",
      cost: "",
      km: bus ? String(bus.currentKm) : "",
      desc: "",
      photo: null,
    });
    setErrors({});
    setLogOpen(true);
  };
  const closeLog = () => { setLogOpen(false); setLogTarget(null); setErrors({}); };

  const submitLog = () => {
    const e = {};
    if (!form.busId) e.busId = "เลือกรถบัส";
    if (!form.date)  e.date  = "เลือกวันที่";
    if (!form.km || isNaN(Number(form.km)))     e.km   = "กรอกเลขไมล์";
    if (!form.cost || isNaN(Number(form.cost))) e.cost = "กรอกค่าใช้จ่าย";
    if (!form.desc.trim()) e.desc = "กรอกรายละเอียด";
    setErrors(e);
    if (Object.keys(e).length) return;
    const bus = BUSES.find(b => b.id === form.busId);
    onToast?.({ msg: `บันทึกการซ่อม ${bus?.plate || ""} • ฿${Number(form.cost).toLocaleString()}`, kind: "success" });
    closeLog();
  };

  const onFile = (e) => {
    const f = e.target.files?.[0];
    setForm({ ...form, photo: f || null });
  };

  const clearFilters = () => { setFactory("all"); setStatus("all"); setType("all"); setSearch(""); };
  const activeFilterCount = [factory !== "all", status !== "all", type !== "all", !!search].filter(Boolean).length;

  return (
    <div>
      <div className="page-header">
        <div><h2>การบำรุงรักษา</h2><div className="sub">ติดตามสถานะการบำรุงรักษาตามเลขไมล์ • รวม {records.length} คัน</div></div>
        <div className="flex gap-8">
          <button className="btn" onClick={() => setFilterOpen(o => !o)}>
            <Icon name="filter" size={15}/> ตัวกรอง {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}
          </button>
          <button className="btn btn-primary" onClick={() => openLogFor(null)}>
            <Icon name="plus" size={15}/> บันทึกการซ่อม
          </button>
        </div>
      </div>

      <div className="kpi-grid mb-8" style={{marginBottom:16}}>
        <KPI tone="navy"  icon="wrench"   label="ครบกำหนดเร็วๆ นี้" value={stat.due7 + " คัน"} foot="ภายในระยะใกล้"/>
        <KPI tone="amber" icon="alert"    label="ใกล้ครบ (≥80%)"   value={stat.warn + " คัน"} foot=""/>
        <KPI tone="red"   icon="alert"    label="เกินกำหนด"        value={stat.over + " คัน"} foot="ต้องดำเนินการ"/>
        <KPI tone="green" icon="check"    label="ปิดงานเดือนนี้"     value={stat.closed + " รายการ"} foot=""/>
      </div>

      <div className="card">
        <div className="toolbar">
          <div className="search">
            <span className="ico"><Icon name="search" size={15}/></span>
            <input
              placeholder="ค้นหา ทะเบียน, ยี่ห้อ, คนขับ…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select value={factory} onChange={e => setFactory(e.target.value)}>
            <option value="all">ทุกโรงงาน</option>
            {FACTORIES.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="all">ทุกประเภท</option>
            <option value="air">รถปรับอากาศ</option>
            <option value="fan">รถพัดลม</option>
          </select>
          <div className="seg" style={{marginLeft:"auto"}}>
            <button className={status === "all" ? "on" : ""} onClick={() => setStatus("all")}>ทั้งหมด</button>
            <button className={status === "warn" ? "on" : ""} onClick={() => setStatus("warn")}>ใกล้ครบ</button>
            <button className={status === "over" ? "on" : ""} onClick={() => setStatus("over")}>เกินกำหนด</button>
          </div>
          {activeFilterCount > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
              <Icon name="close" size={13}/> ล้างตัวกรอง
            </button>
          )}
          <div className="result-count">{filtered.length} คัน</div>
        </div>

        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>ทะเบียน</th><th>ประเภท</th><th>โรงงาน</th>
                <th style={{textAlign:"right"}}>เลขไมล์ปัจจุบัน</th>
                <th style={{textAlign:"right"}}>กม. ถัดไป</th>
                <th>บำรุงรักษาล่าสุด</th>
                <th style={{minWidth:200}}>ครบรอบบำรุงรักษา</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 30).map(b => (
                <tr key={b.id}>
                  <td><span className="mono tbl-cell-strong">{b.plate}</span></td>
                  <td>
                    <span className={"badge " + (b.type === "air" ? "badge-info" : "badge-neutral")}>
                      <span className="dot"></span>{b.type === "air" ? "ปรับอากาศ" : "พัดลม"}
                    </span>
                  </td>
                  <td>{b.factory}</td>
                  <td className="mono" style={{textAlign:"right"}}>{formatNumber(b.currentKm)}</td>
                  <td className="mono" style={{textAlign:"right"}}>{formatNumber(b.nextServiceKm)}</td>
                  <td className="text-muted">{b.lastService}</td>
                  <td>
                    <Progress pct={b.pct}/>
                    <div className="text-xs text-muted mt-4 mono">
                      {b.pct.toFixed(0)}% • {b.kmToNext <= 0 ? `เกิน ${formatNumber(-b.kmToNext)} กม.` : `เหลือ ${formatNumber(b.kmToNext)} กม.`}
                    </div>
                  </td>
                  <td>
                    <button className="btn btn-sm" onClick={() => openLogFor(b)}>
                      <Icon name="plus" size={12}/> บันทึก
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="8" style={{textAlign:"center", padding:"40px 0", color:"var(--text-muted)"}}>
                  ไม่พบรถบัสตามเงื่อนไขที่เลือก
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 30 && (
          <div className="pagination">
            <div>แสดง 30 รายการแรกจาก {filtered.length} รายการ — ใช้ตัวกรองเพื่อแคบลง</div>
          </div>
        )}
      </div>

      {/* Log maintenance modal */}
      {logOpen && (
        <div className="modal-scrim" onClick={closeLog}>
          <div className="modal modal-form" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
            <button className="modal-close" onClick={closeLog} aria-label="ปิด"><Icon name="close" size={18}/></button>
            <div className="modal-form-head">
              <div className="modal-ico" style={{margin:0, width:42, height:42, borderRadius:10, background:"var(--amber-100)", color:"var(--amber-600)"}}>
                <Icon name="wrench" size={20}/>
              </div>
              <div style={{textAlign:"left"}}>
                <h3 className="modal-title" style={{textAlign:"left", marginBottom:2}}>บันทึกการซ่อมบำรุง</h3>
                <div className="text-muted text-xs">
                  {logTarget ? `รถบัส ${logTarget.plate} • ${logTarget.factory}` : "เลือกรถบัสและกรอกข้อมูลการซ่อม"}
                </div>
              </div>
            </div>

            <div className="modal-form-body">
              <div className="field">
                <label>รถบัส *</label>
                <select
                  value={form.busId}
                  onChange={e => {
                    const v = e.target.value;
                    const b = BUSES.find(x => x.id === v);
                    setForm({ ...form, busId: v, km: b ? String(b.currentKm) : form.km });
                  }}
                  className={errors.busId ? "input-error" : ""}
                  disabled={!!logTarget}
                >
                  <option value="">— เลือกรถบัส —</option>
                  {BUSES.map(b => <option key={b.id} value={b.id}>{b.plate} • {b.factory} ({b.type === "air" ? "ปรับอากาศ" : "พัดลม"})</option>)}
                </select>
                {errors.busId && <div className="field-err">{errors.busId}</div>}
              </div>

              <div className="field-row">
                <div className="field">
                  <label>วันที่ *</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    className={errors.date ? "input-error" : ""}
                  />
                  {errors.date && <div className="field-err">{errors.date}</div>}
                </div>
                <div className="field">
                  <label>เลขไมล์ปัจจุบัน *</label>
                  <input
                    className={"mono " + (errors.km ? "input-error" : "")}
                    value={form.km}
                    onChange={e => setForm({ ...form, km: e.target.value.replace(/[^\d]/g, "") })}
                    placeholder="0"
                  />
                  {errors.km && <div className="field-err">{errors.km}</div>}
                </div>
              </div>

              <div className="field">
                <label>ประเภทการซ่อม *</label>
                <div className="role-picker" style={{gridTemplateColumns:"repeat(3, 1fr)"}}>
                  {[
                    { id: "scheduled", label: "ตามแผน",   desc: "บำรุงรักษาประจำ" },
                    { id: "breakdown", label: "ขัดข้อง",   desc: "เหตุเสียกะทันหัน" },
                    { id: "accident",  label: "อุบัติเหตุ", desc: "ซ่อมหลังเหตุการณ์" },
                  ].map(k => (
                    <button
                      key={k.id}
                      type="button"
                      className={"role-opt " + (form.kind === k.id ? "on" : "")}
                      onClick={() => setForm({ ...form, kind: k.id })}
                    >
                      <div className="role-opt-head">
                        <span style={{fontWeight:700, color:"var(--text-strong)", fontSize:13}}>{k.label}</span>
                        {form.kind === k.id && <Icon name="check" size={14} style={{color:"var(--navy-700)"}}/>}
                      </div>
                      <div className="role-opt-desc">{k.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>รายละเอียด *</label>
                <textarea
                  rows="3"
                  value={form.desc}
                  onChange={e => setForm({ ...form, desc: e.target.value })}
                  className={errors.desc ? "input-error" : ""}
                  placeholder="เช่น เปลี่ยนน้ำมันเครื่อง + ไส้กรอง, ตรวจระบบเบรก…"
                />
                {errors.desc && <div className="field-err">{errors.desc}</div>}
              </div>

              <div className="field">
                <label>ค่าใช้จ่าย (บาท) *</label>
                <input
                  className={"mono " + (errors.cost ? "input-error" : "")}
                  value={form.cost}
                  onChange={e => setForm({ ...form, cost: e.target.value.replace(/[^\d.]/g, "") })}
                  placeholder="เช่น 3800"
                />
                {errors.cost && <div className="field-err">{errors.cost}</div>}
              </div>

              <div className="field">
                <label>เอกสาร / ภาพประกอบ</label>
                <label className="file-drop">
                  <input type="file" accept="image/*,.pdf" onChange={onFile} hidden/>
                  <Icon name="upload" size={20} style={{color:"var(--text-faint)"}}/>
                  {form.photo
                    ? <span style={{color:"var(--text-strong)", fontWeight:600}}>{form.photo.name}</span>
                    : <span>ลากไฟล์มาวาง หรือ <span style={{color:"var(--navy-700)", fontWeight:600, textDecoration:"underline"}}>เลือกไฟล์</span></span>}
                  <span className="text-xs text-muted">JPG, PNG, PDF • ไม่เกิน 10MB</span>
                </label>
              </div>
            </div>

            <div className="modal-form-foot">
              <button className="btn" onClick={closeLog}>ยกเลิก</button>
              <button className="btn btn-primary" onClick={submitLog}>
                <Icon name="check" size={15}/> บันทึกการซ่อม
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CostControl = () => {
  const total = COST_TREND[COST_TREND.length - 1].air + COST_TREND[COST_TREND.length - 1].fan;
  return (
    <div>
      <div className="page-header">
        <div><h2>การควบคุมค่าใช้จ่าย</h2><div className="sub">เปรียบเทียบและวิเคราะห์ค่าใช้จ่ายแยกประเภท</div></div>
        <div className="flex gap-8">
          <div className="seg"><button className="on">เดือนนี้</button><button>ไตรมาส</button><button>ปี</button></div>
          <button className="btn"><Icon name="calendar" size={15}/> พ.ค. 2569</button>
          <button className="btn btn-primary"><Icon name="download" size={15}/> Export</button>
        </div>
      </div>
      <div className="kpi-grid mb-8" style={{marginBottom:16}}>
        <KPI tone="navy"  icon="coin"  label="รวมทั้งหมด"     value={`฿${(total*1000).toLocaleString()}`} trend={{dir:"up", label:"+5.8% MoM"}}/>
        <KPI tone="blue"  icon="fuel"  label="ค่าน้ำมัน"       value="฿1.64M" trend={{dir:"up", label:"+3.2%"}}/>
        <KPI tone="amber" icon="wrench" label="ค่าบำรุงรักษา"  value="฿720K"  trend={{dir:"down", label:"-2.1%"}}/>
        <KPI tone="green" icon="shield" label="ประกัน / ภาษี" value="฿320K"  trend={{dir:"neutral", label:"คงที่"}}/>
      </div>
      <div style={{display:"grid", gridTemplateColumns:"1.5fr 1fr", gap:16}}>
        <div className="card">
          <div className="card-head"><h3>แนวโน้มค่าใช้จ่าย 12 เดือน</h3></div>
          <div className="card-body">
            <LineChart
              data={COST_TREND.map(d => ({ x: d.m, total: d.air + d.fan, air: d.air, fan: d.fan }))}
              lines={[
                { key: "total", label: "รวม", color: "#1e3a5f" },
                { key: "air",   label: "ปรับอากาศ", color: "#3b82f6" },
                { key: "fan",   label: "พัดลม",     color: "#f59e0b" },
              ]}
              height={260}
            />
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h3>แยกตามประเภท</h3></div>
          <div className="card-body">
            <DonutChart
              data={[
                { label: "น้ำมัน",       value: 1640, color: "#1e3a5f" },
                { label: "บำรุงรักษา",   value: 720,  color: "#f59e0b" },
                { label: "ประกัน/ภาษี",  value: 320,  color: "#22c55e" },
                { label: "อื่นๆ",         value: 250,  color: "#94a3b8" },
              ]}
              size={180} thickness={26}
            />
          </div>
        </div>
      </div>
      <div className="card mt-16">
        <div className="card-head"><h3>รายการล่าสุด</h3><a className="btn btn-ghost btn-sm">ทั้งหมด</a></div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>วันที่</th><th>ประเภท</th><th>รถบัส</th><th>รายละเอียด</th><th style={{textAlign:"right"}}>จำนวน</th></tr></thead>
            <tbody>
              {[
                ["2026-05-26", "น้ำมัน", "40-1234 อย", "เติม 78 ลิตร @ 32.50", 2535],
                ["2026-05-26", "บำรุงรักษา", "31-1318 ลบ", "เปลี่ยนน้ำมันเครื่อง + ไส้กรอง", 3800],
                ["2026-05-25", "น้ำมัน", "30-1471 อย", "เติม 92 ลิตร @ 32.50", 2990],
                ["2026-05-24", "ประกัน", "41-1521 ปท", "ต่อ พ.ร.บ. ประจำปี", 1180],
                ["2026-05-23", "บำรุงรักษา", "40-1234 อย", "ตรวจระบบเบรก", 4500],
              ].map((r, i) => (
                <tr key={i}>
                  <td className="text-muted">{r[0]}</td>
                  <td><span className="badge badge-navy">{r[1]}</span></td>
                  <td className="mono tbl-cell-strong">{r[2]}</td>
                  <td>{r[3]}</td>
                  <td className="mono tbl-cell-strong" style={{textAlign:"right"}}>{formatBaht(r[4])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Fuel = () => {
  const total = FUEL_BY_COMPANY.reduce((a,b)=>a+b.liters,0);
  return (
    <div>
      <div className="page-header">
        <div>
          <h2>การเติมน้ำมัน (ATG)</h2>
          <div className="sub">
            <span style={{display:"inline-flex", alignItems:"center", gap:6}}>
              <span style={{width:8,height:8,borderRadius:8,background:"var(--success)", animation:"pulse 1.5s ease-in-out infinite"}}></span>
              <span style={{color:"var(--success)", fontWeight:600}}>LIVE</span> · เชื่อมต่อระบบ ATG · อัปเดตล่าสุด 14:32:08
            </span>
          </div>
        </div>
        <div className="flex gap-8">
          <button className="btn"><Icon name="refresh" size={15}/> รีเฟรช</button>
          <button className="btn btn-primary"><Icon name="download" size={15}/> Export CSV</button>
        </div>
      </div>
      <div className="kpi-grid mb-8" style={{marginBottom:16}}>
        <KPI tone="navy"  icon="fuel" label="ลิตรวันนี้"     value={total.toLocaleString() + " ล."} foot="84 รายการ"/>
        <KPI tone="blue"  icon="coin" label="ค่าใช้จ่ายวันนี้" value={bahtCompact(total * 32.5)} foot="@32.50 บาท/ลิตร"/>
        <KPI tone="amber" icon="bus"  label="รถที่เติมแล้ว"   value="56 / 88" foot="64% ของกองรถ"/>
        <KPI tone="green" icon="trendup" label="เฉลี่ย/คัน" value="148 ล." trend={{dir:"down", label:"-2.4% vs เมื่อวาน"}}/>
      </div>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16}}>
        <div className="card">
          <div className="card-head"><h3>การใช้น้ำมันรายบริษัท</h3></div>
          <div className="card-body">
            <BarChart data={FUEL_BY_COMPANY.map(c => ({ ...c, value: c.liters, label: c.name.replace(" ทรานสปอร์ต","").replace("ขนส่ง","").replace(" ทรานส์","") }))} valueKey="value" labelKey="label" suffix=" ล."/>
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h3>การเติมล่าสุด</h3><span className="text-xs text-muted">5 นาทีล่าสุด</span></div>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>เวลา</th><th>ทะเบียน</th><th>คนขับ</th><th style={{textAlign:"right"}}>ลิตร</th><th style={{textAlign:"right"}}>ราคา</th></tr></thead>
              <tbody>
                {[
                  ["14:31", "40-1234 อย", "สมชาย ใจดี",       78, 2535],
                  ["14:29", "30-1471 อย", "วิชัย พิมพ์ทอง",    92, 2990],
                  ["14:22", "41-1521 ปท", "เอกชัย เจริญสุข",   65, 2113],
                  ["14:14", "31-1318 ลบ", "บุญเลิศ จันทร์เพ็ญ", 88, 2860],
                  ["14:08", "10-3119 อย", "ธนกร แสงทอง",      54, 1755],
                ].map((r, i) => (
                  <tr key={i}>
                    <td className="mono">{r[0]}</td>
                    <td className="mono tbl-cell-strong">{r[1]}</td>
                    <td>{r[2]}</td>
                    <td className="mono" style={{textAlign:"right"}}>{r[3]} ล.</td>
                    <td className="mono tbl-cell-strong" style={{textAlign:"right"}}>{formatBaht(r[4])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const License = () => {
  const rows = [
    { type: "ประกันชั้น 1",   target: "40-1234 อย",  issue: "2025-08-20", exp: "2026-08-20", days: 86 },
    { type: "ใบขับขี่ B2",    target: "ประยุทธ์ ศรีสุข", issue: "2022-06-21", exp: "2026-06-21", days: 26 },
    { type: "ภาษีรถ",         target: "30-1471 อย",  issue: "2025-09-10", exp: "2026-09-10", days: 107 },
    { type: "ประกันชั้น 1",   target: "31-1318 ลบ",  issue: "2025-06-22", exp: "2026-05-30", days: 4 },
    { type: "ใบขับขี่ B2",    target: "พิเชษฐ์ สุวรรณ",  issue: "2022-05-30", exp: "2026-05-30", days: 4 },
    { type: "ใบขับขี่ B1",    target: "ศุภชัย ดวงแก้ว",  issue: "2022-06-15", exp: "2026-06-15", days: 20 },
    { type: "ประกันชั้น 2+",  target: "10-3119 อย",  issue: "2024-07-12", exp: "2025-07-12", days: -319 },
  ];
  const tone = (d) => d <= 0 ? "badge-danger" : d <= 30 ? "badge-warning" : "badge-success";
  const label = (d) => d <= 0 ? "หมดอายุ" : d <= 30 ? "ใกล้หมดอายุ" : "ปกติ";
  return (
    <div>
      <div className="page-header">
        <div><h2>ใบขับขี่ & ประกันภัย</h2><div className="sub">ติดตามวันหมดอายุของเอกสารสำคัญ</div></div>
        <div className="flex gap-8">
          <button className="btn"><Icon name="filter" size={15}/> ตัวกรอง</button>
          <button className="btn btn-primary"><Icon name="plus" size={15}/> เพิ่มเอกสาร</button>
        </div>
      </div>
      <div className="kpi-grid mb-8" style={{marginBottom:16}}>
        <KPI tone="green" icon="shield" label="ปกติ (>30 วัน)"    value="142" foot=""/>
        <KPI tone="amber" icon="alert"  label="ใกล้หมดอายุ"        value="9"   foot="ภายใน 30 วัน"/>
        <KPI tone="red"   icon="alert"  label="หมดอายุแล้ว"        value="2"   foot="ต้องดำเนินการด่วน"/>
        <KPI tone="navy"  icon="id"     label="เอกสารทั้งหมด"      value="153" foot=""/>
      </div>
      <div className="card">
        <div className="toolbar">
          <div className="search"><span className="ico"><Icon name="search" size={15}/></span><input placeholder="ค้นหา…"/></div>
          <select><option>ทุกประเภท</option><option>ใบขับขี่</option><option>ประกัน</option><option>ภาษี</option></select>
          <select><option>ทุกสถานะ</option><option>ปกติ</option><option>ใกล้หมดอายุ</option><option>หมดอายุ</option></select>
        </div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr>
              <th>ประเภทเอกสาร</th><th>รถบัส / คนขับ</th><th>วันที่ออก</th><th>วันหมดอายุ</th><th style={{textAlign:"right"}}>วันที่เหลือ</th><th>สถานะ</th><th>เอกสาร</th>
            </tr></thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="row-click">
                  <td className="tbl-cell-strong">{r.type}</td>
                  <td className="mono">{r.target}</td>
                  <td className="text-muted">{r.issue}</td>
                  <td className="mono">{r.exp}</td>
                  <td className="mono" style={{textAlign:"right", color: r.days <= 0 ? "var(--danger)" : r.days <= 30 ? "var(--warning)" : "var(--success)", fontWeight:700}}>
                    {r.days <= 0 ? `เกิน ${-r.days}` : r.days} วัน
                  </td>
                  <td><span className={"badge " + tone(r.days)}><span className="dot"></span>{label(r.days)}</span></td>
                  <td><button className="btn btn-sm"><Icon name="eye" size={13}/> ดู</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Users = ({ onToast }) => {
  const initialUsers = [
    { id: 1, name: "พรทิพย์ น.",      email: "pornthip.n@bms.co.th",   role: "admin",     last: "วันนี้ 14:22" },
    { id: 2, name: "ธนพล ส.",        email: "thanapol.s@bms.co.th",   role: "admin",     last: "วันนี้ 11:08" },
    { id: 3, name: "สมหญิง พ.",      email: "somying.p@bms.co.th",    role: "operation", last: "วันนี้ 09:45" },
    { id: 4, name: "วราภรณ์ ก.",     email: "waraporn.k@bms.co.th",   role: "operation", last: "เมื่อวานนี้ 17:20" },
    { id: 5, name: "ภาณุพงษ์ ม.",    email: "panupong.m@bms.co.th",   role: "operation", last: "เมื่อวานนี้ 14:50" },
    { id: 6, name: "นพดล จ.",        email: "noppadol.j@bms.co.th",   role: "operation", last: "3 วันที่แล้ว" },
  ];
  const [users, setUsers] = useState(initialUsers);
  const [modalMode, setModalMode] = useState(null); // null | "add" | "edit"
  const [editing, setEditing] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const [form, setForm] = useState({ name: "", email: "", role: "operation", password: "", confirm: "" });
  const [errors, setErrors] = useState({});

  const openAdd = () => {
    setForm({ name: "", email: "", role: "operation", password: "", confirm: "" });
    setErrors({});
    setEditing(null);
    setModalMode("add");
  };
  const openEdit = (u) => {
    setForm({ name: u.name, email: u.email, role: u.role, password: "", confirm: "" });
    setErrors({});
    setEditing(u);
    setModalMode("edit");
  };
  const close = () => { setModalMode(null); setEditing(null); setErrors({}); };

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name = "กรุณากรอกชื่อ";
    if (!form.email.trim()) e.email = "กรุณากรอกอีเมล";
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = "รูปแบบอีเมลไม่ถูกต้อง";
    else {
      const dup = users.find(u => u.email.toLowerCase() === form.email.trim().toLowerCase() && (!editing || u.id !== editing.id));
      if (dup) e.email = "อีเมลนี้มีในระบบแล้ว";
    }
    if (modalMode === "add") {
      if (!form.password)             e.password = "กรุณาตั้งรหัสผ่าน";
      else if (form.password.length < 6) e.password = "อย่างน้อย 6 ตัวอักษร";
      if (form.password !== form.confirm) e.confirm = "รหัสผ่านไม่ตรงกัน";
    } else if (form.password) {
      if (form.password.length < 6) e.password = "อย่างน้อย 6 ตัวอักษร";
      if (form.password !== form.confirm) e.confirm = "รหัสผ่านไม่ตรงกัน";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = () => {
    if (!validate()) return;
    if (modalMode === "add") {
      const newU = {
        id: Math.max(...users.map(u => u.id)) + 1,
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        last: "ยังไม่เคยเข้าใช้",
      };
      setUsers([newU, ...users]);
      onToast?.({ msg: "เพิ่มผู้ใช้ " + newU.name + " สำเร็จ", kind: "success" });
    } else {
      setUsers(users.map(u => u.id === editing.id ? { ...u, name: form.name.trim(), email: form.email.trim(), role: form.role } : u));
      onToast?.({ msg: "บันทึกข้อมูล " + form.name + " สำเร็จ", kind: "success" });
    }
    close();
  };

  const removeUser = (u) => {
    setUsers(users.filter(x => x.id !== u.id));
    onToast?.({ msg: "ลบผู้ใช้ " + u.name + " แล้ว", kind: "danger" });
    setConfirmDel(null);
  };

  return (
    <div>
      <div className="page-header">
        <div><h2>การจัดการผู้ใช้งาน</h2><div className="sub">เฉพาะผู้ดูแลระบบ • รวม {users.length} บัญชี</div></div>
        <button className="btn btn-primary" onClick={openAdd}><Icon name="plus" size={15}/> เพิ่มผู้ใช้</button>
      </div>
      <div className="card">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>ชื่อ</th><th>อีเมล</th><th>บทบาท</th><th>เข้าใช้ระบบล่าสุด</th><th style={{textAlign:"right"}}>การจัดการ</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="user-cell">
                      <Avatar name={u.name}/>
                      <div><div className="user-name">{u.name}</div></div>
                    </div>
                  </td>
                  <td className="text-muted">{u.email}</td>
                  <td><span className={"role-badge " + (u.role === "admin" ? "role-admin" : "role-op")}>{u.role === "admin" ? "Admin" : "Operation"}</span></td>
                  <td className="text-muted">{u.last}</td>
                  <td>
                    <div className="tbl-actions">
                      <button className="icon-btn" title="แก้ไข" onClick={() => openEdit(u)}><Icon name="edit" size={15}/></button>
                      <button className="icon-btn" title="ลบ" onClick={() => setConfirmDel(u)}><Icon name="trash" size={15}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan="5" style={{textAlign:"center", padding:"40px 0", color:"var(--text-muted)"}}>ยังไม่มีผู้ใช้</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit modal */}
      {modalMode && (
        <div className="modal-scrim" onClick={close}>
          <div className="modal modal-form" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
            <button className="modal-close" onClick={close} aria-label="ปิด">
              <Icon name="close" size={18}/>
            </button>
            <div className="modal-form-head">
              <div className="modal-ico" style={{margin:0, width:42, height:42, borderRadius:10}}>
                <Icon name={modalMode === "add" ? "plus" : "edit"} size={20}/>
              </div>
              <div style={{textAlign:"left"}}>
                <h3 className="modal-title" style={{textAlign:"left", marginBottom:2}}>
                  {modalMode === "add" ? "เพิ่มผู้ใช้ใหม่" : "แก้ไขข้อมูลผู้ใช้"}
                </h3>
                <div className="text-muted text-xs">
                  {modalMode === "add" ? "กรอกข้อมูลให้ครบเพื่อสร้างบัญชีใหม่" : `กำลังแก้ไข: ${editing?.name}`}
                </div>
              </div>
            </div>

            <div className="modal-form-body">
              <div className="field">
                <label>ชื่อ — สกุล *</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className={errors.name ? "input-error" : ""}
                  placeholder="เช่น สมชาย ใจดี"
                  autoFocus
                />
                {errors.name && <div className="field-err">{errors.name}</div>}
              </div>

              <div className="field">
                <label>อีเมล *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className={errors.email ? "input-error" : ""}
                  placeholder="name@bms.co.th"
                />
                {errors.email && <div className="field-err">{errors.email}</div>}
              </div>

              <div className="field">
                <label>บทบาท *</label>
                <div className="role-picker">
                  <button
                    type="button"
                    className={"role-opt " + (form.role === "admin" ? "on" : "")}
                    onClick={() => setForm({ ...form, role: "admin" })}
                  >
                    <div className="role-opt-head">
                      <span className="role-badge role-admin">Admin</span>
                      {form.role === "admin" && <Icon name="check" size={14} style={{color:"var(--navy-700)"}}/>}
                    </div>
                    <div className="role-opt-desc">เข้าถึงทุกเมนู รวมถึงการจัดการผู้ใช้</div>
                  </button>
                  <button
                    type="button"
                    className={"role-opt " + (form.role === "operation" ? "on" : "")}
                    onClick={() => setForm({ ...form, role: "operation" })}
                  >
                    <div className="role-opt-head">
                      <span className="role-badge role-op">Operation</span>
                      {form.role === "operation" && <Icon name="check" size={14} style={{color:"var(--navy-700)"}}/>}
                    </div>
                    <div className="role-opt-desc">ใช้งานทั่วไป (ไม่เห็นเมนู User Management)</div>
                  </button>
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label>{modalMode === "add" ? "รหัสผ่าน *" : "รหัสผ่านใหม่"}</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className={errors.password ? "input-error" : ""}
                    placeholder={modalMode === "edit" ? "เว้นว่างเพื่อไม่เปลี่ยน" : "อย่างน้อย 6 ตัวอักษร"}
                  />
                  {errors.password && <div className="field-err">{errors.password}</div>}
                </div>
                <div className="field">
                  <label>ยืนยันรหัสผ่าน{modalMode === "add" ? " *" : ""}</label>
                  <input
                    type="password"
                    value={form.confirm}
                    onChange={e => setForm({ ...form, confirm: e.target.value })}
                    className={errors.confirm ? "input-error" : ""}
                    placeholder="กรอกรหัสผ่านอีกครั้ง"
                  />
                  {errors.confirm && <div className="field-err">{errors.confirm}</div>}
                </div>
              </div>
            </div>

            <div className="modal-form-foot">
              <button className="btn" onClick={close}>ยกเลิก</button>
              <button className="btn btn-primary" onClick={save}>
                <Icon name="check" size={15}/> {modalMode === "add" ? "เพิ่มผู้ใช้" : "บันทึก"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm delete */}
      {confirmDel && (
        <div className="modal-scrim" onClick={() => setConfirmDel(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-ico" style={{background:"var(--danger-50)", color:"var(--danger)"}}>
              <Icon name="trash" size={22}/>
            </div>
            <h3 className="modal-title">ยืนยันการลบผู้ใช้</h3>
            <p className="modal-text">คุณต้องการลบผู้ใช้ <strong style={{color:"var(--text-strong)"}}>{confirmDel.name}</strong> ใช่หรือไม่? การลบไม่สามารถย้อนกลับได้</p>
            <div className="flex gap-8" style={{justifyContent:"center"}}>
              <button className="btn" onClick={() => setConfirmDel(null)}>ยกเลิก</button>
              <button className="btn btn-danger" onClick={() => removeUser(confirmDel)}>
                <Icon name="trash" size={15}/> ลบผู้ใช้
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Training = () => <PlaceholderPage title="การอบรมพนักงานขับรถ" items={[
  "ตารางการอบรมที่กำลังจะมาถึง", "หลักสูตรและประกาศนียบัตร",
  "ประวัติการอบรมรายบุคคล", "แจ้งเตือนการอบรมหมดอายุ",
  "อัปโหลดเอกสารประกาศนียบัตร", "รายงานการเข้าร่วมอบรม",
]}/>;

const Complaint = () => <PlaceholderPage title="เรื่องร้องเรียนของลูกค้า" items={[
  "รายการเรื่องร้องเรียนใหม่", "การมอบหมายผู้รับผิดชอบ",
  "ติดตามสถานะการแก้ไข", "บันทึกการตอบกลับลูกค้า",
  "สถิติเรื่องร้องเรียนรายเดือน", "หมวดหมู่ปัญหาที่พบบ่อย",
]}/>;

const Safety = () => <PlaceholderPage title="มาตรการความปลอดภัย" items={[
  "Checklist ก่อนออกเดินทาง", "บันทึกอุบัติเหตุและเหตุการณ์",
  "การตรวจสภาพรถประจำวัน", "อบรมความปลอดภัยขับขี่",
  "รายงาน KPI ความปลอดภัย", "การวิเคราะห์เหตุที่เกิดขึ้น",
]}/>;

const Purchase = () => <PlaceholderPage title="การจัดซื้อ" items={[
  "ใบขอซื้อ (PR)", "ใบสั่งซื้อ (PO)",
  "ผู้ขาย / ผู้รับจ้าง", "รายการอะไหล่และสต็อก",
  "การอนุมัติหลายระดับ", "รายงานค่าใช้จ่ายการจัดซื้อ",
]}/>;

Object.assign(window, { Maintenance, CostControl, Fuel, License, Users, Training, Complaint, Safety, Purchase });
