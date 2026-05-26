import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import Icon from '../components/Icon'
import { MOCK_USERS, initials } from '../lib/mockData'

export default function Users() {
  const { onToast } = useOutletContext() || {}
  const [users, setUsers] = useState(MOCK_USERS)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', role: 'operation', password: '', confirm: '' })
  const [errors, setErrors] = useState({})

  const openAdd = () => { setEditTarget(null); setForm({ name: '', email: '', role: 'operation', password: '', confirm: '' }); setErrors({}); setModalOpen(true) }
  const openEdit = (u) => { setEditTarget(u); setForm({ name: u.name, email: u.email, role: u.role, password: '', confirm: '' }); setErrors({}); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditTarget(null); setErrors({}) }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'กรอกชื่อ'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'อีเมลไม่ถูกต้อง'
    if (!editTarget && !form.password) e.password = 'กรอกรหัสผ่าน'
    if (form.password && form.password.length < 6) e.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
    if (form.password && form.password !== form.confirm) e.confirm = 'รหัสผ่านไม่ตรงกัน'
    if (!editTarget && users.find(u => u.email.toLowerCase() === form.email.toLowerCase())) e.email = 'อีเมลนี้มีอยู่แล้ว'
    return e
  }

  const save = () => {
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return
    if (editTarget) {
      setUsers(us => us.map(u => u.id === editTarget.id ? { ...u, name: form.name, email: form.email, role: form.role } : u))
      onToast?.({ msg: 'บันทึกข้อมูล ' + form.name + ' สำเร็จ', kind: 'success' })
    } else {
      setUsers(us => [...us, { id: Date.now(), name: form.name, email: form.email, role: form.role, lastLogin: 'ยังไม่เคยเข้าสู่ระบบ', status: 'active' }])
      onToast?.({ msg: 'เพิ่มผู้ใช้ ' + form.name + ' สำเร็จ', kind: 'success' })
    }
    closeModal()
  }

  const confirmDelete = () => {
    setUsers(us => us.filter(u => u.id !== deleteTarget.id))
    onToast?.({ msg: 'ลบ ' + deleteTarget.name + ' สำเร็จ', kind: 'success' })
    setDeleteTarget(null)
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
                <th>บทบาท</th>
                <th>เข้าสู่ระบบล่าสุด</th>
                <th>สถานะ</th>
                <th style={{ textAlign: 'right' }}>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
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
                  <td>
                    <span className={'role-badge ' + (u.role === 'admin' ? 'role-admin' : 'role-op')}>
                      {u.role === 'admin' ? 'Admin' : 'Operation'}
                    </span>
                  </td>
                  <td className="text-muted">{u.lastLogin}</td>
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
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={errors.name ? 'input-error' : ''} placeholder="เช่น สมชาย ใจดี" />
                {errors.name && <div className="field-err">{errors.name}</div>}
              </div>
              <div className="field">
                <label>อีเมล *</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={errors.email ? 'input-error' : ''} placeholder="name@bms.co.th" />
                {errors.email && <div className="field-err">{errors.email}</div>}
              </div>
              <div className="field">
                <label>บทบาท *</label>
                <div className="role-picker">
                  {[
                    { id: 'admin',     label: 'Admin',     desc: 'เข้าถึงได้ทุกโมดูล รวม User Management' },
                    { id: 'operation', label: 'Operation', desc: 'เข้าถึงโมดูลปฏิบัติการ ไม่เห็น User Management' },
                  ].map(r => (
                    <button key={r.id} type="button" className={'role-opt ' + (form.role === r.id ? 'on' : '')} onClick={() => setForm({ ...form, role: r.id })}>
                      <div className="role-opt-head">
                        <span className={'role-badge ' + (r.id === 'admin' ? 'role-admin' : 'role-op')}>{r.label}</span>
                        {form.role === r.id && <Icon name="check" size={14} style={{ color: 'var(--navy-700)' }} />}
                      </div>
                      <div className="role-opt-desc">{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="field">
                <label>{editTarget ? 'รหัสผ่านใหม่ (เว้นว่างถ้าไม่ต้องการเปลี่ยน)' : 'รหัสผ่าน *'}</label>
                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className={errors.password ? 'input-error' : ''} placeholder="••••••••" />
                {errors.password && <div className="field-err">{errors.password}</div>}
              </div>
              {(form.password || !editTarget) && (
                <div className="field">
                  <label>ยืนยันรหัสผ่าน *</label>
                  <input type="password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} className={errors.confirm ? 'input-error' : ''} placeholder="••••••••" />
                  {errors.confirm && <div className="field-err">{errors.confirm}</div>}
                </div>
              )}
            </div>

            <div className="modal-form-foot">
              <button className="btn" onClick={closeModal}>ยกเลิก</button>
              <button className="btn btn-primary" onClick={save}><Icon name="check" size={15} /> {editTarget ? 'บันทึก' : 'เพิ่มผู้ใช้'}</button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="modal-scrim" onClick={() => setDeleteTarget(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div className="modal-ico" style={{ background: 'var(--danger-50)', color: 'var(--danger)' }}>
              <Icon name="trash" size={26} />
            </div>
            <h3 className="modal-title">ยืนยันการลบ</h3>
            <p className="modal-text">คุณต้องการลบผู้ใช้ <strong>{deleteTarget.name}</strong> ออกจากระบบหรือไม่? การดำเนินการนี้ไม่สามารถยกเลิกได้</p>
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
