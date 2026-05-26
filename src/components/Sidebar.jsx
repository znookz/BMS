import { NavLink } from 'react-router-dom'
import Icon from './Icon'
import { useAuth } from '../contexts/AuthContext'
import { initials } from '../lib/mockData'

const NAV = [
  { to: '/',           label: 'Dashboard',          icon: 'home',    end: true },
  { to: '/driver',     label: 'Driver',             icon: 'user' },
  { to: '/bus',        label: 'Bus Fleet',          icon: 'bus' },
  { to: '/maintenance',label: 'Maintenance',        icon: 'wrench' },
  { to: '/cost',       label: 'Cost Control',       icon: 'coin' },
  { to: '/fuel',       label: 'Fuel (ATG)',         icon: 'fuel' },
  { to: '/training',   label: 'Training',           icon: 'cap' },
  { to: '/license',    label: 'License & Insurance',icon: 'id' },
  { to: '/complaint',  label: 'Customer Complaint', icon: 'chat' },
  { to: '/safety',     label: 'Safety Measurement', icon: 'shield' },
  { to: '/purchase',   label: 'Purchase',           icon: 'cart' },
  { to: '/users',      label: 'User Management',    icon: 'users', adminOnly: true },
]

export default function Sidebar() {
  const { user, role, signOut } = useAuth()
  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'ผู้ใช้'

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <Icon name="bus" size={22} style={{ color: 'var(--navy-700)' }} />
        </div>
        <div>
          <div className="sidebar-name">BMS</div>
          <div className="sidebar-sub">MinebeaMitsumi</div>
        </div>
      </div>

      <div className="sidebar-section-label">Operations</div>
      <nav className="sidebar-nav">
        {NAV.filter(n => !n.adminOnly || role === 'admin').map(n => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
          >
            <span className="nav-ico"><Icon name={n.icon} size={17} /></span>
            <span>{n.label}</span>
            {n.adminOnly && <span className="pill-admin">Admin</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-user">
        <div className="avatar">{initials(displayName)}</div>
        <div className="meta">
          <div className="name">{displayName}</div>
          <div className="role">{role === 'admin' ? 'Administrator' : 'Operations'}</div>
        </div>
        <button className="icon-btn" title="ออกจากระบบ" style={{ color: '#94a3b8' }} onClick={signOut}>
          <Icon name="logout" size={16} />
        </button>
      </div>
    </aside>
  )
}
