import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const today = () => new Date().toISOString().slice(0, 10)

export function useMaintenance() {
  const [buses, setBuses]           = useState([])
  const [closedCount, setClosedCount] = useState(0)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    const now = new Date()
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`

    const [bRes, lRes] = await Promise.all([
      supabase.from('buses')
        .select('id, code, plate, type, factory, brand, model, status, current_km, next_service_km, last_service_date, driver:drivers(name)')
        .order('code'),
      supabase.from('maintenance_logs')
        .select('id', { count: 'exact', head: true })
        .gte('date', monthStart),
    ])

    if (bRes.error) { setError(bRes.error.message); setLoading(false); return }
    setBuses(bRes.data || [])
    setClosedCount(lRes.count || 0)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const addLog = async (form) => {
    const { error: logErr } = await supabase.from('maintenance_logs').insert({
      bus_id:       form.busId,
      date:         form.date,
      kind:         form.kind,
      cost:         Number(form.cost) || 0,
      km_at_service: Number(form.km) || 0,
      description:  form.desc,
    })
    if (logErr) throw logErr

    const { error: busErr } = await supabase.from('buses').update({
      current_km:       Number(form.km),
      last_service_date: form.date,
    }).eq('id', form.busId)
    if (busErr) throw busErr

    await load()
  }

  return { buses, closedCount, loading, error, today, refetch: load, addLog }
}
