import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  { to: '/', label: 'ภาพรวม', icon: '🏠', end: true },
  { to: '/driver', label: 'พนักงานขับรถ', icon: '👤' },
  { to: '/bus', label: 'รถบัส', icon: '🚌' },
  { to: '/maintenance', label: 'ซ่อมบำรุง', icon: '🔧' },
  { to: '/cost', label: 'ควบคุมค่าใช้จ่าย', icon: '💰' },
  { to: '/fuel', label: 'น้ำมัน (ATG)', icon: '⛽' },
  { to: '/training', label: 'การฝึกอบรม', icon: '📋' },
  { to: '/license', label: 'ใบอนุญาต & ประกัน', icon: '📄' },
  { to: '/complaint', label: 'ข้อร้องเรียน', icon: '💬' },
  { to: '/safety', label: 'ความปลอดภัย', icon: '🛡️' },
  { to: '/purchase', label: 'จัดซื้อ', icon: '🛒' },
]

const adminItems = [
  { to: '/users', label: 'จัดการผู้ใช้', icon: '👥' },
]

export default function Sidebar() {
  const { role, signOut } = useAuth()

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-accent text-white'
        : 'text-slate-300 hover:bg-primary-light hover:text-white'
    }`

  return (
    <aside className="w-64 min-h-screen bg-primary flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-primary-light">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚌</span>
          <div>
            <p className="text-white font-bold text-lg leading-none">BMS</p>
            <p className="text-slate-400 text-xs">ระบบจัดการรถบัส</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}

        {role === 'admin' && (
          <>
            <div className="pt-3 pb-1">
              <p className="px-4 text-xs text-slate-500 uppercase tracking-wider">Admin</p>
            </div>
            {adminItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-primary-light">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-primary-light hover:text-white transition-colors"
        >
          <span>🚪</span>
          <span>ออกจากระบบ</span>
        </button>
      </div>
    </aside>
  )
}
