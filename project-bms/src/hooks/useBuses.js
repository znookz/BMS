import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

function buildPayload(form) {
  return {
    plate:            form.plate,
    type:             form.type,
    brand:            form.brand || null,
    model:            form.model || null,
    year:             form.year ? Number(form.year) : null,
    seats:            form.seats ? Number(form.seats) : null,
    factory:          form.factory,
    status:           form.status,
    company_id:       form.company_id || null,
    driver_id:        form.driver_id || null,
    current_km:       Number(form.current_km) || 0,
    next_service_km:  form.next_service_km ? Number(form.next_service_km) : null,
    last_service_date: form.last_service_date || null,
    insurance_exp:    form.insurance_exp || null,
    tax_exp:          form.tax_exp || null,
  }
}

export function useBuses() {
  const [buses, setBuses]     = useState([])
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const [bRes, dRes] = await Promise.all([
      supabase.from('buses').select('*, driver:drivers(id, name), company:transport_companies(id, code, name_th)').order('code'),
      supabase.from('drivers').select('id, name, code').eq('status', 'active').order('code'),
    ])
    if (bRes.error) { setError(bRes.error.message); setLoading(false); return }
    setBuses(bRes.data || [])
    setDrivers(dRes.data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const add = async (form) => {
    const prefix = form.type === 'air' ? 'B' : 'F'
    const { data: rows } = await supabase.from('buses').select('code').ilike('code', prefix + '%').order('code', { ascending: false }).limit(1)
    const lastNum = rows?.[0]?.code ? parseInt(rows[0].code.replace(prefix, '')) : 0
    const code = prefix + String(lastNum + 1).padStart(3, '0')
    const { error } = await supabase.from('buses').insert({ code, ...buildPayload(form) })
    if (error) throw error
    await load()
  }

  const update = async (id, form) => {
    const { error } = await supabase.from('buses').update(buildPayload(form)).eq('id', id)
    if (error) throw error
    await load()
  }

  const remove = async (id) => {
    const { error } = await supabase.from('buses').delete().eq('id', id)
    if (error) throw error
    await load()
  }

  return { buses, drivers, loading, error, refetch: load, add, update, remove }
}

export async function fetchBusLogs(busId) {
  const { data, error } = await supabase
    .from('maintenance_logs')
    .select('id, date, kind, cost, km_at_service, description')
    .eq('bus_id', busId)
    .order('date', { ascending: false })
    .limit(30)
  if (error) throw error
  return data || []
}
