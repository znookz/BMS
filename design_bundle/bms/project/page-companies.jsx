/* ============================
   BMS — Transport Company page
   Master data: list, search, add, edit, delete
   ============================ */

const Companies = ({ onToast }) => {
  const [companies, setCompanies] = useState(TRANSPORT_COMPANIES);
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [view, setView]           = useState("card"); // card | table
  const [modalMode, setModalMode] = useState(null);   // null | "add" | "edit"
  const [editing, setEditing]     = useState(null);
  const [detail, setDetail]       = useState(null);   // shown in side drawer
  const [confirmDel, setConfirmDel] = useState(null);

  // Form state
  const empty = {
    code: "", name: "", nameEn: "",
    contact: "", phone: "", email: "",
    address: "", taxId: "",
    contractStart: "", contractEnd: "", rate: "",
    status: "active", note: "",
  };
  const [form, setForm]   = useState(empty);
  const [errors, setErrors] = useState({});

  // Bus count per company
  const busCountById = useMemo(() => {
    const m = {};
    BUSES.forEach(b => { m[b.companyId] = (m[b.companyId] || 0) + 1; });
    return m;
  }, []);

  const filtered = useMemo(() => {
    return companies.filter(c => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!(
          c.name.toLowerCase().includes(q) ||
          (c.nameEn || "").toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.contact.toLowerCase().includes(q) ||
          c.phone.includes(search)
        )) return false;
      }
      return true;
    });
  }, [companies, search, statusFilter]);

  const stat = useMemo(() => ({
    total:   companies.length,
    active:  companies.filter(c => c.status === "active").length,
    renewal: companies.filter(c => c.status === "renewal").length,
    buses:   BUSES.length,
  }), [companies]);

  const openAdd = () => {
    setForm(empty);
    setErrors({});
    setEditing(null);
    setModalMode("add");
  };
  const openEdit = (c) => {
    setForm({
      code: c.code, name: c.name, nameEn: c.nameEn || "",
      contact: c.contact, phone: c.phone, email: c.email,
      address: c.address, taxId: c.taxId || "",
      contractStart: c.contractStart || "", contractEnd: c.contractEnd || "",
      rate: c.rate ? String(c.rate) : "",
      status: c.status, note: c.note || "",
    });
    setErrors({});
    setEditing(c);
    setModalMode("edit");
    setDetail(null);
  };
  const close = () => { setModalMode(null); setEditing(null); setErrors({}); };

  const validate = () => {
    const e = {};
    if (!form.code.trim()) e.code = "กรุณากรอกรหัส";
    else {
      const dup = companies.find(c => c.code.toLowerCase() === form.code.trim().toLowerCase() && (!editing || c.id !== editing.id));
      if (dup) e.code = "รหัสนี้มีในระบบแล้ว";
    }
    if (!form.name.trim())    e.name    = "กรุณากรอกชื่อบริษัท";
    if (!form.contact.trim()) e.contact = "กรุณากรอกผู้ติดต่อ";
    if (!form.phone.trim())   e.phone   = "กรุณากรอกเบอร์โทร";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = "รูปแบบอีเมลไม่ถูกต้อง";
    if (form.rate && isNaN(Number(form.rate))) e.rate = "ต้องเป็นตัวเลข";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = () => {
    if (!validate()) return;
    const payload = {
      code: form.code.trim().toUpperCase(),
      name: form.name.trim(),
      nameEn: form.nameEn.trim(),
      contact: form.contact.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      taxId: form.taxId.trim(),
      contractStart: form.contractStart,
      contractEnd: form.contractEnd,
      rate: form.rate ? Number(form.rate) : 0,
      status: form.status,
      note: form.note.trim(),
    };
    if (modalMode === "add") {
      const maxN = companies.reduce((m, c) => {
        const n = parseInt((c.id || "TC000").slice(2), 10) || 0;
        return Math.max(m, n);
      }, 0);
      const newC = { id: "TC" + String(maxN + 1).padStart(3, "0"), ...payload };
      setCompanies([newC, ...companies]);
      onToast?.({ msg: "เพิ่มบริษัท " + newC.name + " สำเร็จ", kind: "success" });
    } else {
      setCompanies(companies.map(c => c.id === editing.id ? { ...c, ...payload } : c));
      onToast?.({ msg: "บันทึกข้อมูล " + payload.name + " สำเร็จ", kind: "success" });
    }
    close();
  };

  const removeCompany = (c) => {
    const used = busCountById[c.id] || 0;
    if (used > 0) {
      onToast?.({ msg: `ไม่สามารถลบ ${c.name} ได้ • มีรถบัส ${used} คันใช้งานอยู่`, kind: "danger" });
      setConfirmDel(null);
      return;
    }
    setCompanies(companies.filter(x => x.id !== c.id));
    onToast?.({ msg: "ลบบริษัท " + c.name + " แล้ว", kind: "danger" });
    setConfirmDel(null);
    setDetail(null);
  };

  const statusMeta = (s) => ({
    active:  { cls: "badge-success", label: "ใช้งาน" },
    renewal: { cls: "badge-warning", label: "ต่อสัญญา" },
    inactive:{ cls: "badge-neutral", label: "ระงับ" },
  })[s] || { cls: "badge-neutral", label: s };

  // contract days remaining
  const daysTo = (date) => {
    if (!date) return null;
    const ms = new Date(date).getTime() - new Date("2026-05-27").getTime();
    return Math.round(ms / 86400000);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>บริษัทขนส่ง</h2>
          <div className="sub">รายการบริษัทขนส่งที่ทำสัญญากับ MinebeaMitsumi • รวม {companies.length} บริษัท</div>
        </div>
        <div className="flex gap-8">
          <button className="btn"><Icon name="download" size={15}/> Export</button>
          <button className="btn btn-primary" onClick={openAdd}>
            <Icon name="plus" size={15}/> เพิ่มบริษัทขนส่ง
          </button>
        </div>
      </div>

      <div className="kpi-grid mb-8" style={{marginBottom:16}}>
        <KPI tone="navy"  icon="building" label="บริษัททั้งหมด"   value={stat.total + " บริษัท"} foot=""/>
        <KPI tone="green" icon="check"    label="สถานะใช้งาน"     value={stat.active + " บริษัท"} foot=""/>
        <KPI tone="amber" icon="alert"    label="รอต่อสัญญา"       value={stat.renewal + " บริษัท"} foot="ตรวจสอบสัญญา"/>
        <KPI tone="blue"  icon="bus"      label="รถบัสในระบบ"      value={stat.buses + " คัน"}    foot="ทุกบริษัทรวมกัน"/>
      </div>

      <div className="card">
        <div className="toolbar">
          <div className="search">
            <span className="ico"><Icon name="search" size={15}/></span>
            <input
              placeholder="ค้นหา ชื่อบริษัท, รหัส, ผู้ติดต่อ, เบอร์โทร…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">ทุกสถานะ</option>
            <option value="active">ใช้งาน</option>
            <option value="renewal">รอต่อสัญญา</option>
            <option value="inactive">ระงับ</option>
          </select>
          <div className="toolbar-spacer"></div>
          <div className="seg">
            <button className={view === "card" ? "on" : ""} onClick={() => setView("card")} title="Card view">
              <Icon name="building" size={14}/> การ์ด
            </button>
            <button className={view === "table" ? "on" : ""} onClick={() => setView("table")} title="Table view">
              <Icon name="id" size={14}/> ตาราง
            </button>
          </div>
          <div className="result-count">{filtered.length} บริษัท</div>
        </div>

        {view === "card" ? (
          <div className="company-grid">
            {filtered.map(c => {
              const sm = statusMeta(c.status);
              const cnt = busCountById[c.id] || 0;
              const dleft = daysTo(c.contractEnd);
              return (
                <div className="company-card" key={c.id} onClick={() => setDetail(c)}>
                  <div className="company-card-head">
                    <div className="company-logo"><span className="mono">{c.code}</span></div>
                    <div style={{flex:1, minWidth:0}}>
                      <div className="company-name" title={c.name}>{c.name}</div>
                      <div className="company-name-en" title={c.nameEn}>{c.nameEn || "—"}</div>
                    </div>
                    <span className={"badge " + sm.cls}><span className="dot"></span>{sm.label}</span>
                  </div>

                  <div className="company-body">
                    <div className="company-row">
                      <Icon name="user" size={13} style={{color:"var(--text-faint)"}}/>
                      <span>{c.contact}</span>
                    </div>
                    <div className="company-row">
                      <Icon name="phone" size={13} style={{color:"var(--text-faint)"}}/>
                      <span className="mono">{c.phone}</span>
                    </div>
                    <div className="company-row">
                      <Icon name="mail" size={13} style={{color:"var(--text-faint)"}}/>
                      <span style={{whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{c.email || "—"}</span>
                    </div>
                  </div>

                  <div className="company-stats">
                    <div>
                      <div className="stat-label">รถบัสในสังกัด</div>
                      <div className="stat-val mono">{cnt} คัน</div>
                    </div>
                    <div>
                      <div className="stat-label">สัญญาคงเหลือ</div>
                      <div className="stat-val mono" style={{color: dleft != null && dleft < 90 ? "var(--warning)" : "var(--text-strong)"}}>
                        {dleft != null ? (dleft >= 0 ? `${dleft} วัน` : `หมด ${-dleft} วัน`) : "—"}
                      </div>
                    </div>
                  </div>

                  <div className="company-card-foot" onClick={e => e.stopPropagation()}>
                    <button className="btn btn-sm" onClick={() => setDetail(c)}>
                      <Icon name="eye" size={13}/> ดู
                    </button>
                    <button className="btn btn-sm" onClick={() => openEdit(c)}>
                      <Icon name="edit" size={13}/> แก้ไข
                    </button>
                    <button className="btn btn-sm btn-ghost" onClick={() => setConfirmDel(c)}>
                      <Icon name="trash" size={13}/>
                    </button>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div style={{gridColumn:"1 / -1", textAlign:"center", padding:"40px 0", color:"var(--text-muted)"}}>
                ไม่พบบริษัทขนส่งตามเงื่อนไขที่เลือก
              </div>
            )}
          </div>
        ) : (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>รหัส</th>
                  <th>ชื่อบริษัท</th>
                  <th>ผู้ติดต่อ</th>
                  <th>เบอร์โทร</th>
                  <th style={{textAlign:"right"}}>รถบัส</th>
                  <th>สัญญาสิ้นสุด</th>
                  <th>สถานะ</th>
                  <th style={{textAlign:"right"}}>การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => {
                  const sm = statusMeta(c.status);
                  const cnt = busCountById[c.id] || 0;
                  return (
                    <tr key={c.id} className="row-click" onClick={() => setDetail(c)}>
                      <td><span className="mono tbl-cell-strong">{c.code}</span></td>
                      <td>
                        <div className="tbl-cell-strong">{c.name}</div>
                        <div className="text-muted text-xs">{c.nameEn || "—"}</div>
                      </td>
                      <td>{c.contact}</td>
                      <td className="mono">{c.phone}</td>
                      <td className="mono" style={{textAlign:"right"}}>{cnt}</td>
                      <td className="mono text-muted">{c.contractEnd || "—"}</td>
                      <td><span className={"badge " + sm.cls}><span className="dot"></span>{sm.label}</span></td>
                      <td onClick={e => e.stopPropagation()}>
                        <div className="tbl-actions">
                          <button className="icon-btn" title="ดู" onClick={() => setDetail(c)}><Icon name="eye" size={15}/></button>
                          <button className="icon-btn" title="แก้ไข" onClick={() => openEdit(c)}><Icon name="edit" size={15}/></button>
                          <button className="icon-btn" title="ลบ" onClick={() => setConfirmDel(c)}><Icon name="trash" size={15}/></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan="8" style={{textAlign:"center", padding:"40px 0", color:"var(--text-muted)"}}>
                    ไม่พบบริษัทขนส่งตามเงื่อนไขที่เลือก
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail drawer */}
      <Drawer
        open={!!detail}
        title={detail ? `บริษัท • ${detail.code}` : ""}
        onClose={() => setDetail(null)}
        footer={
          detail && (
            <>
              <button className="btn" onClick={() => setConfirmDel(detail)}>
                <Icon name="trash" size={15}/> ลบ
              </button>
              <button className="btn btn-primary" onClick={() => openEdit(detail)}>
                <Icon name="edit" size={15}/> แก้ไข
              </button>
            </>
          )
        }
      >
        {detail && <CompanyDetail company={detail} busCount={busCountById[detail.id] || 0}/>}
      </Drawer>

      {/* Add / Edit modal */}
      {modalMode && (
        <div className="modal-scrim" onClick={close}>
          <div className="modal modal-form modal-form-lg" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
            <button className="modal-close" onClick={close} aria-label="ปิด"><Icon name="close" size={18}/></button>
            <div className="modal-form-head">
              <div className="modal-ico" style={{margin:0, width:42, height:42, borderRadius:10, background:"var(--navy-50)", color:"var(--navy-700)"}}>
                <Icon name="building" size={20}/>
              </div>
              <div style={{textAlign:"left"}}>
                <h3 className="modal-title" style={{textAlign:"left", marginBottom:2}}>
                  {modalMode === "add" ? "เพิ่มบริษัทขนส่งใหม่" : "แก้ไขข้อมูลบริษัท"}
                </h3>
                <div className="text-muted text-xs">
                  {modalMode === "add" ? "กรอกข้อมูลให้ครบเพื่อบันทึกบริษัทขนส่งใหม่" : `กำลังแก้ไข: ${editing?.name}`}
                </div>
              </div>
            </div>

            <div className="modal-form-body">
              <div className="field-row">
                <div className="field" style={{maxWidth:180}}>
                  <label>รหัสบริษัท *</label>
                  <input
                    className={"mono " + (errors.code ? "input-error" : "")}
                    value={form.code}
                    onChange={e => setForm({ ...form, code: e.target.value.toUpperCase().replace(/\s/g, "") })}
                    placeholder="เช่น TPT"
                    autoFocus
                    maxLength={6}
                  />
                  {errors.code && <div className="field-err">{errors.code}</div>}
                </div>
                <div className="field">
                  <label>ชื่อบริษัท (ไทย) *</label>
                  <input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className={errors.name ? "input-error" : ""}
                    placeholder="เช่น ไทยพัฒนา ทรานสปอร์ต"
                  />
                  {errors.name && <div className="field-err">{errors.name}</div>}
                </div>
              </div>

              <div className="field">
                <label>ชื่อบริษัท (อังกฤษ)</label>
                <input
                  value={form.nameEn}
                  onChange={e => setForm({ ...form, nameEn: e.target.value })}
                  placeholder="e.g. Thai Pattana Transport Co., Ltd."
                />
              </div>

              <div className="field-row">
                <div className="field">
                  <label>ผู้ติดต่อ *</label>
                  <input
                    value={form.contact}
                    onChange={e => setForm({ ...form, contact: e.target.value })}
                    className={errors.contact ? "input-error" : ""}
                    placeholder="ชื่อ — สกุล"
                  />
                  {errors.contact && <div className="field-err">{errors.contact}</div>}
                </div>
                <div className="field">
                  <label>เบอร์โทร *</label>
                  <input
                    className={"mono " + (errors.phone ? "input-error" : "")}
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="0X-XXX-XXXX"
                  />
                  {errors.phone && <div className="field-err">{errors.phone}</div>}
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label>อีเมล</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className={errors.email ? "input-error" : ""}
                    placeholder="contact@example.co.th"
                  />
                  {errors.email && <div className="field-err">{errors.email}</div>}
                </div>
                <div className="field">
                  <label>เลขประจำตัวผู้เสียภาษี</label>
                  <input
                    className="mono"
                    value={form.taxId}
                    onChange={e => setForm({ ...form, taxId: e.target.value.replace(/[^\d]/g, "") })}
                    placeholder="13 หลัก"
                    maxLength={13}
                  />
                </div>
              </div>

              <div className="field">
                <label>ที่อยู่</label>
                <textarea
                  rows="2"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  placeholder="ที่อยู่บริษัท"
                />
              </div>

              <div className="field-row">
                <div className="field">
                  <label>วันเริ่มสัญญา</label>
                  <input
                    type="date"
                    value={form.contractStart}
                    onChange={e => setForm({ ...form, contractStart: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>วันสิ้นสุดสัญญา</label>
                  <input
                    type="date"
                    value={form.contractEnd}
                    onChange={e => setForm({ ...form, contractEnd: e.target.value })}
                  />
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label>อัตราค่าบริการ (บาท/คัน/เดือน)</label>
                  <input
                    className={"mono " + (errors.rate ? "input-error" : "")}
                    value={form.rate}
                    onChange={e => setForm({ ...form, rate: e.target.value.replace(/[^\d.]/g, "") })}
                    placeholder="38500"
                  />
                  {errors.rate && <div className="field-err">{errors.rate}</div>}
                </div>
                <div className="field">
                  <label>สถานะ</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    <option value="active">ใช้งาน</option>
                    <option value="renewal">รอต่อสัญญา</option>
                    <option value="inactive">ระงับ</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label>หมายเหตุ</label>
                <textarea
                  rows="2"
                  value={form.note}
                  onChange={e => setForm({ ...form, note: e.target.value })}
                  placeholder="ข้อมูลเพิ่มเติม…"
                />
              </div>
            </div>

            <div className="modal-form-foot">
              <button className="btn" onClick={close}>ยกเลิก</button>
              <button className="btn btn-primary" onClick={save}>
                <Icon name="check" size={15}/> {modalMode === "add" ? "เพิ่มบริษัท" : "บันทึก"}
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
            <h3 className="modal-title">ยืนยันการลบบริษัท</h3>
            <p className="modal-text">
              คุณต้องการลบบริษัท <strong style={{color:"var(--text-strong)"}}>{confirmDel.name}</strong> ใช่หรือไม่?
              {(busCountById[confirmDel.id] || 0) > 0 && (
                <><br/><span style={{color:"var(--danger)", fontWeight:600}}>
                  มีรถบัส {busCountById[confirmDel.id]} คันสังกัดบริษัทนี้ — โปรดย้ายรถก่อนลบ
                </span></>
              )}
            </p>
            <div className="flex gap-8" style={{justifyContent:"center"}}>
              <button className="btn" onClick={() => setConfirmDel(null)}>ยกเลิก</button>
              <button className="btn btn-danger" onClick={() => removeCompany(confirmDel)}>
                <Icon name="trash" size={15}/> ลบบริษัท
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CompanyDetail = ({ company, busCount }) => {
  const c = company;
  const companyBuses = useMemo(() => BUSES.filter(b => b.companyId === c.id), [c.id]);
  const air = companyBuses.filter(b => b.type === "air").length;
  const fan = companyBuses.filter(b => b.type === "fan").length;
  const active = companyBuses.filter(b => b.status === "active").length;

  const dleft = c.contractEnd ? Math.round((new Date(c.contractEnd).getTime() - new Date("2026-05-27").getTime()) / 86400000) : null;
  const monthly = (c.rate || 0) * busCount;

  return (
    <div>
      <div style={{display:"flex", alignItems:"center", gap:14, paddingBottom:18, borderBottom:"1px solid var(--border)", marginBottom:18}}>
        <div className="company-logo" style={{width:56, height:56, fontSize:14}}><span className="mono">{c.code}</span></div>
        <div style={{flex:1, minWidth:0}}>
          <div style={{fontSize:17, fontWeight:700, color:"var(--text-strong)", lineHeight:1.3}}>{c.name}</div>
          <div className="text-muted" style={{fontSize:12.5}}>{c.nameEn || "—"}</div>
          <div className="mt-4 flex gap-8">
            <StatusBadge status={c.status === "renewal" ? "pending" : c.status === "active" ? "active" : "inactive"}/>
            <span className="badge badge-navy">{busCount} คัน</span>
          </div>
        </div>
      </div>

      <div className="card" style={{boxShadow:"none", marginBottom:16}}>
        <div className="card-body" style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, textAlign:"center"}}>
          <div>
            <div className="mono" style={{fontSize:20, fontWeight:700, color:"var(--navy-700)"}}>{air}</div>
            <div className="text-muted text-xs">รถปรับอากาศ</div>
          </div>
          <div>
            <div className="mono" style={{fontSize:20, fontWeight:700, color:"var(--text-strong)"}}>{fan}</div>
            <div className="text-muted text-xs">รถพัดลม</div>
          </div>
          <div>
            <div className="mono" style={{fontSize:20, fontWeight:700, color:"var(--success)"}}>{active}</div>
            <div className="text-muted text-xs">ใช้งาน</div>
          </div>
        </div>
      </div>

      <h4 className="detail-section-title">ข้อมูลผู้ติดต่อ</h4>
      <div className="detail-list">
        <div className="detail-row"><span className="detail-label"><Icon name="user" size={13}/> ผู้ติดต่อ</span><span className="detail-val">{c.contact}</span></div>
        <div className="detail-row"><span className="detail-label"><Icon name="phone" size={13}/> เบอร์โทร</span><span className="detail-val mono">{c.phone}</span></div>
        <div className="detail-row"><span className="detail-label"><Icon name="mail" size={13}/> อีเมล</span><span className="detail-val">{c.email || "—"}</span></div>
        <div className="detail-row"><span className="detail-label"><Icon name="location" size={13}/> ที่อยู่</span><span className="detail-val" style={{textAlign:"right", maxWidth:"60%"}}>{c.address || "—"}</span></div>
        <div className="detail-row"><span className="detail-label"><Icon name="id" size={13}/> เลขผู้เสียภาษี</span><span className="detail-val mono">{c.taxId || "—"}</span></div>
      </div>

      <h4 className="detail-section-title">สัญญา</h4>
      <div className="detail-list">
        <div className="detail-row"><span className="detail-label">เริ่มสัญญา</span><span className="detail-val mono">{c.contractStart || "—"}</span></div>
        <div className="detail-row"><span className="detail-label">สิ้นสุดสัญญา</span><span className="detail-val mono">{c.contractEnd || "—"}</span></div>
        <div className="detail-row">
          <span className="detail-label">คงเหลือ</span>
          <span className="detail-val mono" style={{color: dleft != null && dleft < 90 ? "var(--warning)" : "var(--text-strong)"}}>
            {dleft != null ? (dleft >= 0 ? `${dleft} วัน` : `หมด ${-dleft} วัน`) : "—"}
          </span>
        </div>
        <div className="detail-row"><span className="detail-label">อัตรา/คัน/เดือน</span><span className="detail-val mono">{c.rate ? formatBaht(c.rate) : "—"}</span></div>
        <div className="detail-row"><span className="detail-label">ประมาณการ/เดือน</span><span className="detail-val mono" style={{fontWeight:700}}>{monthly ? formatBaht(monthly) : "—"}</span></div>
      </div>

      {c.note && (
        <>
          <h4 className="detail-section-title">หมายเหตุ</h4>
          <p style={{margin:0, fontSize:13, color:"var(--text-strong)", lineHeight:1.6, background:"var(--surface-2)", padding:"12px 14px", borderRadius:8}}>{c.note}</p>
        </>
      )}

      <h4 className="detail-section-title">รถบัสในสังกัด ({companyBuses.length})</h4>
      {companyBuses.length === 0 ? (
        <div style={{padding:"18px 0", textAlign:"center", color:"var(--text-muted)", fontSize:13}}>
          ยังไม่มีรถบัสสังกัดบริษัทนี้
        </div>
      ) : (
        <div className="company-bus-list">
          {companyBuses.slice(0, 12).map(b => (
            <div key={b.id} className="company-bus-row">
              <div className={"bus-illust " + (b.type === "fan" ? "fan" : "")} style={{width:36, height:26}}>
                <Icon name={b.type === "air" ? "snow" : "fan"} size={12}/>
              </div>
              <div style={{flex:1, minWidth:0}}>
                <div className="mono text-strong" style={{fontWeight:600, fontSize:13}}>{b.plate}</div>
                <div className="text-muted text-xs">{b.brand} • {b.factory}</div>
              </div>
              <StatusBadge status={b.status}/>
            </div>
          ))}
          {companyBuses.length > 12 && (
            <div className="text-muted text-xs" style={{textAlign:"center", padding:"8px 0"}}>
              และอีก {companyBuses.length - 12} คัน
            </div>
          )}
        </div>
      )}
    </div>
  );
};

window.Companies = Companies;
