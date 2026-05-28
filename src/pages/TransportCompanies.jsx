import { useState, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import Icon from '../components/Icon'
import { StatusBadge, Drawer } from '../components/ui'
import { useTransportCompanies } from '../hooks/useTransportCompanies'
import { supabase } from '../lib/supabase'
import { formatBaht } from '../lib/utils'

const DEFAULT_FORM = {
  code: '', name_th: '', name_en: '', contact: '', phone: '', email: '',
  address: '', tax_id: '', contract_start: '', contract_end: '',
  rate_per_month: '', status: 'active', note: '',
}

function validate(form, isEdit, originalCode, allCodes) {
  const e = {}
  if (!form.code.trim())    e.code    = 'กรอกรหัสบริษัท'
  if (!form.name_th.trim()) e.name_th = 'กรอกชื่อบริษัท (ไทย)'
  const code = form.code.trim().toUpperCase()
  if (code && allCodes.filter(c => c !== (isEdit ? originalCode : null)).includes(code)) {
    e.code = 'รหัสนี้มีอยู่แล้ว'
  }
  return e
}

export default function TransportCompanies() {
  const { onToast } = useOutletContext() || {}
  const { companies, loading, error, add, update, remove } = useTransportCompanies()

  const [search, setSearch]       = useState('')
  const [statusFilter, setStatus] = useState('all')

  const [selected, setSelected]   = useState(null)
  const [isView, setIsView]       = useState(false)
  const [addOpen, setAddOpen]     = useState(false)
  const [form, setForm]           = useState(DEFAULT_FORM)
  const [errors, setErrors]       = useState({})
  const [saving, setSaving]       = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [busCount, setBusCount]   = useState(0)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const filtered = useMemo(() => companies.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    if (search) {
      const q = search.toLowerCase()
      if (!(
        c.code.toLowerCase().includes(q) ||
        c.name_th.toLowerCase().includes(q) ||
        (c.name_en || '').toLowerCase().includes(q) ||
        (c.contact || '').toLowerCase().includes(q)
      )) return false
    }
    return true
  }), [companies, statusFilter, search])

  const openDetail = (c, view = false) => {
    setSelected(c)
    setIsView(view)
    setForm({
      code:           c.code,
      name_th:        c.name_th,
      name_en:        c.name_en || '',
      contact:        c.contact || '',
      phone:          c.phone || '',
      email:          c.email || '',
      address:        c.address || '',
      tax_id:         c.tax_id || '',
      contract_start: c.contract_start || '',
      contract_end:   c.contract_end || '',
      rate_per_month: c.rate_per_month ? String(c.rate_per_month) : '',
      status:         c.status,
      note:           c.note || '',
    })
    setErrors({})
  }

  const openAdd = () => { setAddOpen(true); setForm(DEFAULT_FORM); setErrors({}) }
  const closeDetail = () => { setSelected(null); setErrors({}) }
  const closeAdd    = () => { setAddOpen(false); setErrors({}) }

  const allCodes = companies.map(c => c.code)

  const saveEdit = async () => {
    const e = validate(form, true, selected.code, allCodes)
    setErrors(e)
    if (Object.keys(e).length) return
    setSaving(true)
    try {
      await update(selected.id, form)
      onToast?.({ msg: 'บันทึก ' + form.name_th + ' สำเร็จ', kind: 'success' })
      closeDetail()
    } catch (err) {
      onToast?.({ msg: 'เกิดข้อผิดพลาด: ' + err.message, kind: 'error' })
    } finally { setSaving(false) }
  }

  const saveAdd = async () => {
    const e = validate(form, false, null, allCodes)
    setErrors(e)
    if (Object.keys(e).length) return
    setSaving(true)
    try {
      await add(form)
      onToast?.({ msg: 'เพิ่มบริษัท ' + form.name_th + ' สำเร็จ', kind: 'success' })
      closeAdd()
    } catch (err) {
      onToast?.({ msg: 'เกิดข้อผิดพลาด: ' + err.message, kind: 'error' })
    } finally { setSaving(false) }
  }

  const askDelete = async (c) => {
    const { count } = await supabase.from('buses').select('id', { count: 'exact', head: true }).eq('company_id', c.id)
    setBusCount(count || 0)
    setDeleteTarget(c)
  }

  const confirmDelete = async () => {
    try {
      await remove(deleteTarget.id)
      onToast?.({ msg: 'ลบ ' + deleteTarget.name_th + ' สำเร็จ', kind: 'success' })
      setDeleteTarget(null)
    } catch (err) {
      onToast?.({ msg: 'เกิดข้อผิดพลาด: ' + err.message, kind: 'error' })
    }
  }

  const activeCount   = companies.filter(c => c.status === 'active').length
  const inactiveCount = companies.filter(c => c.status === 'inactive').length

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>บริษัทขนส่ง</h2>
          <div className="sub">
            {loading ? 'กำลังโหลด...' : `รวม ${companies.length} บริษัท • ใช้งาน ${activeCount} • หยุดใช้ ${inactiveCount}`}
          </div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Icon name="plus" size={15} /> เพิ่มบริษัทขนส่ง
        </button>
      </div>

      <div className="card">
        <div className="toolbar">
          <div className="search">
            <span className="ico"><Icon name="search" size={15} /></span>
            <input
              placeholder="ค้นหา รหัส, ชื่อ, ผู้ติดต่อ…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select value={statusFilter} onChange={e => setStatus(e.target.value)}>
            <option value="all">ทุกสถานะ</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="toolbar-spacer" />
          <div className="result-count">{filtered.length} บริษัท</div>
        </div>

        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>รหัส</th>
                <th>ชื่อบริษัท</th>
                <th>ผู้ติดต่อ</th>
                <th>เบอร์โทร</th>
                <th>สัญญาถึง</th>
                <th style={{ textAlign: 'right' }}>อัตรา/เดือน</th>
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
              {!loading && !error && filtered.map(c => (
                <tr key={c.id} className="row-click" onClick={() => openDetail(c, true)}>
                  <td><span className="badge badge-navy mono">{c.code}</span></td>
                  <td>
                    <div className="tbl-cell-strong">{c.name_th}</div>
                    {c.name_en && <div className="text-muted" style={{ fontSize: 11.5 }}>{c.name_en}</div>}
                  </td>
                  <td>{c.contact || <span className="text-muted">—</span>}</td>
                  <td className="mono text-muted">{c.phone || '—'}</td>
                  <td className="text-muted">{c.contract_end || '—'}</td>
                  <td className="mono tbl-cell-strong" style={{ textAlign: 'right' }}>
                    {c.rate_per_month ? formatBaht(c.rate_per_month) : <span className="text-muted">—</span>}
                  </td>
                  <td><StatusBadge status={c.status} /></td>
                  <td onClick={e => e.stopPropagation()}>
                    <div className="tbl-actions">
                      <button className="icon-btn" title="ดู"    onClick={() => openDetail(c, true)}><Icon name="eye"   size={15} /></button>
                      <button className="icon-btn" title="แก้ไข" onClick={() => openDetail(c, false)}><Icon name="edit"  size={15} /></button>
                      <button className="icon-btn" title="ลบ" style={{ color: 'var(--danger)' }} onClick={() => askDelete(c)}><Icon name="trash" size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && !error && filtered.length === 0 && (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>ไม่พบบริษัทขนส่งตามเงื่อนไขที่เลือก</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View / Edit Drawer */}
      <Drawer
        open={!!selected}
        title={selected ? `บริษัทขนส่ง • ${selected.code}` : ''}
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
        {selected && <CompanyForm form={form} set={set} errors={errors} isView={isView} />}
      </Drawer>

      {/* Add Drawer */}
      <Drawer
        open={addOpen}
        title="เพิ่มบริษัทขนส่งใหม่"
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
        <CompanyForm form={form} set={set} errors={errors} isView={false} />
      </Drawer>

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="modal-scrim" onClick={() => setDeleteTarget(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <div className="modal-ico" style={{ background: 'var(--danger-50)', color: 'var(--danger)' }}>
              <Icon name="trash" size={26} />
            </div>
            <h3 className="modal-title">ยืนยันการลบ</h3>
            {busCount > 0 ? (
              <p className="modal-text">
                บริษัท <strong>{deleteTarget.name_th}</strong> มีรถบัสในสังกัด{' '}
                <strong style={{ color: 'var(--danger)' }}>{busCount} คัน</strong>{' '}
                หากลบ รถบัสเหล่านั้นจะไม่มีบริษัทขนส่ง ต้องการดำเนินการต่อหรือไม่?
              </p>
            ) : (
              <p className="modal-text">
                ต้องการลบบริษัท <strong>{deleteTarget.name_th}</strong> ออกจากระบบหรือไม่?
                การดำเนินการนี้ไม่สามารถยกเลิกได้
              </p>
            )}
            <div className="flex gap-8" style={{ justifyContent: 'center' }}>
              <button className="btn" onClick={() => setDeleteTarget(null)}>ยกเลิก</button>
              <button className="btn btn-danger" onClick={confirmDelete}>ลบบริษัท</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CompanyForm({ form, set, errors, isView }) {
  return (
    <>
      <div className="field-row">
        <div className="field">
          <label>รหัสบริษัท *</label>
          <input
            value={form.code}
            onChange={e => set('code', e.target.value.toUpperCase())}
            disabled={isView}
            className={errors.code ? 'input-error' : ''}
            placeholder="เช่น TC001"
            style={{ fontFamily: 'var(--font-mono)' }}
          />
          {errors.code && <div className="field-err">{errors.code}</div>}
        </div>
        <div className="field">
          <label>สถานะ</label>
          <select value={form.status} onChange={e => set('status', e.target.value)} disabled={isView}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label>ชื่อบริษัท (ไทย) *</label>
        <input
          value={form.name_th}
          onChange={e => set('name_th', e.target.value)}
          disabled={isView}
          className={errors.name_th ? 'input-error' : ''}
          placeholder="บริษัท ขนส่งไทย จำกัด"
        />
        {errors.name_th && <div className="field-err">{errors.name_th}</div>}
      </div>

      <div className="field">
        <label>ชื่อบริษัท (อังกฤษ)</label>
        <input
          value={form.name_en}
          onChange={e => set('name_en', e.target.value)}
          disabled={isView}
          placeholder="Thai Transport Co., Ltd."
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label>ผู้ติดต่อ</label>
          <input value={form.contact} onChange={e => set('contact', e.target.value)} disabled={isView} placeholder="ชื่อผู้ติดต่อ" />
        </div>
        <div className="field">
          <label>เบอร์โทร</label>
          <input value={form.phone} onChange={e => set('phone', e.target.value)} disabled={isView} placeholder="0812345678" style={{ fontFamily: 'var(--font-mono)' }} />
        </div>
      </div>

      <div className="field">
        <label>อีเมล</label>
        <input type="email" value={form.email} onChange={e => set('email', e.target.value)} disabled={isView} placeholder="contact@company.co.th" />
      </div>

      <div className="field">
        <label>ที่อยู่</label>
        <textarea
          value={form.address}
          onChange={e => set('address', e.target.value)}
          disabled={isView}
          rows={2}
          placeholder="ที่อยู่บริษัท"
          style={{ resize: 'vertical' }}
        />
      </div>

      <div className="field">
        <label>เลขประจำตัวผู้เสียภาษี</label>
        <input
          value={form.tax_id}
          onChange={e => set('tax_id', e.target.value)}
          disabled={isView}
          placeholder="0105xxxxxxx"
          style={{ fontFamily: 'var(--font-mono)' }}
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label>วันเริ่มสัญญา</label>
          <input type="date" value={form.contract_start} onChange={e => set('contract_start', e.target.value)} disabled={isView} />
        </div>
        <div className="field">
          <label>วันสิ้นสุดสัญญา</label>
          <input type="date" value={form.contract_end} onChange={e => set('contract_end', e.target.value)} disabled={isView} />
        </div>
      </div>

      <div className="field">
        <label>อัตราค่าบริการ / เดือน (บาท)</label>
        <input
          type="number"
          value={form.rate_per_month}
          onChange={e => set('rate_per_month', e.target.value)}
          disabled={isView}
          placeholder="0"
          style={{ fontFamily: 'var(--font-mono)' }}
        />
      </div>

      <div className="field">
        <label>หมายเหตุ</label>
        <textarea
          value={form.note}
          onChange={e => set('note', e.target.value)}
          disabled={isView}
          rows={3}
          placeholder="หมายเหตุเพิ่มเติม"
          style={{ resize: 'vertical' }}
        />
      </div>
    </>
  )
}
