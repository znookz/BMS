import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { ToastStack } from './ui'

export default function Layout() {
  const [toasts, setToasts] = useState([])

  const pushToast = (t) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(ts => [...ts, { ...t, id }])
    setTimeout(() => setToasts(ts => ts.filter(x => x.id !== id)), 2800)
  }

  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Topbar onToast={pushToast} />
        <div className="content">
          <Outlet context={{ onToast: pushToast }} />
        </div>
      </div>
      <ToastStack items={toasts} />
    </div>
  )
}
