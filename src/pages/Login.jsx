import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Icon from '../components/Icon'

export default function Login() {
  const { signIn } = useAuth()
  const [username, setUsername] = useState('')
  const [pwd, setPwd] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const [forgotOpen, setForgotOpen] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    if (!username.trim() || !pwd) { setErr('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน'); return }
    setLoading(true)
    try {
      await signIn(username.trim(), pwd)
    } catch (e) {
      setErr(e.message === 'ไม่พบชื่อผู้ใช้นี้ในระบบ' ? e.message : 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-shell">
      <form className="login-card" onSubmit={submit} noValidate>
        <div className="logo-row">
          <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--navy-700)', display: 'grid', placeItems: 'center', color: '#fff' }}>
            <Icon name="bus" size={28} />
          </div>
          <div>
            <h1>Bus Management System</h1>
            <div className="tag">ระบบจัดการรถบัส · MinebeaMitsumi</div>
          </div>
        </div>

        {err && (
          <div className="login-error" role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" /><path d="M12 8v4" /><circle cx="12" cy="16" r="0.6" fill="currentColor" />
            </svg>
            <span>{err}</span>
          </div>
        )}

        <div className="field">
          <label>ชื่อผู้ใช้</label>
          <input
            type="text"
            value={username}
            onChange={e => { setUsername(e.target.value); setErr('') }}
            placeholder="เช่น admin"
            autoFocus
            autoComplete="username"
            className={err ? 'input-error' : ''}
          />
        </div>
        <div className="field">
          <label>รหัสผ่าน</label>
          <div className="pwd-wrap">
            <input
              type={show ? 'text' : 'password'}
              value={pwd}
              onChange={e => { setPwd(e.target.value); setErr('') }}
              placeholder="••••••••"
              className={err ? 'input-error' : ''}
            />
            <button type="button" className="pwd-toggle" onClick={() => setShow(s => !s)}>
              <Icon name={show ? 'eyeOff' : 'eye'} size={16} />
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center" style={{ marginBottom: 18, fontSize: 12.5 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)' }}>
            <input type="checkbox" defaultChecked /> จดจำการเข้าสู่ระบบ
          </label>
          <a href="#" onClick={e => { e.preventDefault(); setForgotOpen(true) }} style={{ color: 'var(--navy-700)', fontWeight: 600 }}>ลืมรหัสผ่าน?</a>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '11px' }}>
          {loading ? <><span className="spinner"></span> กำลังเข้าสู่ระบบ…</> : 'เข้าสู่ระบบ'}
        </button>

        <div style={{ textAlign: 'center', marginTop: 18, fontSize: 11.5, color: 'var(--text-faint)' }}>
          v1.0.0 • © 2569 BMS · MinebeaMitsumi IT Operations
        </div>
      </form>

      {forgotOpen && (
        <div className="modal-scrim" onClick={() => setForgotOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} role="dialog">
            <button className="modal-close" onClick={() => setForgotOpen(false)}>
              <Icon name="close" size={18} />
            </button>
            <div className="modal-ico">
              <Icon name="lock" size={26} />
            </div>
            <h3 className="modal-title">ลืมรหัสผ่าน</h3>
            <p className="modal-text">กรุณาติดต่อผู้ดูแลระบบเพื่อรีเซ็ตรหัสผ่านของคุณ</p>
            <div className="modal-contact">
              <div className="modal-contact-row">
                <span className="modal-contact-label">ผู้ดูแลระบบ</span>
                <span className="modal-contact-value">ฝ่าย IT Operations · MinebeaMitsumi</span>
              </div>
              <div className="modal-contact-row">
                <span className="modal-contact-label">อีเมล</span>
                <a className="modal-contact-value link" href="mailto:it.support@minebeamitsumi.co.th">it.support@minebeamitsumi.co.th</a>
              </div>
              <div className="modal-contact-row">
                <span className="modal-contact-label">โทรภายใน</span>
                <span className="modal-contact-value mono">ต่อ 1234</span>
              </div>
              <div className="modal-contact-row">
                <span className="modal-contact-label">เวลาทำการ</span>
                <span className="modal-contact-value">จ.–ศ. 08:00–17:30</span>
              </div>
            </div>
            <button className="btn btn-primary modal-cta" onClick={() => setForgotOpen(false)}>เข้าใจแล้ว</button>
          </div>
        </div>
      )}
    </div>
  )
}
