import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const pad = (n) => String(n).padStart(2, '0')
const lastDay = (y, m) => new Date(y, m, 0).getDate()

export function useCosts(year, month) {
  const [records, setRecords] = useState([])
  const [trend, setTrend] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    const curStart = `${year}-${pad(month)}-01`
    const curEnd   = `${year}-${pad(month)}-${lastDay(year, month)}`
    const trendFrom = new Date(year, month - 6, 1).toISOString().slice(0, 10)

    const [mRes, fRes] = await Promise.all([
      supabase.from('maintenance_logs')
        .select('id, date, kind, cost, description, bus:buses(code, type)')
        .gte('date', trendFrom).lte('date', curEnd)
        .order('date', { ascending: false }),
      supabase.from('fuel_records')
        .select('id, date, total_cost, company, bus:buses(code, type)')
        .gte('date', trendFrom).lte('date', curEnd)
        .order('date', { ascending: false }),
    ])

    if (mRes.error || fRes.error) {
      setError((mRes.error || fRes.error).message)
      setLoading(false)
      return
    }

    const allM = mRes.data || []
    const allF = fRes.data || []

    // Current month records for table
    const curM = allM.filter(r => r.date >= curStart && r.date <= curEnd)
    const curF = allF.filter(r => r.date >= curStart && r.date <= curEnd)

    setRecords([
      ...curM.map(r => ({
        id: r.id, date: r.date, category: r.kind,
        cost: r.cost || 0, description: r.description,
        busCode: r.bus?.code || '-', busType: r.bus?.type || 'air',
      })),
      ...curF.map(r => ({
        id: r.id, date: r.date, category: 'fuel',
        cost: r.total_cost || 0, description: r.company,
        busCode: r.bus?.code || '-', busType: r.bus?.type || 'air',
      })),
    ].sort((a, b) => b.date.localeCompare(a.date)))

    // 6-month trend
    const months = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(year, month - 1 - i, 1)
      months.push({ year: d.getFullYear(), month: d.getMonth() + 1, label: d.toLocaleDateString('th-TH', { month: 'short' }) })
    }

    setTrend(months.map(({ year: y, month: m, label }) => {
      const prefix = `${y}-${pad(m)}`
      const mRows = allM.filter(r => r.date.startsWith(prefix))
      const fRows = allF.filter(r => r.date.startsWith(prefix))
      const sumType = (rows, key, type) => rows.filter(r => r.bus?.type === type).reduce((a, r) => a + (r[key] || 0), 0)
      return {
        x: label,
        air: sumType(mRows, 'cost', 'air') + sumType(fRows, 'total_cost', 'air'),
        fan: sumType(mRows, 'cost', 'fan') + sumType(fRows, 'total_cost', 'fan'),
      }
    }))

    setLoading(false)
  }, [year, month])

  useEffect(() => { load() }, [load])
  return { records, trend, loading, error }
}
