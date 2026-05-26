export function LineChart({ data, height = 220, lines = [] }) {
  const w = 720, h = height, pad = { t: 16, r: 16, b: 28, l: 44 }
  const innerW = w - pad.l - pad.r
  const innerH = h - pad.t - pad.b
  const all = data.flatMap(d => lines.map(l => d[l.key]))
  const max = Math.ceil(Math.max(...all) / 500) * 500
  const min = 0
  const xStep = innerW / (data.length - 1)
  const px = (i) => pad.l + i * xStep
  const py = (v) => pad.t + innerH - ((v - min) / (max - min)) * innerH
  const grid = 4
  const gridLines = Array.from({ length: grid + 1 }, (_, i) => {
    const v = min + ((max - min) / grid) * i
    return { y: py(v), label: v >= 1000 ? (v / 1000).toFixed(1) + 'M' : v }
  })
  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" width="100%" style={{ display: 'block' }}>
        {gridLines.map((g, i) => (
          <g key={i}>
            <line x1={pad.l} x2={w - pad.r} y1={g.y} y2={g.y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray={i === 0 ? '' : '3 3'} />
            <text x={pad.l - 10} y={g.y + 4} fontSize="11" fill="#94a3b8" textAnchor="end" fontFamily="var(--font-mono)">฿{g.label}K</text>
          </g>
        ))}
        {data.map((d, i) => (
          <text key={i} x={px(i)} y={h - 8} fontSize="11" fill="#94a3b8" textAnchor="middle">{d.x}</text>
        ))}
        {lines.map(l => {
          const pts = data.map((d, i) => `${px(i)},${py(d[l.key])}`).join(' ')
          const area = `M ${px(0)},${py(0)} L ` + data.map((d, i) => `${px(i)},${py(d[l.key])}`).join(' L ') + ` L ${px(data.length - 1)},${py(0)} Z`
          return (
            <g key={l.key}>
              <path d={area} fill={l.color} opacity="0.08" />
              <polyline points={pts} fill="none" stroke={l.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
              {data.map((d, i) => <circle key={i} cx={px(i)} cy={py(d[l.key])} r="3" fill="#fff" stroke={l.color} strokeWidth="1.6" />)}
            </g>
          )
        })}
      </svg>
      <div className="chart-legend">
        {lines.map(l => (
          <span className="sw" key={l.key}>
            <span className="swatch" style={{ background: l.color }}></span> {l.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export function BarChart({ data, height = 240, valueKey = 'value', labelKey = 'label', color = 'var(--navy-700)', suffix = '' }) {
  const w = 720, h = height, pad = { t: 16, r: 12, b: 70, l: 44 }
  const innerW = w - pad.l - pad.r
  const innerH = h - pad.t - pad.b
  const max = Math.ceil(Math.max(...data.map(d => d[valueKey])) / 200) * 200
  const bandW = innerW / data.length
  const barW = Math.min(40, bandW * 0.55)
  const grid = 4
  const gridLines = Array.from({ length: grid + 1 }, (_, i) => {
    const v = (max / grid) * i
    return { y: pad.t + innerH - (v / max) * innerH, label: v }
  })
  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" width="100%" style={{ display: 'block' }}>
        {gridLines.map((g, i) => (
          <g key={i}>
            <line x1={pad.l} x2={w - pad.r} y1={g.y} y2={g.y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray={i === 0 ? '' : '3 3'} />
            <text x={pad.l - 8} y={g.y + 4} fontSize="11" fill="#94a3b8" textAnchor="end" fontFamily="var(--font-mono)">{g.label.toLocaleString()}</text>
          </g>
        ))}
        {data.map((d, i) => {
          const v = d[valueKey]
          const y = pad.t + innerH - (v / max) * innerH
          const x = pad.l + i * bandW + (bandW - barW) / 2
          const barH = innerH - (y - pad.t)
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={barH} fill={color} rx="3" />
              <text x={x + barW / 2} y={y - 6} fontSize="10.5" fontFamily="var(--font-mono)" fill="#475569" textAnchor="middle" fontWeight="600">
                {v.toLocaleString()}{suffix}
              </text>
              <g transform={`translate(${x + barW / 2}, ${pad.t + innerH + 10}) rotate(-22)`}>
                <text fontSize="10.5" fill="#64748b" textAnchor="end">{d[labelKey]}</text>
              </g>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export function DonutChart({ data, size = 180, thickness = 28 }) {
  const total = data.reduce((a, b) => a + b.value, 0)
  const r = (size - thickness) / 2
  const cx = size / 2, cy = size / 2
  let angle = -Math.PI / 2
  const arcs = data.map((d) => {
    const a = (d.value / total) * Math.PI * 2
    const x0 = cx + r * Math.cos(angle)
    const y0 = cy + r * Math.sin(angle)
    angle += a
    const x1 = cx + r * Math.cos(angle)
    const y1 = cy + r * Math.sin(angle)
    const large = a > Math.PI ? 1 : 0
    return { path: `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`, color: d.color, label: d.label, value: d.value, pct: (d.value / total) * 100 }
  })
  return (
    <div className="flex gap-16 items-center">
      <svg width={size} height={size}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={thickness} />
        {arcs.map((a, i) => <path key={i} d={a.path} fill="none" stroke={a.color} strokeWidth={thickness} strokeLinecap="butt" />)}
        <text x={cx} y={cy - 4} fontSize="11" fill="#94a3b8" textAnchor="middle">รวม</text>
        <text x={cx} y={cy + 14} fontSize="18" fontFamily="var(--font-mono)" fontWeight="700" fill="#0f172a" textAnchor="middle">{total.toLocaleString()}</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {arcs.map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: a.color }}></span>
            <span style={{ color: 'var(--text)', minWidth: 120 }}>{a.label}</span>
            <span className="mono" style={{ color: 'var(--text-strong)', fontWeight: 700 }}>{a.pct.toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
