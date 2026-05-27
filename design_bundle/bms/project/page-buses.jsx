/* ============================
   BMS — Bus Fleet page
   ============================ */

const Buses = ({ onToast }) => {
  const [type, setType] = useState("air"); // air | fan
  const [view, setView] = useState("card"); // card | table
  const [factory, setFactory] = useState("all");
  const [company, setCompany] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("info");
  const [addOpen, setAddOpen] = useState(false);

  const airCount = BUSES.filter(b => b.type === "air").length;
  const fanCount = BUSES.filter(b => b.type === "fan").length;

  const filtered = useMemo(() => {
    return BUSES.filter(b => {
      if (b.type !== type) return false;
      if (factory !== "all" && b.factory !== factory) return false;
      if (company !== "all" && b.companyId !== company) return false;
      if (status  !== "all" && b.status  !== status)  return false;
      if (search && !(b.plate.toLowerCase().includes(search.toLowerCase()) || b.driver.includes(search) || b.brand.toLowerCase().includes(search.toLowerCase()) || (b.company || "").includes(search))) return false;
      return true;
    });
  }, [type, factory, company, status, search]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>รถบัส</h2>
          <div className="sub">รวม {BUSES.length} คัน ทั่ว 3 โรงงาน • ใช้งาน {BUSES.filter(b=>b.status==="active").length} • ซ่อม {BUSES.filter(b=>b.status==="maintenance").length} • ปลดระวาง {BUSES.filter(b=>b.status==="retired").length}</div>
        </div>
        <div className="flex gap-8">
          <button className="btn"><Icon name="download" size={15}/> Export</button>
          <button className="btn btn-primary" onClick={() => setAddOpen(true)}>
            <Icon name="plus" size={15}/> เพิ่มรถบัส
          </button>
        </div>
      </div>

      {/* Type toggle + view toggle */}
      <div className="flex items-center justify-between mb-8" style={{marginBottom:14}}>
        <div className="seg">
          <button className={type === "air" ? "on" : ""} onClick={() => setType("air")}>
            <Icon name="snow" size={14}/> รถปรับอากาศ <span className="count">{airCount}</span>
          </button>
          <button className={type === "fan" ? "on" : ""} onClick={() => setType("fan")}>
            <Icon name="fan" size={14}/> รถพัดลม <span className="count">{fanCount}</span>
          </button>
        </div>
        <div className="seg">
          <button className={view === "card" ? "on" : ""} onClick={() => setView("card")} title="Card view">
            <Icon name="bus" size={14}/> การ์ด
          </button>
          <button className={view === "table" ? "on" : ""} onClick={() => setView("table")} title="Table view">
            <Icon name="id" size={14}/> ตาราง
          </button>
        </div>
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
          <select value={company} onChange={e => setCompany(e.target.value)}>
            <option value="all">ทุกบริษัทขนส่ง</option>
            {TRANSPORT_COMPANIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="all">ทุกสถานะ</option>
            <option value="active">Active</option>
            <option value="maintenance">In Maintenance</option>
            <option value="retired">Retired</option>
          </select>
          <div className="toolbar-spacer"></div>
          <div className="result-count">{filtered.length} คัน</div>
        </div>

        {view === "card" ? (
          <div className="bus-grid">
            {filtered.map(b => (
              <div className="bus-card" key={b.id} onClick={() => { setSelected(b); setTab("info"); }}>
                <div className="bus-card-head">
                  <div>
                    <div className="plate">{b.plate}</div>
                    <div className="meta">{b.brand} • ปี {b.year}</div>
                  </div>
                  <StatusBadge status={b.status}/>
                </div>
                <div className="body">
                  <div className={"bus-illust " + (b.type === "fan" ? "fan" : "")}>
                    <Icon name={b.type === "air" ? "snow" : "fan"} size={20}/>
                  </div>
                  <div style={{flex:1, minWidth:0}}>
                    <div className="driver-line">
                      <div className="driver-avatar">{initials(b.driver)}</div>
                      <span style={{whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{b.driver}</span>
                    </div>
                    <div className="text-muted text-xs mt-4">
                      <Icon name="factory" size={11} style={{verticalAlign:"-2px"}}/> {b.factory} • {b.seats} ที่นั่ง
                    </div>
                    <div className="text-muted text-xs mt-4" style={{whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}} title={b.company}>
                      <Icon name="building" size={11} style={{verticalAlign:"-2px"}}/> {b.company}
                    </div>
                  </div>
                </div>
                <div className="stats">
                  <div>
                    <div className="stat-label">เลขไมล์</div>
                    <div className="stat-val">{formatNumber(b.currentKm)} กม.</div>
                  </div>
                  <div>
                    <div className="stat-label">บำรุงรักษาครั้งล่าสุด</div>
                    <div className="stat-val">{b.lastService}</div>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{gridColumn:"1 / -1", textAlign:"center", padding:"40px 0", color:"var(--text-muted)"}}>
                ไม่พบรถบัสตามเงื่อนไขที่เลือก
              </div>
            )}
          </div>
        ) : (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>ทะเบียน</th>
                  <th>ยี่ห้อ / รุ่น</th>
                  <th>บริษัทขนส่ง</th>
                  <th>โรงงาน</th>
                  <th>คนขับ</th>
                  <th style={{textAlign:"right"}}>เลขไมล์</th>
                  <th>บำรุงรักษาล่าสุด</th>
                  <th>สถานะ</th>
                  <th style={{textAlign:"right"}}>การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b.id} className="row-click" onClick={() => { setSelected(b); setTab("info"); }}>
                    <td>
                      <div className="flex items-center gap-8">
                        <div className={"bus-illust " + (b.type === "fan" ? "fan" : "")} style={{width:40, height:28}}>
                          <Icon name={b.type === "air" ? "snow" : "fan"} size={14}/>
                        </div>
                        <span className="mono tbl-cell-strong">{b.plate}</span>
                      </div>
                    </td>
                    <td>
                      <div className="tbl-cell-strong">{b.brand}</div>
                      <div className="text-muted text-xs">{b.model} • {b.year}</div>
                    </td>
                    <td>
                      <div className="flex items-center gap-8" style={{maxWidth:180}}>
                        <span className="company-chip mono">{(TRANSPORT_COMPANIES.find(c => c.id === b.companyId) || {}).code || "—"}</span>
                        <span style={{fontSize:12.5, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}} title={b.company}>{b.company}</span>
                      </div>
                    </td>
                    <td>{b.factory}</td>
                    <td>
                      <div className="user-cell">
                        <Avatar name={b.driver} size={24}/>
                        <span style={{fontSize:13}}>{b.driver}</span>
                      </div>
                    </td>
                    <td className="mono" style={{textAlign:"right"}}>{formatNumber(b.currentKm)}</td>
                    <td className="text-muted">{b.lastService}</td>
                    <td><StatusBadge status={b.status}/></td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className="tbl-actions">
                        <button className="icon-btn" title="ดู"><Icon name="eye" size={15}/></button>
                        <button className="icon-btn" title="แก้ไข"><Icon name="edit" size={15}/></button>
                        <button className="icon-btn" title="เพิ่มเติม"><Icon name="moreV" size={15}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan="9" style={{textAlign:"center", padding:"40px 0", color:"var(--text-muted)"}}>
                    ไม่พบรถบัสตามเงื่อนไขที่เลือก
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Drawer
        open={!!selected}
        title={selected ? `รถบัส • ${selected.plate}` : ""}
        onClose={() => setSelected(null)}
        footer={
          <>
            <button className="btn" onClick={() => setSelected(null)}>ปิด</button>
            <button className="btn btn-primary" onClick={() => { onToast?.({msg:"บันทึกข้อมูล " + selected.plate, kind:"success"}); setSelected(null); }}>
              <Icon name="check" size={15}/> บันทึก
            </button>
          </>
        }
      >
        {selected && <BusDetail bus={selected} tab={tab} setTab={setTab}/>}
      </Drawer>

      <Drawer
        open={addOpen}
        title="เพิ่มรถบัสใหม่"
        onClose={() => setAddOpen(false)}
        footer={
          <>
            <button className="btn" onClick={() => setAddOpen(false)}>ยกเลิก</button>
            <button className="btn btn-primary" onClick={() => { onToast?.({msg:"เพิ่มรถบัสสำเร็จ", kind:"success"}); setAddOpen(false); }}>
              <Icon name="check" size={15}/> เพิ่มข้อมูล
            </button>
          </>
        }
      >
        <AddBusForm/>
      </Drawer>
    </div>
  );
};

const BusDetail = ({ bus, tab, setTab }) => {
  const kmToNext = bus.nextServiceKm - bus.currentKm;
  // Assume cycle of 10000 km
  const cycle = 10000;
  const pct = Math.max(0, Math.min(100, ((cycle - kmToNext) / cycle) * 100));

  return (
    <div>
      <div style={{display:"flex", alignItems:"center", gap:14, paddingBottom:18, borderBottom:"1px solid var(--border)", marginBottom:18}}>
        <div className={"bus-illust " + (bus.type === "fan" ? "fan" : "")} style={{width:64, height:46}}>
          <Icon name={bus.type === "air" ? "snow" : "fan"} size={22}/>
        </div>
        <div style={{flex:1}}>
          <div className="mono" style={{fontSize:20, fontWeight:700, color:"var(--text-strong)", letterSpacing:0.4}}>{bus.plate}</div>
          <div className="text-muted" style={{fontSize:12.5}}>{bus.brand} {bus.model} • ปี {bus.year} • {bus.seats} ที่นั่ง</div>
          <div className="mt-4 flex gap-8">
            <StatusBadge status={bus.status}/>
            <span className="badge badge-navy">{bus.factory}</span>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button className={tab === "info"        ? "on" : ""} onClick={() => setTab("info")}>ข้อมูลทั่วไป</button>
        <button className={tab === "maintenance" ? "on" : ""} onClick={() => setTab("maintenance")}>ประวัติซ่อม</button>
        <button className={tab === "insurance"   ? "on" : ""} onClick={() => setTab("insurance")}>ประกัน / ภาษี</button>
      </div>

      {tab === "info" && (
        <>
          <div className="field-row">
            <div className="field">
              <label>ทะเบียนรถ</label>
              <input defaultValue={bus.plate}/>
            </div>
            <div className="field">
              <label>รหัสรถ</label>
              <input defaultValue={bus.id} disabled style={{background:"var(--surface-2)"}}/>
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>ยี่ห้อ</label>
              <input defaultValue={bus.brand}/>
            </div>
            <div className="field">
              <label>รุ่น</label>
              <input defaultValue={bus.model}/>
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>ปีที่ผลิต</label>
              <input defaultValue={bus.year}/>
            </div>
            <div className="field">
              <label>จำนวนที่นั่ง</label>
              <input defaultValue={bus.seats}/>
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>โรงงาน</label>
              <select defaultValue={bus.factory}>
                {FACTORIES.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div className="field">
              <label>สถานะ</label>
              <select defaultValue={bus.status}>
                <option value="active">Active</option>
                <option value="maintenance">In Maintenance</option>
                <option value="retired">Retired</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label>บริษัทขนส่ง *</label>
            <select defaultValue={bus.companyId}>
              {TRANSPORT_COMPANIES.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
            </select>
          </div>
          <div className="field">
            <label>คนขับประจำ</label>
            <select defaultValue={bus.driverId}>
              {DRIVERS.map(d => <option key={d.id} value={d.id}>{d.name} ({d.id})</option>)}
            </select>
          </div>
          <div className="field-row">
            <div className="field">
              <label>เลขไมล์ปัจจุบัน</label>
              <input className="mono" defaultValue={bus.currentKm}/>
            </div>
            <div className="field">
              <label>เลขไมล์บำรุงรักษาครั้งถัดไป</label>
              <input className="mono" defaultValue={bus.nextServiceKm}/>
            </div>
          </div>

          <div className="card" style={{boxShadow:"none", marginTop:12}}>
            <div className="card-body">
              <div className="flex justify-between mb-8">
                <span className="text-xs text-muted" style={{textTransform:"uppercase", fontWeight:600, letterSpacing:"0.04em"}}>ครบรอบบำรุงรักษา</span>
                <span className="mono text-strong" style={{fontWeight:700}}>{kmToNext.toLocaleString()} กม. เหลือ</span>
              </div>
              <Progress pct={pct}/>
              <div className="text-xs text-muted mt-8">บำรุงรักษาครั้งล่าสุด {bus.lastService} • รอบถัดไปที่ {bus.nextServiceKm.toLocaleString()} กม.</div>
            </div>
          </div>
        </>
      )}

      {tab === "maintenance" && (
        <div>
          <div className="card" style={{boxShadow:"none", marginBottom:14}}>
            <div className="card-body" style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, textAlign:"center"}}>
              <div>
                <div className="mono" style={{fontSize:20,fontWeight:700, color:"var(--navy-700)"}}>14</div>
                <div className="text-muted text-xs">บำรุงรักษารวม</div>
              </div>
              <div>
                <div className="mono" style={{fontSize:20,fontWeight:700, color:"var(--warning)"}}>2</div>
                <div className="text-muted text-xs">เหตุขัดข้อง</div>
              </div>
              <div>
                <div className="mono" style={{fontSize:20,fontWeight:700, color:"var(--text-strong)"}}>฿42K</div>
                <div className="text-muted text-xs">ค่าใช้จ่ายรวม</div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-8" style={{marginBottom:10}}>
            <h4 style={{margin:0, fontSize:13, color:"var(--text-strong)"}}>ประวัติย้อนหลัง</h4>
            <button className="btn btn-amber btn-sm"><Icon name="plus" size={13}/> บันทึกใหม่</button>
          </div>

          {[
            { date: bus.lastService, type: "ตามแผน",  desc: "เปลี่ยนน้ำมันเครื่อง, ไส้กรอง",   cost: 3800, km: bus.currentKm - 200, tag: "scheduled" },
            { date: "2026-02-20",   type: "ตามแผน",  desc: "ตรวจระบบเบรก, ผ้าเบรกหน้า",      cost: 4500, km: bus.currentKm - 9800, tag: "scheduled" },
            { date: "2025-12-08",   type: "ขัดข้อง",  desc: "แบตเตอรี่เสีย เปลี่ยนใหม่",      cost: 5200, km: bus.currentKm - 18500, tag: "breakdown" },
            { date: "2025-09-22",   type: "ตามแผน",  desc: "บำรุงรักษาประจำ 8 รายการ",       cost: 6100, km: bus.currentKm - 28000, tag: "scheduled" },
          ].map((m, i) => (
            <div key={i} style={{display:"flex", padding:"12px 0", borderBottom:"1px solid var(--border)", gap:12, alignItems:"flex-start"}}>
              <div style={{width:32, height:32, borderRadius:8, background: m.tag === "breakdown" ? "#fee2e2" : "#dbeafe", color: m.tag === "breakdown" ? "#b91c1c" : "#1d4ed8", display:"grid", placeItems:"center", flexShrink:0}}>
                <Icon name={m.tag === "breakdown" ? "alert" : "wrench"} size={14}/>
              </div>
              <div style={{flex:1, minWidth:0}}>
                <div className="flex justify-between" style={{fontSize:13}}>
                  <span className="text-strong" style={{fontWeight:600}}>{m.desc}</span>
                  <span className="mono text-strong" style={{fontWeight:700}}>{formatBaht(m.cost)}</span>
                </div>
                <div className="text-muted text-xs mt-4">{m.date} • {m.type} • เลขไมล์ {formatNumber(m.km)} กม.</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "insurance" && (
        <div>
          <div className="field-row">
            <div className="field">
              <label>ประกันภัยชั้น</label>
              <select defaultValue="1">
                <option value="1">ชั้น 1</option>
                <option value="2">ชั้น 2+</option>
                <option value="3">ชั้น 3</option>
              </select>
            </div>
            <div className="field">
              <label>บริษัทประกัน</label>
              <input defaultValue="วิริยะประกันภัย"/>
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>วันที่เริ่ม</label>
              <input type="date" defaultValue="2025-08-20"/>
            </div>
            <div className="field">
              <label>วันหมดอายุ</label>
              <input type="date" defaultValue={bus.insuranceExp}/>
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>เลขที่กรมธรรม์</label>
              <input className="mono" defaultValue="VIR-2025-088421"/>
            </div>
            <div className="field">
              <label>เบี้ยประกันต่อปี</label>
              <input className="mono" defaultValue="฿28,500"/>
            </div>
          </div>

          <h4 style={{margin:"22px 0 8px", fontSize:13, color:"var(--text-strong)"}}>ภาษี / พ.ร.บ.</h4>
          <div className="field-row">
            <div className="field">
              <label>วันต่อภาษีล่าสุด</label>
              <input type="date" defaultValue="2025-09-10"/>
            </div>
            <div className="field">
              <label>วันหมดอายุ</label>
              <input type="date" defaultValue={bus.taxExp}/>
            </div>
          </div>

          <h4 style={{margin:"22px 0 8px", fontSize:13, color:"var(--text-strong)"}}>เอกสารแนบ</h4>
          <div style={{border:"1.5px dashed var(--border-strong)", borderRadius:8, padding:"22px 14px", textAlign:"center", color:"var(--text-muted)", fontSize:13, background:"var(--surface-2)"}}>
            <Icon name="upload" size={22} style={{display:"block", margin:"0 auto 6px", color:"var(--text-faint)"}}/>
            ลากไฟล์มาวาง หรือ <span style={{color:"var(--navy-700)", fontWeight:600, textDecoration:"underline", cursor:"pointer"}}>เลือกไฟล์</span><br/>
            <span className="text-xs">PDF, JPG, PNG • ไม่เกิน 10MB</span>
          </div>

          <div className="mt-16" style={{display:"flex", flexDirection:"column", gap:8}}>
            {[
              { name: "กรมธรรม์ประกันภัย 2569.pdf", size: "1.2 MB" },
              { name: "ใบเสร็จภาษีรถ 2569.pdf", size: "245 KB" },
              { name: "ใบ พ.ร.บ. 2569.jpg", size: "682 KB" },
            ].map((f, i) => (
              <div key={i} style={{display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:"var(--surface-2)", borderRadius:8, fontSize:13}}>
                <Icon name="id" size={16} style={{color:"var(--info)"}}/>
                <span className="text-strong" style={{flex:1, fontWeight:600}}>{f.name}</span>
                <span className="text-muted text-xs mono">{f.size}</span>
                <button className="icon-btn" style={{width:26, height:26}}><Icon name="download" size={14}/></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const AddBusForm = () => (
  <>
    <div className="field-row">
      <div className="field">
        <label>ทะเบียนรถ *</label>
        <input placeholder="เช่น 40-1234 อย"/>
      </div>
      <div className="field">
        <label>ประเภท *</label>
        <select><option>รถปรับอากาศ</option><option>รถพัดลม</option></select>
      </div>
    </div>
    <div className="field-row">
      <div className="field">
        <label>ยี่ห้อ *</label>
        <select><option>Hino</option><option>Isuzu</option><option>Mitsubishi Fuso</option><option>Volvo</option><option>Sunlong</option></select>
      </div>
      <div className="field">
        <label>รุ่น *</label>
        <input placeholder="เช่น RK1J"/>
      </div>
    </div>
    <div className="field-row">
      <div className="field"><label>ปีที่ผลิต *</label><input placeholder="2024"/></div>
      <div className="field"><label>จำนวนที่นั่ง *</label><input placeholder="50"/></div>
    </div>
    <div className="field-row">
      <div className="field">
        <label>โรงงาน *</label>
        <select>{FACTORIES.map(f => <option key={f}>{f}</option>)}</select>
      </div>
      <div className="field">
        <label>บริษัทขนส่ง *</label>
        <select>
          <option value="">— เลือกบริษัท —</option>
          {TRANSPORT_COMPANIES.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
        </select>
      </div>
    </div>
    <div className="field">
      <label>คนขับประจำ</label>
      <select><option value="">— ยังไม่กำหนด —</option>{DRIVERS.map(d => <option key={d.id}>{d.name}</option>)}</select>
    </div>
    <div className="field-row">
      <div className="field"><label>เลขไมล์เริ่มต้น *</label><input className="mono" placeholder="0"/></div>
      <div className="field"><label>เลขไมล์บำรุงรักษาครั้งถัดไป</label><input className="mono" placeholder="10,000"/></div>
    </div>
    <div className="field">
      <label>หมายเหตุ</label>
      <textarea rows="3" placeholder="ข้อมูลเพิ่มเติม..."/>
    </div>
  </>
);

window.Buses = Buses;
