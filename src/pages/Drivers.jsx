import { useState, useMemo, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Icon from '../components/Icon'
import { StatusBadge, Avatar, Drawer, Pagination } from '../components/ui'
import { FACTORIES, ROUTES, SHIFTS, initials } from '../lib/mockData'
import { useDrivers, fetchDriverDetail } from '../hooks/useDrivers'

const DEFAULT_ADD = { name: '', idCard: '', phone: '', factory: 'บางปะอิน', route: ROUTES[0], shift: '0', licenseType: 'B2', licenseExp: '', joined: '' }

function fmtIdCard(raw) {
  const s = (raw || '').replace(/\D/g, '')
  if (s.length !== 13) return raw
  return `${s[0]}-${s.slice(1,5)}-${s.slice(5,10)}-${s.slice(10,12)}-${s[12]}`
}

function validateAdd(f) {
  const e = {}
  if (!f.name.trim()) e.name = 'กรอกชื่อ'
  if (!f.idCard.trim()) e.idCard = 'กรอกเลขบัตรประชาชน'
  else if (f.idCard.length !== 11) e.idCard = 'ต้องมี 11 หลัก'
  if (!f.phone.trim()) e.phone = 'กรอกเบอร์โทร'
  if (!f.licenseExp) e.licenseExp = 'กรอกวันหมดอายุ'
  if (!f.joined) e.joined = 'กรอกวันเริ่มงาน'
  return e
}

export default function Drivers() {
  const { onToast } = useOutletContext() || {}
  const { drivers, loading, error, add, update, remove } = useDrivers()

  const [search, setSearch] = useState('')
  const [factory, setFactory] = useState('all')
  const [route, setRoute] = useState('all')
  const [shift, setShift] = useState('all')
  const [status, setStatus] = useState('all')
  const [sortKey, setSortKey] = useState('code')
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const [selected, setSelected] = useState(null)
  const [isView, setIsView] = useState(false)
  const [editForm, setEditForm] = useState(null)
  const [tab, setTab] = useState('info')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const [addOpen, setAddOpen] = useState(false)
  const [addForm, setAddForm] = useState(DEFAULT_ADD)
  const [addErrors, setAddErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const openDetail = (d, view = false) => {
    setSelected(d)
    setIsView(view)
    setEditForm({
      name: d.name, idCard: d.id_card, phone: d.phone || '',
      factory: d.factory, route: d.route || ROUTES[0], shift: String(d.shift ?? 0),
      licenseType: d.license_type || 'B2', licenseExp: d.license_exp || '',
      joined: d.joined || '', status: d.status,
    })
    setTab('info')
  }

  const confirmDelete = async () => {
    try {
      await remove(deleteTarget.id)
      onToast?.({ msg: 'ลบ ' + deleteTarget.name + ' สำเร็จ', kind: 'success' })
      setDeleteTarget(null)
    } catch (e) {
      onToast?.({ msg: 'เกิดข้อผิดพลาด: ' + e.message, kind: 'error' })
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await update(selected.id, editForm)
      onToast?.({ msg: 'บันทึกข้อมูล ' + editForm.name + ' สำเร็จ', kind: 'success' })
      setSelected(null)
    } catch (e) {
      onToast?.({ msg: 'เกิดข้อผิดพลาด: ' + e.message, kind: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleAdd = async () => {
    const e = validateAdd(addForm)
    setAddErrors(e)
    if (Object.keys(e).length) return
    setSaving(true)
    try {
      await add(addForm)
      onToast?.({ msg: 'เพิ่มพนักงานขับรถ ' + addForm.name + ' สำเร็จ', kind: 'success' })
      setAddOpen(false)
      setAddForm(DEFAULT_ADD)
      setAddErrors({})
    } catch (e) {
      onToast?.({ msg: 'เกิดข้อผิดพลาด: ' + e.message, kind: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const filtered = useMemo(() => {
    let rows = drivers.filter(d => {
      if (search && !(d.name.includes(search) || d.code.toLowerCase().includes(search.toLowerCase()) || (d.phone || '').includes(search))) return false
      if (factory !== 'all' && d.factory !== factory) return false
      if (route   !== 'all' && d.route   !== route)   return false
      if (shift   !== 'all' && String(d.shift) !== shift) return false
      if (status  !== 'all' && d.status  !== status)  return false
      return true
    })
    rows.sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey]
      if (typeof av === 'string') av = av.toLowerCase()
      if (typeof bv === 'string') bv = bv.toLowerCase()
      return (av < bv ? -1 : av > bv ? 1 : 0) * (sortDir === 'asc' ? 1 : -1)
    })
    return rows
  }, [drivers, search, factory, route, shift, status, sortKey, sortDir])

  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize)
  useEffect(() => { setPage(1) }, [search, factory, route, shift, status])

  const toggleSort = (k) => {
    if (sortKey === k) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(k); setSortDir('asc') }
  }
  const Th = ({ k, children }) => (
    <th className={'sortable ' + (sortKey === k ? 'sorted' : '')} onClick={() => toggleSort(k)}>
      {children}<span className="sort-ind">{sortKey === k ? (sortDir === 'asc' ? '▲' : '▼') : '↕'}</span>
    </th>
  )

  const active = drivers.filter(d => d.status === 'active').length
  const inactive = drivers.filter(d => d.status === 'inactive').length

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>พนักงานขับรถ</h2>
          <div className="sub">รวม {drivers.length} คน • ใช้งาน {active} คน • ไม่ใช้งาน {inactive} คน</div>
        </div>
        <div className="flex gap-8">
          <button className="btn"><Icon name="download" size={15} /> Export</button>
          <button className="btn btn-primary" onClick={() => { setAddForm(DEFAULT_ADD); setAddErrors({}); setAddOpen(true) }}>
            <Icon name="plus" size={15} /> เพิ่มพนักงานขับรถ
          </button>
        </div>
      </div>

      <div className="card">
        <div className="toolbar">
          <div className="search">
            <span className="ico"><Icon name="search" size={15} /></span>
            <input placeholder="ค้นหา ชื่อ, รหัส, เบอร์โทร…" value={search} onChange={e => setSearch(e.target.value)} />
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
                <Th k="code">รหัส</Th>
                <Th k="name">ชื่อ — สกุล</Th>
                <th>เลขบัตรประชาชน</th>
                <Th k="factory">โรงงาน</Th>
                <Th k="route">เส้นทาง</Th>
                <Th k="shift">กะ</Th>
                <Th k="status">สถานะ</Th>
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
              {!loading && !error && pageRows.map(d => (
                <tr key={d.id} className="row-click" onClick={() => openDetail(d)}>
                  <td className="mono tbl-cell-strong">{d.code}</td>
                  <td>
                    <div className="user-cell">
                      <Avatar name={d.name} />
                      <div>
                        <div className="user-name">{d.name}</div>
                        <div className="user-sub">{d.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="mono text-muted">{fmtIdCard(d.id_card)}</td>
                  <td>{d.factory}</td>
                  <td>{d.route}</td>
                  <td className="text-muted">{SHIFTS[d.shift]?.split(' ')[0]}</td>
                  <td><StatusBadge status={d.status} /></td>
                  <td onClick={e => e.stopPropagation()}>
                    <div className="tbl-actions">
                      <button className="icon-btn" title="ดู" onClick={() => openDetail(d, true)}>
                        <Icon name="eye" size={15} />
                      </button>
                      <button className="icon-btn" title="แก้ไข" onClick={() => openDetail(d, false)}>
                        <Icon name="edit" size={15} />
                      </button>
                      <button className="icon-btn" title="ลบ" style={{ color: 'var(--danger)' }} onClick={() => setDeleteTarget(d)}>
                        <Icon name="trash" size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && !error && pageRows.length === 0 && (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  ไม่พบข้อมูลตามเงื่อนไขที่เลือก
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={page} pageSize={pageSize} total={filtered.length} onChange={setPage} />
      </div>

      {/* Detail / Edit Drawer */}
      <Drawer
        open={!!selected}
        title={selected ? `พนักงานขับรถ • ${selected.name}` : ''}
        onClose={() => setSelected(null)}
        footer={
          <>
            <button className="btn" onClick={() => setSelected(null)}>ปิด</button>
            {!isView && (
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                <Icon name="check" size={15} /> {saving ? 'กำลังบันทึก...' : 'บันทึก'}
              </button>
            )}
          </>
        }
      >
        {selected && editForm && (
          <DriverDetail driver={selected} tab={tab} setTab={setTab} editForm={editForm} setEditForm={setEditForm} />
        )}
      </Drawer>

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="modal-scrim" onClick={() => setDeleteTarget(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div className="modal-ico" style={{ background: 'var(--danger-50)', color: 'var(--danger)' }}>
              <Icon name="trash" size={26} />
            </div>
            <h3 className="modal-title">ยืนยันการลบ</h3>
            <p className="modal-text">ต้องการลบพนักงานขับรถ <strong>{deleteTarget.name}</strong> ออกจากระบบหรือไม่? การดำเนินการนี้ไม่สามารถยกเลิกได้</p>
            <div className="flex gap-8" style={{ justifyContent: 'center' }}>
              <button className="btn" onClick={() => setDeleteTarget(null)}>ยกเลิก</button>
              <button className="btn btn-danger" onClick={confirmDelete}>ลบพนักงาน</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Drawer */}
      <Drawer
        open={addOpen}
        title="เพิ่มพนักงานขับรถใหม่"
        onClose={() => setAddOpen(false)}
        footer={
          <>
            <button className="btn" onClick={() => setAddOpen(false)}>ยกเลิก</button>
            <button className="btn btn-primary" onClick={handleAdd} disabled={saving}>
              <Icon name="check" size={15} /> {saving ? 'กำลังบันทึก...' : 'เพิ่มข้อมูล'}
            </button>
          </>
        }
      >
        <AddDriverForm form={addForm} setForm={setAddForm} errors={addErrors} />
      </Drawer>
    </div>
  )
}

function DriverDetail({ driver, tab, setTab, editForm, setEditForm }) {
  const [healthChecks, setHealthChecks] = useState([])
  const [trainingRecords, setTrainingRecords] = useState([])
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    if (tab === 'health' || tab === 'training') {
      setDetailLoading(true)
      fetchDriverDetail(driver.id).then(({ healthChecks, trainingRecords }) => {
        setHealthChecks(healthChecks)
        setTrainingRecords(trainingRecords)
        setDetailLoading(false)
      })
    }
  }, [driver.id, tab])

  const set = (k, v) => setEditForm(f => ({ ...f, [k]: v }))

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 18, borderBottom: '1px solid var(--border)', marginBottom: 18 }}>
        <div className="avatar-sm" style={{ width: 56, height: 56, fontSize: 18, background: 'var(--navy-700)' }}>
          {initials(driver.name)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-strong)' }}>{driver.name}</div>
          <div className="text-muted" style={{ fontSize: 12.5 }}>{driver.code} • {driver.phone}</div>
          <div className="mt-4 flex gap-8">
            <StatusBadge status={driver.status} />
            <span className="badge badge-navy">ใบขับขี่ {driver.license_type}</span>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button className={tab === 'info' ? 'on' : ''} onClick={() => setTab('info')}>ข้อมูลทั่วไป</button>
        <button className={tab === 'health' ? 'on' : ''} onClick={() => setTab('health')}>บันทึกสุขภาพ</button>
        <button className={tab === 'training' ? 'on' : ''} onClick={() => setTab('training')}>ประวัติการอบรม</button>
      </div>

      {tab === 'info' && editForm && (
        <>
          <div className="field-row">
            <div className="field"><label>ชื่อ — สกุล</label><input value={editForm.name} onChange={e => set('name', e.target.value)} /></div>
            <div className="field"><label>รหัสพนักงาน</label><input value={driver.code} disabled style={{ background: 'var(--surface-2)' }} /></div>
          </div>
          <div className="field-row">
            <div className="field"><label>เลขบัตรประชาชน</label><input value={editForm.idCard} onChange={e => set('idCard', e.target.value)} /></div>
            <div className="field"><label>เบอร์โทรศัพท์</label><input value={editForm.phone} onChange={e => set('phone', e.target.value)} /></div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>โรงงาน</label>
              <select value={editForm.factory} onChange={e => set('factory', e.target.value)}>
                {FACTORIES.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div className="field">
              <label>กะการทำงาน</label>
              <select value={editForm.shift} onChange={e => set('shift', e.target.value)}>
                {SHIFTS.map((s, i) => <option key={i} value={String(i)}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="field">
            <label>เส้นทางหลัก</label>
            <select value={editForm.route} onChange={e => set('route', e.target.value)}>
              {ROUTES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="field-row">
            <div className="field">
              <label>ใบขับขี่ประเภท</label>
              <select value={editForm.licenseType} onChange={e => set('licenseType', e.target.value)}>
                <option>B1</option><option>B2</option>
              </select>
            </div>
            <div className="field"><label>วันหมดอายุใบขับขี่</label><input type="date" value={editForm.licenseExp} onChange={e => set('licenseExp', e.target.value)} /></div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>วันที่เริ่มงาน</label>
              <input type="date" value={editForm.joined} onChange={e => set('joined', e.target.value)} />
            </div>
            <div className="field">
              <label>สถานะ</label>
              <select value={editForm.status} onChange={e => set('status', e.target.value)}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </>
      )}

      {tab === 'health' && (
        <div>
          {detailLoading
            ? <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>กำลังโหลด...</div>
            : healthChecks.length === 0
              ? <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>ยังไม่มีบันทึกสุขภาพ</div>
              : healthChecks.map((h, i) => (
                  <div key={i} style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid var(--border)', alignItems: 'center', gap: 12 }}>
                    <Icon name={h.result === 'pass' ? 'check' : 'alert'} size={14} style={{ color: h.result === 'pass' ? 'var(--success)' : 'var(--danger)' }} />
                    <div style={{ flex: 1 }}>
                      <div className="text-strong" style={{ fontSize: 13, fontWeight: 600 }}>{h.note || 'ตรวจสุขภาพประจำ'}</div>
                      <div className="text-muted text-xs">{h.check_date}</div>
                    </div>
                    <span className={'badge ' + (h.result === 'pass' ? 'badge-success' : 'badge-danger')}>
                      {h.result === 'pass' ? 'ผ่าน' : 'ไม่ผ่าน'}
                    </span>
                  </div>
                ))
          }
        </div>
      )}

      {tab === 'training' && (
        <div>
          <div className="card" style={{ boxShadow: 'none', marginBottom: 14 }}>
            <div className="card-head"><div><h3>สรุปการอบรม</h3><div className="sub">รวม {driver.trainings} หลักสูตร</div></div></div>
          </div>
          {detailLoading
            ? <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>กำลังโหลด...</div>
            : trainingRecords.length === 0
              ? <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>ยังไม่มีประวัติการอบรม</div>
              : trainingRecords.map((t, i) => (
                  <div key={i} style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid var(--border)', alignItems: 'center', gap: 12 }}>
                    <Icon name="cap" size={14} style={{ color: 'var(--info)' }} />
                    <div style={{ flex: 1 }}>
                      <div className="text-strong" style={{ fontSize: 13, fontWeight: 600 }}>{t.course?.name}</div>
                      <div className="text-muted text-xs">{t.trained_date} • หมดอายุ {t.expires_date || '-'}</div>
                    </div>
                    <span className={'badge ' + (t.expires_date && t.expires_date > new Date().toISOString().slice(0, 10) ? 'badge-success' : 'badge-warning')}>
                      {t.expires_date && t.expires_date > new Date().toISOString().slice(0, 10) ? 'ยังใช้ได้' : 'หมดอายุ'}
                    </span>
                  </div>
                ))
          }
        </div>
      )}
    </div>
  )
}

function AddDriverForm({ form, setForm, errors }) {
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  return (
    <>
      <div className="field-row">
        <div className="field">
          <label>ชื่อ — สกุล *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} className={errors.name ? 'input-error' : ''} placeholder="เช่น สมชาย ใจดี" />
          {errors.name && <div className="field-err">{errors.name}</div>}
        </div>
        <div className="field">
          <label>รหัสพนักงาน</label>
          <input value="สร้างอัตโนมัติ" disabled style={{ background: 'var(--surface-2)' }} />
          <span className="hint">ระบบสร้างให้อัตโนมัติ</span>
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label>เลขบัตรประชาชน *</label>
          <input
            value={form.idCard}
            onChange={e => set('idCard', e.target.value.replace(/\D/g, '').slice(0, 11))}
            className={errors.idCard ? 'input-error' : ''}
            placeholder="12345678901"
            inputMode="numeric"
          />
          {errors.idCard && <div className="field-err">{errors.idCard}</div>}
        </div>
        <div className="field">
          <label>เบอร์โทรศัพท์ *</label>
          <input value={form.phone} onChange={e => set('phone', e.target.value)} className={errors.phone ? 'input-error' : ''} placeholder="08X-XXX-XXXX" />
          {errors.phone && <div className="field-err">{errors.phone}</div>}
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label>โรงงาน *</label>
          <select value={form.factory} onChange={e => set('factory', e.target.value)}>
            {FACTORIES.map(f => <option key={f}>{f}</option>)}
          </select>
        </div>
        <div className="field">
          <label>กะการทำงาน *</label>
          <select value={form.shift} onChange={e => set('shift', e.target.value)}>
            {SHIFTS.map((s, i) => <option key={i} value={String(i)}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className="field">
        <label>เส้นทางหลัก *</label>
        <select value={form.route} onChange={e => set('route', e.target.value)}>
          {ROUTES.map(r => <option key={r}>{r}</option>)}
        </select>
      </div>
      <div className="field-row">
        <div className="field">
          <label>ใบขับขี่ประเภท *</label>
          <select value={form.licenseType} onChange={e => set('licenseType', e.target.value)}>
            <option>B1</option><option>B2</option>
          </select>
        </div>
        <div className="field">
          <label>วันหมดอายุใบขับขี่ *</label>
          <input type="date" value={form.licenseExp} onChange={e => set('licenseExp', e.target.value)} className={errors.licenseExp ? 'input-error' : ''} />
          {errors.licenseExp && <div className="field-err">{errors.licenseExp}</div>}
        </div>
      </div>
      <div className="field">
        <label>วันที่เริ่มงาน *</label>
        <input type="date" value={form.joined} onChange={e => set('joined', e.target.value)} className={errors.joined ? 'input-error' : ''} />
        {errors.joined && <div className="field-err">{errors.joined}</div>}
      </div>
    </>
  )
}
