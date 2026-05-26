import { useState, useMemo, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Icon from '../components/Icon'
import { StatusBadge, Drawer } from '../components/ui'
import { initials, formatNumber } from '../lib/mockData'
import { useBuses, fetchBusLogs } from '../hooks/useBuses'

const KIND_LABEL = { scheduled: 'ตามแผน', repair: 'ซ่อมแซม', accident: 'อุบัติเหตุ' }
const KIND_BADGE = { scheduled: 'badge-navy', repair: 'badge-warning', accident: 'badge-danger' }
const baht = n => '฿' + (n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const FACTORIES = ['บางปะอิน', 'อยุธยา', 'ลพบุรี']

const DEFAULT_FORM = {
  plate: '', type: 'air', brand: '', model: '', year: '',
  seats: '', factory: 'บางปะอิน', status: 'active',
  driver_id: '', current_km: '0', next_service_km: '',
  last_service_date: '', insurance_exp: '', tax_exp: '',
}

function validate(form) {
  const e = {}
  if (!form.plate.trim()) e.plate = 'กรอกทะเบียน'
  return e
}

export default function Buses() {
  const { onToast } = useOutletContext() || {}
  const { buses, drivers, loading, error, add, update, remove } = useBuses()

  const [busType, setBusType] = useState('air')
  const [viewMode, setViewMode] = useState('table')
  const [factory, setFactory]   = useState('all')
  const [status, setStatus]     = useState('all')
  const [search, setSearch]     = useState('')

  const [selected, setSelected] = useState(null)
  const [isView, setIsView]     = useState(false)
  const [addOpen, setAddOpen]   = useState(false)
  const [tab, setTab]           = useState('info')
  const [form, setForm]         = useState(DEFAULT_FORM)
  const [errors, setErrors]     = useState({})
  const [saving, setSaving]     = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const airCount = buses.filter(b => b.type === 'air').length
  const fanCount = buses.filter(b => b.type === 'fan').length

  const filtered = useMemo(() => buses.filter(b => {
    if (b.type !== busType) return false
    if (factory !== 'all' && b.factory !== factory) return false
    if (status  !== 'all' && b.status  !== status)  return false
    if (search) {
      const q = search.toLowerCase()
      if (!(
        b.plate.toLowerCase().includes(q) ||
        (b.brand || '').toLowerCase().includes(q) ||
        (b.driver?.name || '').includes(q)
      )) return false
    }
    return true
  }), [buses, busType, factory, status, search])

  const openDetail = (b, view = false) => {
    setSelected(b)
    setIsView(view)
    setTab('info')
    setForm({
      plate:            b.plate,
      type:             b.type,
      brand:            b.brand || '',
      model:            b.model || '',
      year:             b.year ? String(b.year) : '',
      seats:            b.seats ? String(b.seats) : '',
      factory:          b.factory,
      status:           b.status,
      driver_id:        b.driver_id || '',
      current_km:       String(b.current_km || 0),
      next_service_km:  b.next_service_km ? String(b.next_service_km) : '',
      last_service_date: b.last_service_date || '',
      insurance_exp:    b.insurance_exp || '',
      tax_exp:          b.tax_exp || '',
    })
    setErrors({})
  }

  const openAdd = () => { setAddOpen(true); setForm(DEFAULT_FORM); setErrors({}) }
  const closeDetail = () => { setSelected(null); setErrors({}) }
  const closeAdd    = () => { setAddOpen(false);  setErrors({}) }

  const saveEdit = async () => {
    const e = validate(form)
    setErrors(e)
    if (Object.keys(e).length) return
    setSaving(true)
    try {
      await update(selected.id, form)
      onToast?.({ msg: 'บันทึก ' + form.plate + ' สำเร็จ', kind: 'success' })
      closeDetail()
    } catch (err) {
      onToast?.({ msg: 'เกิดข้อผิดพลาด: ' + err.message, kind: 'error' })
    } finally { setSaving(false) }
  }

  const saveAdd = async () => {
    const e = validate(form)
    setErrors(e)
    if (Object.keys(e).length) return
    setSaving(true)
    try {
      await add(form)
      onToast?.({ msg: 'เพิ่มรถบัส ' + form.plate + ' สำเร็จ', kind: 'success' })
      closeAdd()
    } catch (err) {
      onToast?.({ msg: 'เกิดข้อผิดพลาด: ' + err.message, kind: 'error' })
    } finally { setSaving(false) }
  }

  const confirmDelete = async () => {
    try {
      await remove(deleteTarget.id)
      onToast?.({ msg: 'ลบ ' + deleteTarget.plate + ' สำเร็จ', kind: 'success' })
      setDeleteTarget(null)
    } catch (err) {
      onToast?.({ msg: 'เกิดข้อผิดพลาด: ' + err.message, kind: 'error' })
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>รถบัส</h2>
          <div className="sub">
            {loading ? 'กำลังโหลด...' : `รวม ${buses.length} คัน ทั่ว 3 โรงงาน • ใช้งาน ${buses.filter(b => b.status === 'active').length} • ซ่อม ${buses.filter(b => b.status === 'maintenance').length} • ปลดระวาง ${buses.filter(b => b.status === 'retired').length}`}
          </div>
        </div>
        <div className="flex gap-8">
          <button className="btn"><Icon name="download" size={15} /> Export</button>
          <button className="btn btn-primary" onClick={openAdd}>
            <Icon name="plus" size={15} /> เพิ่มรถบัส
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
        <div className="seg">
          <button className={busType === 'air' ? 'on' : ''} onClick={() => setBusType('air')}>
            <Icon name="snow" size={14} /> รถปรับอากาศ <span className="count">{airCount}</span>
          </button>
          <button className={busType === 'fan' ? 'on' : ''} onClick={() => setBusType('fan')}>
            <Icon name="fan" size={14} /> รถพัดลม <span className="count">{fanCount}</span>
          </button>
        </div>
        <div className="seg">
          <button className={viewMode === 'card'  ? 'on' : ''} onClick={() => setViewMode('card')}><Icon name="bus" size={14} /> การ์ด</button>
          <button className={viewMode === 'table' ? 'on' : ''} onClick={() => setViewMode('table')}><Icon name="id" size={14} /> ตาราง</button>
        </div>
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
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="all">ทุกสถานะ</option>
            <option value="active">Active</option>
            <option value="maintenance">In Maintenance</option>
            <option value="retired">Retired</option>
          </select>
          <div className="toolbar-spacer" />
          <div className="result-count">{filtered.length} คัน</div>
        </div>

        {viewMode === 'card' ? (
          <div className="bus-grid">
            {loading && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>กำลังโหลด...</div>}
            {!loading && filtered.map(b => (
              <div className="bus-card" key={b.id} onClick={() => openDetail(b, true)}>
                <div className="bus-card-head">
                  <div>
                    <div className="plate">{b.plate}</div>
                    <div className="meta">{b.brand} • ปี {b.year}</div>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
                <div className="body">
                  <div className={'bus-illust ' + (b.type === 'fan' ? 'fan' : '')}>
                    <Icon name={b.type === 'air' ? 'snow' : 'fan'} size={20} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="driver-line">
                      <div className="driver-avatar">{b.driver?.name ? initials(b.driver.name) : '—'}</div>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.driver?.name || '—'}</span>
                    </div>
                    <div className="text-muted text-xs mt-4">
                      <Icon name="factory" size={11} style={{ verticalAlign: '-2px' }} /> {b.factory} • {b.seats} ที่นั่ง
                    </div>
                  </div>
                </div>
                <div className="stats">
                  <div><div className="stat-label">เลขไมล์</div><div className="stat-val">{formatNumber(b.current_km)} กม.</div></div>
                  <div><div className="stat-label">บำรุงรักษาล่าสุด</div><div className="stat-val">{b.last_service_date || '—'}</div></div>
                </div>
              </div>
            ))}
            {!loading && filtered.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>ไม่พบรถบัสตามเงื่อนไขที่เลือก</div>
            )}
          </div>
        ) : (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>ทะเบียน</th>
                  <th>ยี่ห้อ / รุ่น</th>
                  <th>โรงงาน</th>
                  <th>คนขับ</th>
                  <th style={{ textAlign: 'right' }}>เลขไมล์</th>
                  <th>บำรุงรักษาล่าสุด</th>
                  <th>สถานะ</th>
                  <th style={{ textAlign: 'right' }}>การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan="8" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>กำลังโหลด...</td></tr>
                )}
                {error && (
                  <tr><td colSpan="8" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--danger)' }}>{error}</td></tr>
                )}
                {!loading && !error && filtered.map(b => (
                  <tr key={b.id} className="row-click" onClick={() => openDetail(b, true)}>
                    <td>
                      <div className="flex items-center gap-8">
                        <div className={'bus-illust ' + (b.type === 'fan' ? 'fan' : '')} style={{ width: 40, height: 28 }}>
                          <Icon name={b.type === 'air' ? 'snow' : 'fan'} size={16} />
                        </div>
                        <span className="mono tbl-cell-strong">{b.plate}</span>
                      </div>
                    </td>
                    <td>{[b.brand, b.model].filter(Boolean).join(' ') || '—'}</td>
                    <td>{b.factory}</td>
                    <td>
                      {b.driver?.name
                        ? <div className="user-cell">
                            <div className="avatar-sm" style={{ width: 22, height: 22, fontSize: 9 }}>{initials(b.driver.name)}</div>
                            <span>{b.driver.name}</span>
                          </div>
                        : <span className="text-muted">—</span>
                      }
                    </td>
                    <td className="mono" style={{ textAlign: 'right' }}>{formatNumber(b.current_km)}</td>
                    <td className="text-muted">{b.last_service_date || '—'}</td>
                    <td><StatusBadge status={b.status} /></td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className="tbl-actions">
                        <button className="icon-btn" title="ดู"    onClick={() => openDetail(b, true)}><Icon name="eye"   size={15} /></button>
                        <button className="icon-btn" title="แก้ไข" onClick={() => openDetail(b, false)}><Icon name="edit"  size={15} /></button>
                        <button className="icon-btn" title="ลบ" style={{ color: 'var(--danger)' }} onClick={() => setDeleteTarget(b)}><Icon name="trash" size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && !error && filtered.length === 0 && (
                  <tr><td colSpan="8" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>ไม่พบรถบัสตามเงื่อนไขที่เลือก</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View / Edit Drawer */}
      <Drawer
        open={!!selected}
        title={selected ? `รถบัส • ${selected.plate}` : ''}
        onClose={closeDetail}
        footer={
          isView ? (
            <button className="btn" onClick={closeDetail}>ปิด</button>
          ) : (
            <>
              <button className="btn" onClick={closeDetail}>ยกเลิก</button>
              <button className="btn btn-primary" onClick={saveEdit} disabled={saving}>
                <Icon name="check" size={15} /> {saving ? 'กำลังบันทึก...' : 'บันทึก'}
              </button>
            </>
          )
        }
      >
        {selected && (
          <BusDetail
            bus={selected} tab={tab} setTab={setTab}
            form={form} set={set} errors={errors}
            isView={isView} drivers={drivers}
          />
        )}
      </Drawer>

      {/* Add Drawer */}
      <Drawer
        open={addOpen}
        title="เพิ่มรถบัสใหม่"
        onClose={closeAdd}
        footer={
          <>
            <button className="btn" onClick={closeAdd}>ยกเลิก</button>
            <button className="btn btn-primary" onClick={saveAdd} disabled={saving}>
              <Icon name="check" size={15} /> {saving ? 'กำลังบันทึก...' : 'เพิ่มข้อมูล'}
            </button>
          </>
        }
      >
        <BusForm form={form} set={set} errors={errors} drivers={drivers} />
      </Drawer>

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="modal-scrim" onClick={() => setDeleteTarget(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div className="modal-ico" style={{ background: 'var(--danger-50)', color: 'var(--danger)' }}>
              <Icon name="trash" size={26} />
            </div>
            <h3 className="modal-title">ยืนยันการลบ</h3>
            <p className="modal-text">ต้องการลบรถ <strong>{deleteTarget.plate}</strong> ({deleteTarget.code}) ออกจากระบบหรือไม่? การดำเนินการนี้ไม่สามารถยกเลิกได้</p>
            <div className="flex gap-8" style={{ justifyContent: 'center' }}>
              <button className="btn" onClick={() => setDeleteTarget(null)}>ยกเลิก</button>
              <button className="btn btn-danger" onClick={confirmDelete}>ลบรถบัส</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function BusDetail({ bus, tab, setTab, form, set, errors, isView, drivers }) {
  const pct = Number(form.next_service_km) > 0
    ? Math.max(0, Math.min(110, (Number(form.current_km) / Number(form.next_service_km)) * 100))
    : 0

  const [logs, setLogs]           = useState([])
  const [logsLoading, setLogsLoading] = useState(false)

  useEffect(() => {
    if (tab !== 'maintenance') return
    setLogsLoading(true)
    fetchBusLogs(bus.id)
      .then(data => setLogs(data))
      .catch(() => setLogs([]))
      .finally(() => setLogsLoading(false))
  }, [tab, bus.id])

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 18, borderBottom: '1px solid var(--border)', marginBottom: 18 }}>
        <div className={'bus-illust ' + (bus.type === 'fan' ? 'fan' : '')} style={{ width: 56, height: 46 }}>
          <Icon name={bus.type === 'air' ? 'snow' : 'fan'} size={22} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 19, fontWeight: 700, color: 'var(--text-strong)', fontFamily: 'var(--font-mono)' }}>{bus.plate}</div>
          <div className="text-muted" style={{ fontSize: 12.5 }}>{[bus.brand, bus.model].filter(Boolean).join(' ')} • ปี {bus.year} • {bus.seats} ที่นั่ง</div>
          <div className="mt-4 flex gap-8">
            <StatusBadge status={bus.status} />
            <span className="badge badge-navy">{bus.factory}</span>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button className={tab === 'info'        ? 'on' : ''} onClick={() => setTab('info')}>ข้อมูลรถ</button>
        <button className={tab === 'maintenance' ? 'on' : ''} onClick={() => setTab('maintenance')}>ประวัติซ่อม</button>
        <button className={tab === 'insurance'   ? 'on' : ''} onClick={() => setTab('insurance')}>ประกัน / ภาษี</button>
      </div>

      {tab === 'info' && (
        <>
          <div className="field-row">
            <div className="field">
              <label>ทะเบียนรถ *</label>
              <input value={form.plate} onChange={e => set('plate', e.target.value)} disabled={isView} className={errors.plate ? 'input-error' : ''} />
              {errors.plate && <div className="field-err">{errors.plate}</div>}
            </div>
            <div className="field">
              <label>ประเภท</label>
              <input value={form.type === 'air' ? 'รถปรับอากาศ' : 'รถพัดลม'} disabled style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }} />
            </div>
          </div>
          <div className="field-row">
            <div className="field"><label>ยี่ห้อ</label><input value={form.brand} onChange={e => set('brand', e.target.value)} disabled={isView} /></div>
            <div className="field"><label>รุ่น</label><input value={form.model} onChange={e => set('model', e.target.value)} disabled={isView} /></div>
          </div>
          <div className="field-row">
            <div className="field"><label>ปีที่ผลิต</label><input type="number" value={form.year} onChange={e => set('year', e.target.value)} disabled={isView} /></div>
            <div className="field"><label>จำนวนที่นั่ง</label><input type="number" value={form.seats} onChange={e => set('seats', e.target.value)} disabled={isView} /></div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>โรงงาน</label>
              <select value={form.factory} onChange={e => set('factory', e.target.value)} disabled={isView}>
                {FACTORIES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div className="field">
              <label>สถานะ</label>
              <select value={form.status} onChange={e => set('status', e.target.value)} disabled={isView}>
                <option value="active">Active</option>
                <option value="maintenance">In Maintenance</option>
                <option value="retired">Retired</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label>คนขับปัจจุบัน</label>
            <select value={form.driver_id} onChange={e => set('driver_id', e.target.value)} disabled={isView}>
              <option value="">— ไม่มีคนขับ —</option>
              {drivers.map(d => <option key={d.id} value={d.id}>{d.name} ({d.code})</option>)}
            </select>
          </div>
          <div className="field-row">
            <div className="field"><label>เลขไมล์ปัจจุบัน</label><input type="number" value={form.current_km} onChange={e => set('current_km', e.target.value)} disabled={isView} /></div>
            <div className="field"><label>รอบซ่อมถัดไป (กม.)</label><input type="number" value={form.next_service_km} onChange={e => set('next_service_km', e.target.value)} disabled={isView} /></div>
          </div>
          {Number(form.next_service_km) > 0 && (
            <div className="field">
              <label>ความคืบหน้าบำรุงรักษา ({pct.toFixed(0)}%)</label>
              <div style={{ marginTop: 6 }}>
                <div className={'progress ' + (pct >= 100 ? 'danger' : pct >= 80 ? 'warn' : '')}>
                  <div className="bar" style={{ width: Math.min(100, pct) + '%' }}></div>
                </div>
                <div className="text-xs text-muted mt-4 mono">
                  {formatNumber(Number(form.current_km))} กม. / {formatNumber(Number(form.next_service_km))} กม.
                </div>
              </div>
            </div>
          )}
          <div className="field">
            <label>วันที่บำรุงรักษาล่าสุด</label>
            <input type="date" value={form.last_service_date} onChange={e => set('last_service_date', e.target.value)} disabled={isView} />
          </div>
        </>
      )}

      {tab === 'maintenance' && (
        logsLoading ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>กำลังโหลด...</div>
        ) : logs.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Icon name="wrench" size={28} style={{ color: 'var(--text-faint)', marginBottom: 8 }} />
            <div>ยังไม่มีประวัติการซ่อมบำรุง</div>
          </div>
        ) : (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>วันที่</th>
                  <th>ประเภท</th>
                  <th style={{ textAlign: 'right' }}>เลขไมล์</th>
                  <th>รายละเอียด</th>
                  <th style={{ textAlign: 'right' }}>ค่าใช้จ่าย</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(l => (
                  <tr key={l.id}>
                    <td className="mono text-muted">{l.date}</td>
                    <td>
                      <span className={'badge ' + (KIND_BADGE[l.kind] || 'badge-neutral')}>
                        {KIND_LABEL[l.kind] || l.kind}
                      </span>
                    </td>
                    <td className="mono" style={{ textAlign: 'right' }}>{formatNumber(l.km_at_service)}</td>
                    <td className="text-muted" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {l.description || '—'}
                    </td>
                    <td className="mono tbl-cell-strong" style={{ textAlign: 'right' }}>{baht(l.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {tab === 'insurance' && (
        <div className="field-row">
          <div className="field">
            <label>วันหมดอายุประกันภัย</label>
            <input type="date" value={form.insurance_exp} onChange={e => set('insurance_exp', e.target.value)} disabled={isView} />
          </div>
          <div className="field">
            <label>วันหมดอายุภาษีรถ</label>
            <input type="date" value={form.tax_exp} onChange={e => set('tax_exp', e.target.value)} disabled={isView} />
          </div>
        </div>
      )}
    </div>
  )
}

function BusForm({ form, set, errors, drivers }) {
  return (
    <>
      <div className="field-row">
        <div className="field">
          <label>ทะเบียนรถ *</label>
          <input value={form.plate} onChange={e => set('plate', e.target.value)} className={errors.plate ? 'input-error' : ''} placeholder="เช่น 40-1234 อย" />
          {errors.plate && <div className="field-err">{errors.plate}</div>}
        </div>
        <div className="field">
          <label>ประเภท *</label>
          <select value={form.type} onChange={e => set('type', e.target.value)}>
            <option value="air">รถปรับอากาศ</option>
            <option value="fan">รถพัดลม</option>
          </select>
        </div>
      </div>
      <div className="field-row">
        <div className="field"><label>ยี่ห้อ</label><input value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="Hino" /></div>
        <div className="field"><label>รุ่น</label><input value={form.model} onChange={e => set('model', e.target.value)} placeholder="RK1J" /></div>
      </div>
      <div className="field-row">
        <div className="field"><label>ปีที่ผลิต</label><input type="number" value={form.year} onChange={e => set('year', e.target.value)} placeholder="2020" /></div>
        <div className="field"><label>จำนวนที่นั่ง</label><input type="number" value={form.seats} onChange={e => set('seats', e.target.value)} placeholder="45" /></div>
      </div>
      <div className="field-row">
        <div className="field">
          <label>โรงงาน *</label>
          <select value={form.factory} onChange={e => set('factory', e.target.value)}>
            {FACTORIES.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div className="field">
          <label>สถานะ</label>
          <select value={form.status} onChange={e => set('status', e.target.value)}>
            <option value="active">Active</option>
            <option value="maintenance">In Maintenance</option>
            <option value="retired">Retired</option>
          </select>
        </div>
      </div>
      <div className="field">
        <label>คนขับปัจจุบัน</label>
        <select value={form.driver_id} onChange={e => set('driver_id', e.target.value)}>
          <option value="">— ไม่มีคนขับ —</option>
          {drivers.map(d => <option key={d.id} value={d.id}>{d.name} ({d.code})</option>)}
        </select>
      </div>
      <div className="field-row">
        <div className="field"><label>เลขไมล์ปัจจุบัน</label><input type="number" value={form.current_km} onChange={e => set('current_km', e.target.value)} placeholder="0" /></div>
        <div className="field"><label>รอบซ่อมถัดไป (กม.)</label><input type="number" value={form.next_service_km} onChange={e => set('next_service_km', e.target.value)} /></div>
      </div>
      <div className="field">
        <label>วันที่บำรุงรักษาล่าสุด</label>
        <input type="date" value={form.last_service_date} onChange={e => set('last_service_date', e.target.value)} />
      </div>
      <div className="field-row">
        <div className="field"><label>วันหมดอายุประกันภัย</label><input type="date" value={form.insurance_exp} onChange={e => set('insurance_exp', e.target.value)} /></div>
        <div className="field"><label>วันหมดอายุภาษีรถ</label><input type="date" value={form.tax_exp} onChange={e => set('tax_exp', e.target.value)} /></div>
      </div>
    </>
  )
}
