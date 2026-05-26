import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import Icon from '../components/Icon'
import { initials } from '../lib/mockData'
import { useUsers } from '../hooks/useUsers'

const DEFAULT_FORM = { name: '', email: '', username: '', role: 'operation', password: '', confirm: '' }

function validate(form, isEdit, users, editId) {
  const e = {}
  if (!form.name.trim()) e.name = 'กรอกชื่อ'
  if (!form.username.trim()) e.username = 'กรอก User ID'
  else if (!/^[a-z0-9_]+$/.test(form.username)) e.username = 'ใช้ได้เฉพาะ a-z, 0-9, _'
  if (!isEdit) {
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'อีเมลไม่ถูกต้อง'
    if (!form.password) e.password = 'กรอกรหัสผ่าน'
    else if (form.password.length < 6) e.password = 'ต้องมีอย่างน้อย 6 ตัวอักษร'
    if (form.password && form.password !== form.confirm) e.confirm = 'รหัสผ่านไม่ตรงกัน'
  }
  return e
}

function fmtDate(ts) {
  if (!ts) return 'ยังไม่เคยเข้าสู่ระบบ'
  return new Date(ts).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' })
}

export default function Users() {
  const { onToast } = useOutletContext() || {}
  const { users, loading, error, add, update, remove } = useUsers()

  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(DEFAULT_FORM)
  const [errors, setErrors] = useState({})
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const openAdd = () => {
    setEditTarget(null)
    setForm(DEFAULT_FORM)
    setErrors({})
    setModalOpen(true)
  }

  const openEdit = (u) => {
    setEditTarget(u)
    setForm({ name: u.name, email: u.email, username: u.username || '', role: u.role, password: '', confirm: '', status: u.status })
    setErrors({})
    setModalOpen(true)
  }

  const closeModal = () => { setModalOpen(false); setEditTarget(null); setErrors({}) }

  const save = async () => {
    const e = validate(form, !!editTarget, users, editTarget?.id)
    setErrors(e)
    if (Object.keys(e).length) return
    setSaving(true)
    try {
      if (editTarget) {
        await update(editTarget.id, form)
        onToast?.({ msg: 'บันทึกข้อมูล ' + form.name + ' สำเร็จ', kind: 'success' })
      } else {
        await add(form)
        onToast?.({ msg: 'เพิ่มผู้ใช้ ' + form.name + ' สำเร็จ', kind: 'success' })
      }
      closeModal()
    } catch (err) {
      const msg = err.message?.includes('username_taken') ? 'User ID นี้ถูกใช้แล้ว'
        : err.message?.includes('email_taken') ? 'อีเมลนี้ถูกใช้แล้ว'
        : 'เกิดข้อผิดพลาด: ' + err.message
      onToast?.({ msg, kind: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    try {
      await remove(deleteTarget.id)
      onToast?.({ msg: 'ลบ ' + deleteTarget.name + ' สำเร็จ', kind: 'success' })
      setDeleteTarget(null)
    } catch (err) {
      onToast?.({ msg: 'เกิดข้อผิดพลาด: ' + err.message, kind: 'error' })
    }
  }

  return (
    <div>
      <div className="page-header">
        <div><h2>การจัดการผู้ใช้งาน</h2><div className="sub">รวม {users.length} บัญชี</div></div>
        <button className="btn btn-primary" onClick={openAdd}><Icon name="plus" size={15} /> เพิ่มผู้ใช้</button>
      </div>

      <div className="card">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>ผู้ใช้งาน</th>
                <th>User ID</th>
                <th>บทบาท</th>
                <th>เข้าสู่ระบบล่าสุด</th>
                <th>สถานะ</th>
                <th style={{ textAlign: 'right' }}>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>กำลังโหลด...</td></tr>
              )}
              {error && (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--danger)' }}>{error}</td></tr>
              )}
              {!loading && !error && users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="user-cell">
                      <div className="avatar-sm">{initials(u.name)}</div>
                      <div>
                        <div className="user-name">{u.name}</div>
                        <div className="user-sub">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="mono text-muted">{u.username}</td>
                  <td>
                    <span className={'role-badge ' + (u.role === 'admin' ? 'role-admin' : 'role-op')}>
                      {u.role === 'admin' ? 'Admin' : 'Operation'}
                    </span>
                  </td>
                  <td className="text-muted">{fmtDate(u.last_sign_in)}</td>
                  <td>
                    <span className={'badge ' + (u.status === 'active' ? 'badge-success' : 'badge-neutral')}>
                      <span className="dot"></span>{u.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="tbl-actions">
                      <button className="icon-btn" title="แก้ไข" onClick={() => openEdit(u)}><Icon name="edit" size={15} /></button>
                      <button className="icon-btn" title="ลบ" style={{ color: 'var(--danger)' }} onClick={() => setDeleteTarget(u)}><Icon name="trash" size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="modal-scrim" onClick={closeModal}>
          <div className="modal modal-form" onClick={e => e.stopPropagation()} role="dialog">
            <button className="modal-close" onClick={closeModal}><Icon name="close" size={18} /></button>
            <div className="modal-form-head">
              <div className="modal-ico" style={{ margin: 0, width: 42, height: 42, borderRadius: 10 }}>
                <Icon name="user" size={20} />
              </div>
              <div>
                <h3 className="modal-title" style={{ textAlign: 'left', marginBottom: 2 }}>{editTarget ? 'แก้ไขผู้ใช้' : 'เพิ่มผู้ใช้ใหม่'}</h3>
                <div className="text-muted text-xs">{editTarget ? editTarget.email : 'กรอกข้อมูลผู้ใช้งาน'}</div>
              </div>
            </div>

            <div className="modal-form-body">
              <div className="field">
                <label>ชื่อ — สกุล *</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} className={errors.name ? 'input-error' : ''} placeholder="เช่น สมชาย ใจดี" />
                {errors.name && <div className="field-err">{errors.name}</div>}
              </div>

              <div className="field">
                <label>User ID (ใช้สำหรับเข้าสู่ระบบ) *</label>
                <input
                  value={form.username}
                  onChange={e => set('username', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  className={errors.username ? 'input-error' : ''}
                  placeholder="เช่น somchai_ops"
                />
                <span className="hint">ใช้ได้เฉพาะตัวพิมพ์เล็ก a–z, ตัวเลข 0–9 และ _</span>
                {errors.username && <div className="field-err">{errors.username}</div>}
              </div>

              {!editTarget && (
                <div className="field">
                  <label>อีเมล *</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className={errors.email ? 'input-error' : ''} placeholder="name@bms.co.th" />
                  {errors.email && <div className="field-err">{errors.email}</div>}
                </div>
              )}

              {editTarget && (
                <div className="field">
                  <label>อีเมล</label>
                  <input value={editTarget.email} disabled style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }} />
                </div>
              )}

              <div className="field">
                <label>บทบาท *</label>
                <div className="role-picker">
                  {[
                    { id: 'admin',     label: 'Admin',     desc: 'เข้าถึงได้ทุกโมดูล รวม User Management' },
                    { id: 'operation', label: 'Operation', desc: 'เข้าถึงโมดูลปฏิบัติการ ไม่เห็น User Management' },
                  ].map(r => (
                    <button key={r.id} type="button" className={'role-opt ' + (form.role === r.id ? 'on' : '')} onClick={() => set('role', r.id)}>
                      <div className="role-opt-head">
                        <span className={'role-badge ' + (r.id === 'admin' ? 'role-admin' : 'role-op')}>{r.label}</span>
                        {form.role === r.id && <Icon name="check" size={14} style={{ color: 'var(--navy-700)' }} />}
                      </div>
                      <div className="role-opt-desc">{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {editTarget && (
                <div className="field">
                  <label>สถานะ</label>
                  <div className="role-picker">
                    {[
                      { id: 'active',   label: 'Active',   desc: 'ใช้งานได้ปกติ' },
                      { id: 'inactive', label: 'Inactive', desc: 'ระงับการใช้งานชั่วคราว' },
                    ].map(s => (
                      <button key={s.id} type="button" className={'role-opt ' + (form.status === s.id ? 'on' : '')} onClick={() => set('status', s.id)}>
                        <div className="role-opt-head">
                          <span className={'badge ' + (s.id === 'active' ? 'badge-success' : 'badge-neutral')}><span className="dot"></span>{s.label}</span>
                          {form.status === s.id && <Icon name="check" size={14} style={{ color: 'var(--navy-700)' }} />}
                        </div>
                        <div className="role-opt-desc">{s.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!editTarget && (
                <>
                  <div className="field">
                    <label>รหัสผ่าน *</label>
                    <input type="password" value={form.password} onChange={e => set('password', e.target.value)} className={errors.password ? 'input-error' : ''} placeholder="••••••••" />
                    {errors.password && <div className="field-err">{errors.password}</div>}
                  </div>
                  <div className="field">
                    <label>ยืนยันรหัสผ่าน *</label>
                    <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)} className={errors.confirm ? 'input-error' : ''} placeholder="••••••••" />
                    {errors.confirm && <div className="field-err">{errors.confirm}</div>}
                  </div>
                </>
              )}
            </div>

            <div className="modal-form-foot">
              <button className="btn" onClick={closeModal}>ยกเลิก</button>
              <button className="btn btn-primary" onClick={save} disabled={saving}>
                <Icon name="check" size={15} /> {saving ? 'กำลังบันทึก...' : editTarget ? 'บันทึก' : 'เพิ่มผู้ใช้'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="modal-scrim" onClick={() => setDeleteTarget(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div className="modal-ico" style={{ background: 'var(--danger-50)', color: 'var(--danger)' }}>
              <Icon name="trash" size={26} />
            </div>
            <h3 className="modal-title">ยืนยันการลบ</h3>
            <p className="modal-text">ต้องการลบผู้ใช้ <strong>{deleteTarget.name}</strong> ({deleteTarget.username}) ออกจากระบบหรือไม่? การดำเนินการนี้ไม่สามารถยกเลิกได้</p>
            <div className="flex gap-8" style={{ justifyContent: 'center' }}>
              <button className="btn" onClick={() => setDeleteTarget(null)}>ยกเลิก</button>
              <button className="btn btn-danger" onClick={confirmDelete}>ลบผู้ใช้</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
