import { useState, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import Icon from '../components/Icon'
import { KPI } from '../components/ui'
import { LineChart, DonutChart } from '../components/Charts'
import { useCosts } from '../hooks/useCosts'

const THAI_MONTHS = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.']

const CAT_LABEL = {
  scheduled: 'บำรุงรักษา',
  repair:    'ซ่อมแซม',
  accident:  'อุบัติเหตุ',
  fuel:      'เติมน้ำมัน',
}
const CAT_COLOR = {
  scheduled: '#1e3a5f',
  repair:    '#f59e0b',
  accident:  '#ef4444',
  fuel:      '#3b82f6',
}
const CAT_BADGE = {
  scheduled: 'badge-navy',
  repair:    'badge-warning',
  accident:  'badge-danger',
  fuel:      'badge-info',
}

function baht(n) {
  return '฿' + (n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
function bahtCompact(n) {
  if (n >= 1_000_000) return '฿' + (n / 1_000_000).toFixed(2) + 'M'
  if (n >= 1_000) return '฿' + (n / 1_000).toFixed(1) + 'K'
  return '฿' + (n || 0).toFixed(0)
}

const now = new Date()

export default function Cost() {
  useOutletContext()
  const [year, setYear]   = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [busType, setBusType]   = useState('all')
  const [category, setCategory] = useState('all')
  const [search, setSearch]     = useState('')

  const { records, trend, loading } = useCosts(year, month)

  const filtered = useMemo(() => records.filter(r => {
    if (busType !== 'all' && r.busType !== busType) return false
    if (category !== 'all' && r.category !== category) return false
    if (search) {
      const q = search.toLowerCase()
      if (!(r.busCode.toLowerCase().includes(q) || (r.description || '').toLowerCase().includes(q))) return false
    }
    return true
  }), [records, busType, category, search])

  const totalCost = records.reduce((a, r) => a + r.cost, 0)
  const airCost   = records.filter(r => r.busType === 'air').reduce((a, r) => a + r.cost, 0)
  const fanCost   = records.filter(r => r.busType === 'fan').reduce((a, r) => a + r.cost, 0)

  const donutData = Object.keys(CAT_LABEL).map(cat => ({
    label: CAT_LABEL[cat],
    value: records.filter(r => r.category === cat).reduce((a, r) => a + r.cost, 0),
    color: CAT_COLOR[cat],
  })).filter(d => d.value > 0)

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i)

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>การควบคุมค่าใช้จ่าย</h2>
          <div className="sub">
            {THAI_MONTHS[month - 1]} {year + 543} • รวม {records.length} รายการ
          </div>
        </div>
        <div className="flex gap-8">
          <select value={month} onChange={e => setMonth(Number(e.target.value))} style={{ width: 90 }}>
            {THAI_MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
          <select value={year} onChange={e => setYear(Number(e.target.value))} style={{ width: 90 }}>
            {years.map(y => <option key={y} value={y}>{y + 543}</option>)}
          </select>
          <button className="btn"><Icon name="download" size={15} /> Export</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        <KPI tone="navy"  icon="coin"  label="ค่าใช้จ่ายรวม"        value={loading ? '—' : bahtCompact(totalCost)} />
        <KPI tone="blue"  icon="bus"   label="รถปรับอากาศ"           value={loading ? '—' : bahtCompact(airCost)} />
        <KPI tone="amber" icon="bus"   label="รถพัดลม"               value={loading ? '—' : bahtCompact(fanCost)} />
        <KPI tone="red"   icon="wrench" label="จำนวนรายการทั้งหมด"   value={loading ? '—' : String(records.length)} />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, marginBottom: 16 , marginTop: 16 }}>
        <div className="card">
          <div className="card-head">
            <div>
              <h3>แนวโน้มค่าใช้จ่าย 6 เดือน</h3>
              <div className="sub">แยกรถปรับอากาศ กับ รถพัดลม</div>
            </div>
          </div>
          <div className="card-body">
            {loading
              ? <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>กำลังโหลด...</div>
              : trend.every(t => t.air === 0 && t.fan === 0)
                ? <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>ไม่มีข้อมูลในช่วงนี้</div>
                : <LineChart
                    data={trend}
                    lines={[
                      { key: 'air', label: 'รถปรับอากาศ', color: '#1e3a5f' },
                      { key: 'fan', label: 'รถพัดลม',     color: '#f59e0b' },
                    ]}
                    height={240}
                  />
            }
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <h3>สัดส่วนค่าใช้จ่าย</h3>
              <div className="sub">แยกตามหมวดหมู่ เดือนนี้</div>
            </div>
          </div>
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
            {loading
              ? <div style={{ color: 'var(--text-muted)' }}>กำลังโหลด...</div>
              : donutData.length === 0
                ? <div style={{ color: 'var(--text-muted)' }}>ไม่มีข้อมูลเดือนนี้</div>
                : <DonutChart data={donutData} size={180} thickness={30} />
            }
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="toolbar">
          <div className="search">
            <span className="ico"><Icon name="search" size={15} /></span>
            <input placeholder="ค้นหา รถบัส, รายละเอียด…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select value={busType} onChange={e => setBusType(e.target.value)}>
            <option value="all">ทุกประเภทรถ</option>
            <option value="air">รถปรับอากาศ</option>
            <option value="fan">รถพัดลม</option>
          </select>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="all">ทุกหมวดหมู่</option>
            {Object.entries(CAT_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <div className="toolbar-spacer" />
          <div className="result-count">{filtered.length} รายการ</div>
        </div>

        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>วันที่</th>
                <th>รถบัส</th>
                <th>ประเภทรถ</th>
                <th>หมวดหมู่</th>
                <th>รายละเอียด</th>
                <th style={{ textAlign: 'right' }}>จำนวนเงิน</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>กำลังโหลด...</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>ไม่มีข้อมูลในช่วงที่เลือก</td></tr>
              )}
              {!loading && filtered.map((r, i) => (
                <tr key={r.id + i}>
                  <td className="mono text-muted">{r.date}</td>
                  <td className="mono tbl-cell-strong">{r.busCode}</td>
                  <td>
                    <span className={'badge ' + (r.busType === 'air' ? 'badge-navy' : 'badge-warning')}>
                      {r.busType === 'air' ? 'ปรับอากาศ' : 'พัดลม'}
                    </span>
                  </td>
                  <td>
                    <span className={'badge ' + (CAT_BADGE[r.category] || 'badge-neutral')}>
                      {CAT_LABEL[r.category] || r.category}
                    </span>
                  </td>
                  <td className="text-muted" style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.description || '—'}
                  </td>
                  <td className="mono tbl-cell-strong" style={{ textAlign: 'right' }}>
                    {baht(r.cost)}
                  </td>
                </tr>
              ))}
            </tbody>
            {!loading && filtered.length > 0 && (
              <tfoot>
                <tr style={{ borderTop: '2px solid var(--border)' }}>
                  <td colSpan="5" style={{ fontWeight: 700, color: 'var(--text-strong)', paddingTop: 10 }}>รวม ({filtered.length} รายการ)</td>
                  <td className="mono" style={{ textAlign: 'right', fontWeight: 700, color: 'var(--navy-700)', fontSize: 14, paddingTop: 10 }}>
                    {baht(filtered.reduce((a, r) => a + r.cost, 0))}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  )
}
