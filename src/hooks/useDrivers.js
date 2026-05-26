import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useDrivers() {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const [driversRes, trainingRes, healthRes] = await Promise.all([
      supabase.from('drivers').select('*').order('code'),
      supabase.from('driver_training_records').select('driver_id'),
      supabase.from('driver_health_checks').select('driver_id, check_date').order('check_date', { ascending: false }),
    ])
    if (driversRes.error) { setError(driversRes.error.message); setLoading(false); return }
    const tCount = {}
    trainingRes.data?.forEach(r => { tCount[r.driver_id] = (tCount[r.driver_id] || 0) + 1 })
    const lastH = {}
    healthRes.data?.forEach(r => { if (!lastH[r.driver_id]) lastH[r.driver_id] = r.check_date })
    setDrivers((driversRes.data || []).map(d => ({
      ...d,
      trainings: tCount[d.id] || 0,
      lastHealth: lastH[d.id] || null,
    })))
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const add = async (form) => {
    const { data: last } = await supabase.from('drivers').select('code').order('code', { ascending: false }).limit(1)
    const nextNum = last?.[0] ? parseInt(last[0].code.replace(/\D/g, '')) + 1 : 1
    const code = 'D' + String(nextNum).padStart(3, '0')
    const { error } = await supabase.from('drivers').insert({
      code, name: form.name, id_card: form.idCard, phone: form.phone,
      factory: form.factory, route: form.route, shift: Number(form.shift),
      license_type: form.licenseType, license_exp: form.licenseExp || null,
      joined: form.joined || null, status: 'active',
    })
    if (error) throw error
    await load()
  }

  const update = async (id, form) => {
    const { error } = await supabase.from('drivers').update({
      name: form.name, id_card: form.idCard, phone: form.phone,
      factory: form.factory, route: form.route, shift: Number(form.shift),
      license_type: form.licenseType, license_exp: form.licenseExp || null,
      joined: form.joined || null, status: form.status,
    }).eq('id', id)
    if (error) throw error
    await load()
  }

  const remove = async (id) => {
    const { error } = await supabase.from('drivers').delete().eq('id', id)
    if (error) throw error
    await load()
  }

  return { drivers, loading, error, refetch: load, add, update, remove }
}

export async function fetchDriverDetail(driverId) {
  const [healthRes, trainingRes] = await Promise.all([
    supabase.from('driver_health_checks').select('*').eq('driver_id', driverId).order('check_date', { ascending: false }),
    supabase.from('driver_training_records')
      .select('*, course:training_courses(name, validity_months)')
      .eq('driver_id', driverId).order('trained_date', { ascending: false }),
  ])
  return {
    healthChecks: healthRes.data || [],
    trainingRecords: trainingRes.data || [],
  }
}
