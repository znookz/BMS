import { useRef, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Icon from './Icon'
import { NOTIFS } from '../lib/mockData'

const PAGE_INFO = {
  '/':            { title: 'ภาพรวม',                 crumb: 'Operations / Dashboard' },
  '/driver':      { title: 'พนักงานขับรถ',            crumb: 'Operations / Driver' },
  '/bus':         { title: 'รถบัส',                  crumb: 'Operations / Bus Fleet' },
  '/maintenance': { title: 'การบำรุงรักษา',           crumb: 'Operations / Maintenance' },
  '/cost':        { title: 'การควบคุมค่าใช้จ่าย',      crumb: 'Operations / Cost Control' },
  '/fuel':        { title: 'การเติมน้ำมัน (ATG)',      crumb: 'Operations / Fuel' },
  '/training':    { title: 'การอบรม',                crumb: 'Operations / Training' },
  '/license':     { title: 'ใบขับขี่ & ประกันภัย',      crumb: 'Operations / License & Insurance' },
  '/complaint':   { title: 'เรื่องร้องเรียน',            crumb: 'Operations / Customer Complaint' },
  '/safety':      { title: 'มาตรการความปลอดภัย',      crumb: 'Operations / Safety Measurement' },
  '/purchase':    { title: 'การจัดซื้อ',              crumb: 'Operations / Purchase' },
  '/users':       { title: 'การจัดการผู้ใช้งาน',         crumb: 'Admin / User Management' },
}

const iconFor = (k) => k === 'maintenance' ? 'wrench' : k === 'license' ? 'id' : k === 'training' ? 'cap' : 'alert'
const toneFor = (k) => k === 'maintenance' ? { bg: '#fef3c7', fg: '#b45309' } : k === 'license' ? { bg: '#dbeafe', fg: '#1d4ed8' } : k === 'training' ? { bg: '#e0e7ff', fg: '#4338ca' } : { bg: '#fee2e2', fg: '#b91c1c' }

export default function Topbar({ onToast }) {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const info = PAGE_INFO[location.pathname] || { title: 'หน้านี้', crumb: 'BMS' }
  const unread = NOTIFS.filter(n => n.unread).length

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div className="topbar">
      <div className="topbar-title">
        <div className="crumb">{info.crumb}</div>
        <h1>{info.title}</h1>
      </div>

      <div className="topbar-search">
        <span className="ico"><Icon name="search" size={15} /></span>
        <input placeholder="ค้นหา รถ, คนขับ, เส้นทาง…" />
      </div>

      <div className="topbar-actions" ref={ref} style={{ position: 'relative' }}>
        <button className="icon-btn" title="Refresh" onClick={() => onToast?.({ msg: 'รีเฟรชข้อมูลแล้ว', kind: 'success' })}>
          <Icon name="refresh" size={17} />
        </button>
        <button className="icon-btn" title="Notifications" onClick={() => setOpen(o => !o)}>
          <Icon name="bell" size={20} />
          {unread > 0 && <span className="dot">{unread}</span>}
        </button>

        {open && (
          <div className="notif-dropdown">
            <div className="notif-head">
              <h4>การแจ้งเตือน</h4>
              <button className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>ทำเป็นอ่านแล้ว</button>
            </div>
            <div className="notif-list">
              {NOTIFS.map(n => {
                const tone = toneFor(n.kind)
                return (
                  <div className="notif-item" key={n.id}>
                    <div className="ico" style={{ background: tone.bg, color: tone.fg }}>
                      <Icon name={iconFor(n.kind)} size={16} />
                    </div>
                    <div className="body">
                      <div className="msg">{n.msg}</div>
                      <div className="when">{n.when}</div>
                    </div>
                    {n.unread && <div style={{ width: 8, height: 8, borderRadius: 8, background: 'var(--amber-500)', alignSelf: 'center' }} />}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
