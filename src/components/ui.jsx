import Icon from './Icon'
import { initials } from '../lib/mockData'

export function KPI({ tone = 'navy', icon, label, value, trend, foot }) {
  return (
    <div className={'kpi tone-' + tone}>
      <div className="kpi-ico"><Icon name={icon} size={20} /></div>
      <div className="kpi-body">
        <div className="kpi-label">{label}</div>
        <div className="kpi-value tnum">{value}</div>
        <div className="kpi-foot">
          {trend && (
            <span className={trend.dir === 'up' ? 'trend-up' : trend.dir === 'down' ? 'trend-down' : 'trend-neutral'}>
              <Icon name={trend.dir === 'up' ? 'arrowUp' : trend.dir === 'down' ? 'arrowDown' : 'dot'} size={12} />{' '}
              {trend.label}
            </span>
          )}
          {foot && <span>{foot}</span>}
        </div>
      </div>
    </div>
  )
}

export function StatusBadge({ status }) {
  const map = {
    active:      { cls: 'badge-success', label: 'Active',         dot: true },
    inactive:    { cls: 'badge-neutral', label: 'Inactive',       dot: true },
    maintenance: { cls: 'badge-warning', label: 'In Maintenance', dot: true },
    retired:     { cls: 'badge-neutral', label: 'Retired',        dot: true },
    pending:     { cls: 'badge-info',    label: 'Pending',        dot: true },
    expired:     { cls: 'badge-danger',  label: 'Expired',        dot: true },
  }
  const s = map[status] || { cls: 'badge-neutral', label: status, dot: true }
  return (
    <span className={'badge ' + s.cls}>
      {s.dot && <span className="dot"></span>}
      {s.label}
    </span>
  )
}

export function Progress({ pct }) {
  const cls = pct >= 100 ? 'danger' : pct >= 80 ? 'warn' : ''
  return (
    <div className={'progress ' + cls}>
      <div className="bar" style={{ width: Math.min(100, pct) + '%' }}></div>
    </div>
  )
}

export function Avatar({ name, size = 28 }) {
  return (
    <div className="avatar-sm" style={{ width: size, height: size, fontSize: size * 0.4 }}>
      {initials(name)}
    </div>
  )
}

export function Drawer({ open, title, onClose, children, footer }) {
  return (
    <>
      <div className={'drawer-scrim ' + (open ? 'open' : '')} onClick={onClose} />
      <div className={'drawer ' + (open ? 'open' : '')}>
        <div className="drawer-head">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose}><Icon name="close" size={18} /></button>
        </div>
        <div className="drawer-body">{children}</div>
        {footer && <div className="drawer-foot">{footer}</div>}
      </div>
    </>
  )
}

export function ToastStack({ items }) {
  return (
    <div className="toast-stack">
      {items.map(t => (
        <div className={'toast ' + (t.kind || 'success')} key={t.id}>
          <Icon
            name={t.kind === 'danger' ? 'alert' : t.kind === 'warning' ? 'alert' : 'check'}
            size={16}
            style={{ color: t.kind === 'danger' ? 'var(--danger)' : t.kind === 'warning' ? 'var(--warning)' : 'var(--success)' }}
          />
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  )
}

export function Pagination({ page, pageSize, total, onChange }) {
  const pages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)
  const list = []
  const push = (p) => list.push(p)
  if (pages <= 7) for (let i = 1; i <= pages; i++) push(i)
  else {
    push(1)
    if (page > 3) push('…')
    for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) push(i)
    if (page < pages - 2) push('…')
    push(pages)
  }
  return (
    <div className="pagination">
      <div>แสดง {start}–{end} จาก {total} รายการ</div>
      <div className="pager">
        <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1}>
          <Icon name="chevleft" size={14} />
        </button>
        {list.map((p, i) => p === '…'
          ? <button key={i} disabled>…</button>
          : <button key={i} className={p === page ? 'on' : ''} onClick={() => onChange(p)}>{p}</button>
        )}
        <button onClick={() => onChange(Math.min(pages, page + 1))} disabled={page === pages}>
          <Icon name="chevright" size={14} />
        </button>
      </div>
    </div>
  )
}
