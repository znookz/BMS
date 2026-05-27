/* ============================
   BMS — Dashboard page
   ============================ */

const Dashboard = ({ onToast }) => {
  const fanData = FUEL_BY_COMPANY.map(c => ({ ...c, value: c.liters, label: c.name.replace(" ทรานสปอร์ต", "").replace(" ทรานส์","").replace("ขนส่ง","") }));

  const todayLiters = FUEL_BY_COMPANY.reduce((a,b) => a + b.liters, 0);
  const todayCost   = todayLiters * 32.5;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>ภาพรวมการดำเนินงาน</h2>
          <div className="sub">รายงานสถานะรถบัสและค่าใช้จ่ายประจำเดือน • ข้อมูล ณ 26 พ.ค. 2569 14:32</div>
        </div>
        <div className="flex gap-8">
          <button className="btn"><Icon name="calendar" size={15}/> เดือนนี้ (พ.ค.)</button>
          <button className="btn"><Icon name="download" size={15}/> Export</button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="kpi-grid">
        <KPI tone="navy"  icon="bus"     label="รถบัสที่ใช้งาน" value={`${BUSES_ACTIVE} / 88`} trend={{dir:"up", label:"+2 vs สัปดาห์ก่อน"}} foot="" />
        <KPI tone="amber" icon="wrench"  label="อยู่ระหว่างซ่อม" value={String(MAINTENANCE_NOW)} trend={{dir:"down", label:"-1 vs สัปดาห์ก่อน"}} foot=""/>
        <KPI tone="blue"  icon="coin"    label="ค่าใช้จ่ายเดือนนี้" value={bahtCompact(COST_THIS_MONTH)} trend={{dir:"up", label:"+5.8% MoM"}} foot=""/>
        <KPI tone="red"   icon="alert"   label="เรื่องร้องเรียนค้าง" value={String(COMPLAINTS_OPEN)} trend={{dir:"neutral", label:"คงที่"}} foot=""/>
      </div>

      <div className="mt-16" style={{display:"grid", gridTemplateColumns:"1.5fr 1fr", gap:16}}>
        {/* Line chart */}
        <div className="card">
          <div className="card-head">
            <div>
              <h3>แนวโน้มค่าใช้จ่ายรายเดือน</h3>
              <div className="sub">เปรียบเทียบรถปรับอากาศ กับ รถพัดลม (12 เดือนล่าสุด)</div>
            </div>
            <div className="seg">
              <button className="on">บาท</button>
              <button>ลิตร</button>
            </div>
          </div>
          <div className="card-body">
            <LineChart
              data={COST_TREND.map(d => ({ x: d.m, air: d.air, fan: d.fan }))}
              lines={[
                { key: "air", label: "รถปรับอากาศ (68 คัน)", color: "#1e3a5f" },
                { key: "fan", label: "รถพัดลม (20 คัน)",     color: "#f59e0b" },
              ]}
              height={240}
            />
          </div>
        </div>

        {/* Expiry alerts */}
        <div className="card">
          <div className="card-head">
            <div>
              <h3>การแจ้งเตือนวันหมดอายุ</h3>
              <div className="sub">5 รายการที่ใกล้หมดอายุที่สุด</div>
            </div>
            <a className="btn btn-ghost btn-sm">ดูทั้งหมด</a>
          </div>
          <div>
            {EXPIRY_ALERTS.map(a => {
              const tone = a.days <= 7 ? {bg:"#fee2e2", fg:"#b91c1c"} : a.days <= 14 ? {bg:"#fef3c7", fg:"#b45309"} : {bg:"#dbeafe", fg:"#1d4ed8"};
              const ico = a.type === "insurance" ? "shield" : a.type === "license" ? "id" : a.type === "tax" ? "id" : "cap";
              return (
                <div className="alert-row" key={a.id}>
                  <div className="ico" style={{background:tone.bg, color:tone.fg}}><Icon name={ico} size={16}/></div>
                  <div className="body">
                    <div className="title">{a.label}</div>
                    <div className="sub">{a.who} • หมดอายุ {a.exp}</div>
                  </div>
                  <div className="days" style={{color: tone.fg}}>{a.days} วัน</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bar chart + activity */}
      <div className="mt-16" style={{display:"grid", gridTemplateColumns:"1.5fr 1fr", gap:16}}>
        <div className="card">
          <div className="card-head">
            <div>
              <h3>การใช้น้ำมันรายบริษัท (วันนี้)</h3>
              <div className="sub">ปริมาณรวม {todayLiters.toLocaleString()} ลิตร • {bahtCompact(todayCost)} • อัปเดตอัตโนมัติทุก 5 นาที</div>
            </div>
            <div className="flex items-center gap-8" style={{fontSize:12, color:"var(--success)"}}>
              <span style={{width:8,height:8,borderRadius:8,background:"var(--success)",animation:"pulse 1.5s ease-in-out infinite"}}></span>
              <span>LIVE</span>
            </div>
          </div>
          <div className="card-body">
            <BarChart
              data={fanData}
              valueKey="value"
              labelKey="label"
              color="#1e3a5f"
              suffix=" ล."
              height={260}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <h3>กิจกรรมล่าสุด</h3>
              <div className="sub">ความเคลื่อนไหวในระบบ</div>
            </div>
            <a className="btn btn-ghost btn-sm">ทั้งหมด</a>
          </div>
          <div className="activity">
            {ACTIVITY.map(a => {
              const map = {
                maintenance: { ico:"wrench", tone:{bg:"#fef3c7",fg:"#b45309"} },
                driver:      { ico:"user",   tone:{bg:"#dbeafe",fg:"#1d4ed8"} },
                fuel:        { ico:"fuel",   tone:{bg:"#e0e7ff",fg:"#4338ca"} },
                license:     { ico:"id",     tone:{bg:"#dcfce7",fg:"#15803d"} },
                complaint:   { ico:"chat",   tone:{bg:"#fee2e2",fg:"#b91c1c"} },
              }[a.kind];
              return (
                <div className="activity-item" key={a.id}>
                  <div className="ico" style={{background: map.tone.bg, color: map.tone.fg}}>
                    <Icon name={map.ico} size={15}/>
                  </div>
                  <div className="body">
                    <div><span className="who">{a.who}</span> {a.action} <span style={{color:"var(--navy-700)", fontWeight:600}}>{a.target}</span></div>
                    <div className="when">{a.when}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick stats row */}
      <div className="mt-16" style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:16}}>
        <div className="card">
          <div className="card-head"><h3>สถานะรถตามโรงงาน</h3></div>
          <div className="card-body">
            {FACTORIES.map(f => {
              const fBuses = BUSES.filter(b => b.factory === f);
              const active = fBuses.filter(b => b.status === "active").length;
              const maint  = fBuses.filter(b => b.status === "maintenance").length;
              return (
                <div key={f} style={{marginBottom: 14}}>
                  <div className="flex justify-between mb-8" style={{fontSize:13}}>
                    <span className="text-strong" style={{fontWeight:600}}>{f}</span>
                    <span className="mono text-muted">{fBuses.length} คัน</span>
                  </div>
                  <div style={{display:"flex", height:8, borderRadius:4, overflow:"hidden", background:"var(--surface-2)"}}>
                    <div style={{width: `${(active/fBuses.length)*100}%`, background:"var(--success)"}}></div>
                    <div style={{width: `${(maint/fBuses.length)*100}%`, background:"var(--warning)"}}></div>
                  </div>
                  <div className="flex gap-12 mt-4" style={{fontSize:11.5, color:"var(--text-muted)"}}>
                    <span><span style={{color:"var(--success)", fontWeight:700}}>●</span> ใช้งาน {active}</span>
                    <span><span style={{color:"var(--warning)", fontWeight:700}}>●</span> ซ่อม {maint}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h3>ค่าใช้จ่ายแยกประเภท</h3></div>
          <div className="card-body">
            <DonutChart
              data={[
                { label: "น้ำมัน",       value: 1640, color: "#1e3a5f" },
                { label: "บำรุงรักษา",   value: 720,  color: "#f59e0b" },
                { label: "ประกัน/ภาษี",  value: 320,  color: "#22c55e" },
                { label: "อื่นๆ",         value: 250,  color: "#94a3b8" },
              ]}
              size={170}
              thickness={26}
            />
            <div className="text-muted text-xs mt-16" style={{textAlign:"center"}}>
              ค่าใช้จ่ายเดือน พ.ค. 2569 (พันบาท)
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h3>สรุปการดำเนินงาน</h3></div>
          <div className="card-body" style={{display:"flex", flexDirection:"column", gap:16}}>
            {[
              { label: "พนักงานขับรถทั้งหมด", value: "30 คน", sub: "Active 28 • Inactive 2", color: "var(--navy-700)" },
              { label: "เที่ยววิ่งวันนี้",       value: "184 เที่ยว", sub: "เป้า 180 • +2.2%", color: "var(--success)" },
              { label: "ระยะทางรวม (วันนี้)",   value: "12,440 กม.", sub: "เฉลี่ย 141 กม./คัน", color: "var(--navy-700)" },
              { label: "อุบัติเหตุเดือนนี้",     value: "0 ครั้ง", sub: "นับจากต้นเดือน", color: "var(--success)" },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <div className="text-muted text-xs" style={{textTransform:"uppercase", letterSpacing:"0.04em", fontWeight:600}}>{s.label}</div>
                  <div className="mono" style={{fontSize:18, fontWeight:700, color:s.color}}>{s.value}</div>
                </div>
                <div className="text-xs text-muted" style={{textAlign:"right", maxWidth:120}}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
      `}</style>
    </div>
  );
};

window.Dashboard = Dashboard;
