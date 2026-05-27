import { useState, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import Icon from '../components/Icon'
import { KPI, Progress } from '../components/ui'
import { formatNumber } from '../lib/utils'
import { useMaintenance } from '../hooks/useMaintenance'

const FACTORIES = ['บางปะอิน', 'อยุธยา', 'ลพบุรี']
const SERVICE_CYCLE = 5000

export default function Maintenance() {
  const { onToast } = useOutletContext() || {}
  const { buses, closedCount, loading, error, addLog } = useMaintenance()

  const [factory, setFactory] = useState('all')
  const [status, setStatus]   = useState('all')
  const [type, setType]       = useState('all')
  const [search, setSearch]   = useState('')
  const [logOpen, setLogOpen]   = useState(false)
  const [logTarget, setLogTarget] = useState(null)
  const [form, setForm]   = useState({ busId: '', date: '', kind: 'scheduled', cost: '', km: '', desc: '', photo: null })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const records = useMemo(() => buses
    .filter(b => b.status !== 'retired')
    .map(b => {
      const kmToNext = b.next_service_km != null ? b.next_service_km - b.current_km : null
      const windowStart = b.next_service_km ? b.next_service_km - SERVICE_CYCLE : 0
      const pct = b.next_service_km
        ? Math.max(0, Math.min(110, ((b.current_km - windowStart) / SERVICE_CYCLE) * 100))
        : 0
      return { ...b, kmToNext, pct }
    }), [buses])

  const activeBuses = useMemo(() => buses.filter(b => b.status !== 'retired'), [buses])

  const filtered = useMemo(() => records.filter(r => {
    if (factory !== 'all' && r.factory !== factory) return false
    if (type    !== 'all' && r.type    !== type)    return false
    if (status === 'over' && (r.kmToNext == null || r.kmToNext > 0)) return false
    if (status === 'warn' && !(r.pct >= 80 && r.pct < 100))         return false
    if (search) {
      const q = search.toLowerCase()
      if (!(r.plate.toLowerCase().includes(q) ||
            (r.brand || '').toLowerCase().includes(q) ||
            (r.driver?.name || '').includes(q))) return false
    }
    return true
  }), [records, factory, type, status, search])

  const stat = useMemo(() => ({
    due7:   records.filter(r => r.kmToNext != null && r.kmToNext > 0 && r.kmToNext <= 500).length,
    warn:   records.filter(r => r.pct >= 80 && r.pct < 100).length,
    over:   records.filter(r => r.kmToNext != null && r.kmToNext <= 0).length,
    closed: closedCount,
  }), [records, closedCount])

  const activeFilterCount = [factory !== 'all', status !== 'all', type !== 'all', !!search].filter(Boolean).length
  const clearFilters = () => { setFactory('all'); setStatus('all'); setType('all'); setSearch('') }

  const openLogFor = (bus) => {
    setLogTarget(bus)
    setForm({
      busId: bus?.id || '',
      date:  new Date().toISOString().slice(0, 10),
      kind:  'scheduled',
      cost:  '',
      km:    bus ? String(bus.current_km) : '',
      desc:  '',
      photo: null,
    })
    setErrors({})
    setLogOpen(true)
  }
  const closeLog = () => { setLogOpen(false); setLogTarget(null); setErrors({}) }

  const submitLog = async () => {
    const e = {}
    if (!form.busId) e.busId = 'เลือกรถบัส'
    if (!form.date)  e.date  = 'เลือกวันที่'
    if (!form.km || isNaN(Number(form.km)))     e.km   = 'กรอกเลขไมล์'
    if (!form.cost || isNaN(Number(form.cost))) e.cost = 'กรอกค่าใช้จ่าย'
    if (!form.desc.trim()) e.desc = 'กรอกรายละเอียด'
    setErrors(e)
    if (Object.keys(e).length) return

    setSaving(true)
    try {
      await addLog(form)
      const bus = buses.find(b => b.id === form.busId)
      onToast?.({ msg: `บันทึกการซ่อม ${bus?.plate || ''} • ฿${Number(form.cost).toLocaleString()}`, kind: 'success' })
      closeLog()
    } catch (err) {
      onToast?.({ msg: 'เกิดข้อผิดพลาด: ' + err.message, kind: 'error' })
    } finally { setSaving(false) }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>การบำรุงรักษา</h2>
          <div className="sub">ติดตามสถานะการบำรุงรักษาตามเลขไมล์ • รวม {records.length} คัน</div>
        </div>
        <div className="flex gap-8">
          <button className="btn" onClick={clearFilters}>
            <Icon name="filter" size={15} /> ล้างตัวกรอง {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}
          </button>
          <button className="btn btn-primary" onClick={() => openLogFor(null)}>
            <Icon name="plus" size={15} /> บันทึกการซ่อม
          </button>
        </div>
      </div>

      <div className="kpi-grid" style={{ marginBottom: 16 }}>
        <KPI tone="navy"  icon="wrench" label="ครบกำหนดเร็วๆ นี้" value={loading ? '—' : stat.due7 + ' คัน'} foot="ภายใน 500 กม." />
        <KPI tone="amber" icon="alert"  label="ใกล้ครบ (≥80%)"    value={loading ? '—' : stat.warn + ' คัน'} />
        <KPI tone="red"   icon="alert"  label="เกินกำหนด"         value={loading ? '—' : stat.over + ' คัน'} foot="ต้องดำเนินการ" />
        <KPI tone="green" icon="check"  label="บันทึกเดือนนี้"    value={loading ? '—' : stat.closed + ' รายการ'} />
      </div>

      <div className="card">
        <div className="toolbar">
          <div className="search">
            <span className="ico"><Icon name="search" size={15} /></span>
            <input placeholder="ค้นหา ทะเบียน, ยี่ห้อ, คนขับ…" value={search} onChange={e => setSearch(e.target.value)} />
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
          <div className="seg" style={{ marginLeft: 'auto' }}>
            <button className={status === 'all'  ? 'on' : ''} onClick={() => setStatus('all')}>ทั้งหมด</button>
            <button className={status === 'warn' ? 'on' : ''} onClick={() => setStatus('warn')}>ใกล้ครบ</button>
            <button className={status === 'over' ? 'on' : ''} onClick={() => setStatus('over')}>เกินกำหนด</button>
          </div>
          <div className="result-count">{filtered.length} คัน</div>
        </div>

        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>ทะเบียน</th>
                <th>ประเภท</th>
                <th>โรงงาน</th>
                <th style={{ textAlign: 'right' }}>เลขไมล์ปัจจุบัน</th>
                <th style={{ textAlign: 'right' }}>รอบซ่อมถัดไป</th>
                <th>บำรุงรักษาล่าสุด</th>
                <th style={{ minWidth: 200 }}>ครบรอบบำรุงรักษา</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>กำลังโหลด...</td></tr>
              )}
              {error && (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--danger)' }}>{error}</td></tr>
              )}
              {!loading && !error && filtered.slice(0, 30).map(b => (
                <tr key={b.id}>
                  <td><span className="mono tbl-cell-strong">{b.plate}</span></td>
                  <td>
                    <span className={'badge ' + (b.type === 'air' ? 'badge-info' : 'badge-neutral')}>
                      <span className="dot"></span>{b.type === 'air' ? 'ปรับอากาศ' : 'พัดลม'}
                    </span>
                  </td>
                  <td>{b.factory}</td>
                  <td className="mono" style={{ textAlign: 'right' }}>{formatNumber(b.current_km)}</td>
                  <td className="mono" style={{ textAlign: 'right' }}>{b.next_service_km ? formatNumber(b.next_service_km) : '—'}</td>
                  <td className="text-muted">{b.last_service_date || '—'}</td>
                  <td>
                    {b.next_service_km ? (
                      <>
                        <Progress pct={b.pct} />
                        <div className="text-xs text-muted mt-4 mono">
                          {b.pct.toFixed(0)}% • {b.kmToNext <= 0
                            ? `เกิน ${formatNumber(-b.kmToNext)} กม.`
                            : `เหลือ ${formatNumber(b.kmToNext)} กม.`}
                        </div>
                      </>
                    ) : (
                      <span className="text-muted text-xs">ไม่ได้ตั้งค่า</span>
                    )}
                  </td>
                  <td>
                    <button className="btn btn-sm" onClick={() => openLogFor(b)}>
                      <Icon name="plus" size={12} /> บันทึก
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && !error && filtered.length === 0 && (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>ไม่พบรถบัสตามเงื่อนไขที่เลือก</td></tr>
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

      {/* Log modal */}
      {logOpen && (
        <div className="modal-scrim" onClick={closeLog}>
          <div className="modal modal-form" onClick={e => e.stopPropagation()} role="dialog">
            <button className="modal-close" onClick={closeLog}><Icon name="close" size={18} /></button>
            <div className="modal-form-head">
              <div className="modal-ico" style={{ margin: 0, width: 42, height: 42, borderRadius: 10, background: 'var(--amber-100)', color: 'var(--amber-600)' }}>
                <Icon name="wrench" size={20} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h3 className="modal-title" style={{ textAlign: 'left', marginBottom: 2 }}>บันทึกการซ่อมบำรุง</h3>
                <div className="text-muted text-xs">
                  {logTarget ? `รถบัส ${logTarget.plate} • ${logTarget.factory}` : 'เลือกรถบัสและกรอกข้อมูลการซ่อม'}
                </div>
              </div>
            </div>

            <div className="modal-form-body">
              <div className="field">
                <label>รถบัส *</label>
                <select
                  value={form.busId}
                  onChange={e => {
                    const b = activeBuses.find(x => x.id === e.target.value)
                    setForm(f => ({ ...f, busId: e.target.value, km: b ? String(b.current_km) : f.km }))
                  }}
                  className={errors.busId ? 'input-error' : ''}
                  disabled={!!logTarget}
                >
                  <option value="">— เลือกรถบัส —</option>
                  {activeBuses.map(b => (
                    <option key={b.id} value={b.id}>{b.plate} • {b.factory} ({b.type === 'air' ? 'ปรับอากาศ' : 'พัดลม'})</option>
                  ))}
                </select>
                {errors.busId && <div className="field-err">{errors.busId}</div>}
              </div>

              <div className="field-row">
                <div className="field">
                  <label>วันที่ *</label>
                  <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className={errors.date ? 'input-error' : ''} />
                  {errors.date && <div className="field-err">{errors.date}</div>}
                </div>
                <div className="field">
                  <label>เลขไมล์ปัจจุบัน *</label>
                  <input className={'mono ' + (errors.km ? 'input-error' : '')} value={form.km} onChange={e => setForm(f => ({ ...f, km: e.target.value.replace(/\D/g, '') }))} placeholder="0" />
                  {errors.km && <div className="field-err">{errors.km}</div>}
                </div>
              </div>

              <div className="field">
                <label>ประเภทการซ่อม *</label>
                <div className="role-picker" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  {[
                    { id: 'scheduled', label: 'ตามแผน',   desc: 'บำรุงรักษาประจำ' },
                    { id: 'repair',    label: 'ซ่อมแซม',   desc: 'เหตุเสียกะทันหัน' },
                    { id: 'accident',  label: 'อุบัติเหตุ', desc: 'ซ่อมหลังเหตุการณ์' },
                  ].map(k => (
                    <button key={k.id} type="button" className={'role-opt ' + (form.kind === k.id ? 'on' : '')} onClick={() => setForm(f => ({ ...f, kind: k.id }))}>
                      <div className="role-opt-head">
                        <span style={{ fontWeight: 700, color: 'var(--text-strong)', fontSize: 13 }}>{k.label}</span>
                        {form.kind === k.id && <Icon name="check" size={14} style={{ color: 'var(--navy-700)' }} />}
                      </div>
                      <div className="role-opt-desc">{k.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>รายละเอียด *</label>
                <textarea rows="3" value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} className={errors.desc ? 'input-error' : ''} placeholder="เช่น เปลี่ยนน้ำมันเครื่อง + ไส้กรอง, ตรวจระบบเบรก…" />
                {errors.desc && <div className="field-err">{errors.desc}</div>}
              </div>

              <div className="field">
                <label>ค่าใช้จ่าย (บาท) *</label>
                <input className={'mono ' + (errors.cost ? 'input-error' : '')} value={form.cost} onChange={e => setForm(f => ({ ...f, cost: e.target.value.replace(/[^\d.]/g, '') }))} placeholder="เช่น 3800" />
                {errors.cost && <div className="field-err">{errors.cost}</div>}
              </div>

              <div className="field">
                <label>เอกสาร / ภาพประกอบ</label>
                <label className="file-drop">
                  <Icon name="upload" size={18} style={{ color: 'var(--text-faint)' }} />
                  <div>{form.photo ? form.photo.name : 'คลิกหรือลากไฟล์มาวางที่นี่'}</div>
                  <div className="text-xs text-muted">JPG, PNG, PDF • สูงสุด 10MB</div>
                  <input type="file" accept=".jpg,.jpeg,.png,.pdf" style={{ display: 'none' }} onChange={e => setForm(f => ({ ...f, photo: e.target.files?.[0] || null }))} />
                </label>
              </div>
            </div>

            <div className="modal-form-foot">
              <button className="btn" onClick={closeLog}>ยกเลิก</button>
              <button className="btn btn-primary" onClick={submitLog} disabled={saving}>
                <Icon name="check" size={15} /> {saving ? 'กำลังบันทึก...' : 'บันทึกการซ่อม'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
