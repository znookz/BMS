/* ============================
   BMS — Driver Management page
   ============================ */

const Drivers = ({ onToast }) => {
  const [search, setSearch] = useState("");
  const [factory, setFactory] = useState("all");
  const [route, setRoute] = useState("all");
  const [shift, setShift] = useState("all");
  const [status, setStatus] = useState("all");
  const [sortKey, setSortKey] = useState("id");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("info");
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(() => {
    let rows = DRIVERS.filter(d => {
      if (search && !(d.name.includes(search) || d.id.toLowerCase().includes(search.toLowerCase()) || d.phone.includes(search))) return false;
      if (factory !== "all" && d.factory !== factory) return false;
      if (route   !== "all" && d.route   !== route)   return false;
      if (shift   !== "all" && String(d.shift) !== shift) return false;
      if (status  !== "all" && d.status  !== status)  return false;
      return true;
    });
    rows.sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      return (av < bv ? -1 : av > bv ? 1 : 0) * (sortDir === "asc" ? 1 : -1);
    });
    return rows;
  }, [search, factory, route, shift, status, sortKey, sortDir]);

  const pageRows = filtered.slice((page-1)*pageSize, page*pageSize);
  useEffect(() => { setPage(1); }, [search, factory, route, shift, status]);

  const toggleSort = (k) => {
    if (sortKey === k) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir("asc"); }
  };

  const Th = ({ k, children, align }) => (
    <th
      className={"sortable " + (sortKey === k ? "sorted" : "")}
      onClick={() => toggleSort(k)}
      style={{textAlign: align || "left"}}
    >
      {children}
      <span className="sort-ind">{sortKey === k ? (sortDir === "asc" ? "▲" : "▼") : "↕"}</span>
    </th>
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>พนักงานขับรถ</h2>
          <div className="sub">รวม {DRIVERS.length} คน • ใช้งาน {DRIVERS.filter(d=>d.status==="active").length} คน • ไม่ใช้งาน {DRIVERS.filter(d=>d.status==="inactive").length} คน</div>
        </div>
        <div className="flex gap-8">
          <button className="btn"><Icon name="download" size={15}/> Export</button>
          <button className="btn btn-primary" onClick={() => setAddOpen(true)}>
            <Icon name="plus" size={15}/> เพิ่มพนักงานขับรถ
          </button>
        </div>
      </div>

      <div className="card">
        <div className="toolbar">
          <div className="search">
            <span className="ico"><Icon name="search" size={15}/></span>
            <input
              placeholder="ค้นหา ชื่อ, รหัส, เบอร์โทร…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select value={factory} onChange={e => setFactory(e.target.value)}>
            <option value="all">ทุกโรงงาน</option>
            {FACTORIES.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <select value={route} onChange={e => setRoute(e.target.value)}>
            <option value="all">ทุกเส้นทาง</option>
            {ROUTES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select value={shift} onChange={e => setShift(e.target.value)}>
            <option value="all">ทุกกะ</option>
            {SHIFTS.map((s, i) => <option key={i} value={String(i)}>{s}</option>)}
          </select>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="all">ทุกสถานะ</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="toolbar-spacer"></div>
          <div className="result-count">{filtered.length} ผลลัพธ์</div>
        </div>

        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <Th k="id">รหัส</Th>
                <Th k="name">ชื่อ — สกุล</Th>
                <th>เลขบัตรประชาชน</th>
                <Th k="factory">โรงงาน</Th>
                <Th k="route">เส้นทาง</Th>
                <Th k="shift">กะ</Th>
                <Th k="status">สถานะ</Th>
                <th style={{textAlign:"right"}}>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map(d => (
                <tr key={d.id} className="row-click" onClick={() => { setSelected(d); setTab("info"); }}>
                  <td className="mono tbl-cell-strong">{d.id}</td>
                  <td>
                    <div className="user-cell">
                      <Avatar name={d.name} />
                      <div>
                        <div className="user-name">{d.name}</div>
                        <div className="user-sub">{d.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="mono text-muted">{d.idCard}</td>
                  <td>{d.factory}</td>
                  <td>{d.route}</td>
                  <td className="text-muted">{SHIFTS[d.shift].split(" ")[0]}</td>
                  <td><StatusBadge status={d.status}/></td>
                  <td onClick={e => e.stopPropagation()}>
                    <div className="tbl-actions">
                      <button className="icon-btn" title="ดู" onClick={() => { setSelected(d); setTab("info"); }}>
                        <Icon name="eye" size={15}/>
                      </button>
                      <button className="icon-btn" title="แก้ไข" onClick={() => onToast?.({msg:"เปิดแก้ไข " + d.name, kind:"success"})}>
                        <Icon name="edit" size={15}/>
                      </button>
                      <button className="icon-btn" title="เพิ่มเติม">
                        <Icon name="moreV" size={15}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr><td colSpan="8" style={{textAlign:"center", padding:"40px 0", color:"var(--text-muted)"}}>
                  ไม่พบข้อมูลตามเงื่อนไขที่เลือก
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination page={page} pageSize={pageSize} total={filtered.length} onChange={setPage}/>
      </div>

      {/* Detail drawer */}
      <Drawer
        open={!!selected}
        title={selected ? `พนักงานขับรถ • ${selected.name}` : ""}
        onClose={() => setSelected(null)}
        footer={
          <>
            <button className="btn" onClick={() => setSelected(null)}>ปิด</button>
            <button className="btn btn-primary" onClick={() => { onToast?.({msg:"บันทึกข้อมูล " + selected.name, kind:"success"}); setSelected(null); }}>
              <Icon name="check" size={15}/> บันทึก
            </button>
          </>
        }
      >
        {selected && <DriverDetail driver={selected} tab={tab} setTab={setTab}/>}
      </Drawer>

      {/* Add drawer */}
      <Drawer
        open={addOpen}
        title="เพิ่มพนักงานขับรถใหม่"
        onClose={() => setAddOpen(false)}
        footer={
          <>
            <button className="btn" onClick={() => setAddOpen(false)}>ยกเลิก</button>
            <button className="btn btn-primary" onClick={() => { onToast?.({msg:"เพิ่มพนักงานขับรถสำเร็จ", kind:"success"}); setAddOpen(false); }}>
              <Icon name="check" size={15}/> เพิ่มข้อมูล
            </button>
          </>
        }
      >
        <AddDriverForm/>
      </Drawer>
    </div>
  );
};

/* ----- Driver detail (drawer body) ----- */
const DriverDetail = ({ driver, tab, setTab }) => {
  return (
    <div>
      {/* Header card */}
      <div style={{display:"flex", alignItems:"center", gap:14, paddingBottom:18, borderBottom:"1px solid var(--border)", marginBottom:18}}>
        <div className="avatar-sm" style={{width:56, height:56, fontSize:18, background:"var(--navy-700)"}}>
          {initials(driver.name)}
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:17, fontWeight:700, color:"var(--text-strong)"}}>{driver.name}</div>
          <div className="text-muted" style={{fontSize:12.5}}>{driver.id} • {driver.phone}</div>
          <div className="mt-4 flex gap-8">
            <StatusBadge status={driver.status}/>
            <span className="badge badge-navy">ใบขับขี่ {driver.license}</span>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button className={tab === "info" ? "on" : ""} onClick={() => setTab("info")}>ข้อมูลทั่วไป</button>
        <button className={tab === "health" ? "on" : ""} onClick={() => setTab("health")}>บันทึกสุขภาพ</button>
        <button className={tab === "training" ? "on" : ""} onClick={() => setTab("training")}>ประวัติการอบรม</button>
      </div>

      {tab === "info" && (
        <>
          <div className="field-row">
            <div className="field">
              <label>ชื่อ — สกุล</label>
              <input defaultValue={driver.name}/>
            </div>
            <div className="field">
              <label>รหัสพนักงาน</label>
              <input defaultValue={driver.id} disabled style={{background:"var(--surface-2)"}}/>
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>เลขบัตรประชาชน</label>
              <input defaultValue={driver.idCard}/>
            </div>
            <div className="field">
              <label>เบอร์โทรศัพท์</label>
              <input defaultValue={driver.phone}/>
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>โรงงาน</label>
              <select defaultValue={driver.factory}>
                {FACTORIES.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div className="field">
              <label>กะการทำงาน</label>
              <select defaultValue={String(driver.shift)}>
                {SHIFTS.map((s, i) => <option key={i} value={i}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="field">
            <label>เส้นทางหลัก</label>
            <select defaultValue={driver.route}>
              {ROUTES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>

          <div className="field-row">
            <div className="field">
              <label>ใบขับขี่ประเภท</label>
              <input defaultValue={driver.license}/>
            </div>
            <div className="field">
              <label>วันหมดอายุใบขับขี่</label>
              <input type="date" defaultValue={driver.licenseExp}/>
            </div>
          </div>
          <div className="field">
            <label>วันที่เริ่มงาน</label>
            <input type="date" defaultValue={driver.joined}/>
            <span className="hint">ทำงานในระบบมา {Math.floor((Date.now() - new Date(driver.joined).getTime()) / (365*24*3600*1000))} ปี</span>
          </div>
        </>
      )}

      {tab === "health" && (
        <div>
          <div className="card" style={{boxShadow:"none", marginBottom: 14}}>
            <div className="card-head">
              <div>
                <h3>การตรวจสุขภาพล่าสุด</h3>
                <div className="sub">ตรวจเมื่อ {driver.lastHealth}</div>
              </div>
              <span className="badge badge-success"><span className="dot"></span>ผ่านเกณฑ์</span>
            </div>
            <div className="card-body" style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, fontSize:13}}>
              <div><div className="text-muted text-xs">น้ำหนัก</div><div className="mono text-strong" style={{fontWeight:700}}>72 กก.</div></div>
              <div><div className="text-muted text-xs">ส่วนสูง</div><div className="mono text-strong" style={{fontWeight:700}}>171 ซม.</div></div>
              <div><div className="text-muted text-xs">ความดันโลหิต</div><div className="mono text-strong" style={{fontWeight:700}}>122/80</div></div>
              <div><div className="text-muted text-xs">การมองเห็น</div><div className="mono text-strong" style={{fontWeight:700}}>20/20</div></div>
              <div><div className="text-muted text-xs">ตรวจสารเสพติด</div><div style={{color:"var(--success)",fontWeight:700}}>ผ่าน</div></div>
              <div><div className="text-muted text-xs">ตรวจครั้งถัดไป</div><div className="mono text-strong" style={{fontWeight:700}}>2026-10-02</div></div>
            </div>
          </div>

          <h4 style={{margin:"18px 0 8px", fontSize:13, color:"var(--text-strong)"}}>ประวัติการตรวจ</h4>
          {[
            { date: driver.lastHealth, result: "ผ่าน", note: "ปกติ" },
            { date: "2025-10-15", result: "ผ่าน", note: "ตรวจประจำปี" },
            { date: "2025-04-08", result: "ผ่าน", note: "ตรวจประจำปี" },
          ].map((h, i) => (
            <div key={i} style={{display:"flex", padding:"10px 0", borderBottom:"1px solid var(--border)", alignItems:"center", gap:12}}>
              <Icon name="check" size={14} style={{color:"var(--success)"}}/>
              <div style={{flex:1}}>
                <div className="text-strong" style={{fontSize:13, fontWeight:600}}>{h.note}</div>
                <div className="text-muted text-xs">{h.date}</div>
              </div>
              <span className="badge badge-success">{h.result}</span>
            </div>
          ))}
        </div>
      )}

      {tab === "training" && (
        <div>
          <div className="card" style={{boxShadow:"none", marginBottom:14}}>
            <div className="card-head">
              <div>
                <h3>สรุปการอบรม</h3>
                <div className="sub">รวม {driver.trainings} หลักสูตร</div>
              </div>
            </div>
            <div className="card-body" style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, textAlign:"center"}}>
              <div>
                <div className="mono" style={{fontSize:22,fontWeight:700, color:"var(--navy-700)"}}>{driver.trainings}</div>
                <div className="text-muted text-xs">หลักสูตรทั้งหมด</div>
              </div>
              <div>
                <div className="mono" style={{fontSize:22,fontWeight:700, color:"var(--success)"}}>{driver.trainings - 2}</div>
                <div className="text-muted text-xs">ผ่าน</div>
              </div>
              <div>
                <div className="mono" style={{fontSize:22,fontWeight:700, color:"var(--warning)"}}>2</div>
                <div className="text-muted text-xs">รอประเมิน</div>
              </div>
            </div>
          </div>

          <h4 style={{margin:"18px 0 8px", fontSize:13, color:"var(--text-strong)"}}>หลักสูตรล่าสุด</h4>
          {[
            { name: "การขับขี่ปลอดภัย — ระดับสูง", date: "2026-03-22", result: "ผ่าน", expire: "2027-03-22" },
            { name: "การตอบสนองเหตุฉุกเฉิน",        date: "2025-11-15", result: "ผ่าน", expire: "2026-11-15" },
            { name: "การให้บริการลูกค้า",            date: "2025-08-30", result: "ผ่าน", expire: "2026-08-30" },
            { name: "การประหยัดน้ำมัน Eco-drive",     date: "2025-05-12", result: "รอประเมิน", expire: "-" },
          ].map((t, i) => (
            <div key={i} style={{display:"flex", padding:"10px 0", borderBottom:"1px solid var(--border)", alignItems:"center", gap:12}}>
              <Icon name="cap" size={14} style={{color:"var(--info)"}}/>
              <div style={{flex:1}}>
                <div className="text-strong" style={{fontSize:13, fontWeight:600}}>{t.name}</div>
                <div className="text-muted text-xs">{t.date} • หมดอายุ {t.expire}</div>
              </div>
              <span className={"badge " + (t.result === "ผ่าน" ? "badge-success" : "badge-warning")}>{t.result}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ----- Add driver form ----- */
const AddDriverForm = () => (
  <>
    <div className="field-row">
      <div className="field">
        <label>ชื่อ — สกุล *</label>
        <input placeholder="เช่น สมชาย ใจดี"/>
      </div>
      <div className="field">
        <label>รหัสพนักงาน *</label>
        <input placeholder="D031" defaultValue="D031" disabled style={{background:"var(--surface-2)"}}/>
        <span className="hint">ระบบสร้างให้อัตโนมัติ</span>
      </div>
    </div>
    <div className="field-row">
      <div className="field">
        <label>เลขบัตรประชาชน *</label>
        <input placeholder="1-1234-56789-01-2"/>
      </div>
      <div className="field">
        <label>เบอร์โทรศัพท์ *</label>
        <input placeholder="08X-XXX-XXXX"/>
      </div>
    </div>
    <div className="field-row">
      <div className="field">
        <label>โรงงาน *</label>
        <select>{FACTORIES.map(f => <option key={f}>{f}</option>)}</select>
      </div>
      <div className="field">
        <label>กะการทำงาน *</label>
        <select>{SHIFTS.map((s, i) => <option key={i}>{s}</option>)}</select>
      </div>
    </div>
    <div className="field">
      <label>เส้นทางหลัก *</label>
      <select>{ROUTES.map(r => <option key={r}>{r}</option>)}</select>
    </div>
    <div className="field-row">
      <div className="field">
        <label>ใบขับขี่ประเภท *</label>
        <select><option>B1</option><option>B2</option></select>
      </div>
      <div className="field">
        <label>วันหมดอายุใบขับขี่ *</label>
        <input type="date"/>
      </div>
    </div>
    <div className="field">
      <label>วันที่เริ่มงาน *</label>
      <input type="date" defaultValue="2026-05-26"/>
    </div>
    <div className="field">
      <label>หมายเหตุ</label>
      <textarea rows="3" placeholder="ข้อมูลเพิ่มเติม..."/>
    </div>

    <div style={{padding:"14px", background:"var(--surface-2)", borderRadius:8, fontSize:12.5, color:"var(--text-muted)", display:"flex", gap:10}}>
      <Icon name="alert" size={16} style={{color:"var(--warning)", flexShrink:0, marginTop:1}}/>
      <span>เมื่อบันทึกแล้ว ระบบจะส่งอีเมลแจ้งหัวหน้าโรงงาน เพื่อให้กำหนดรถบัสและตารางการอบรม</span>
    </div>
  </>
);

window.Drivers = Drivers;
