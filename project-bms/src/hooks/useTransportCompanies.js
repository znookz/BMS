import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

function buildPayload(form) {
  return {
    code:           form.code.trim().toUpperCase(),
    name_th:        form.name_th.trim(),
    name_en:        form.name_en?.trim() || null,
    contact:        form.contact?.trim() || null,
    phone:          form.phone?.trim() || null,
    email:          form.email?.trim() || null,
    address:        form.address?.trim() || null,
    tax_id:         form.tax_id?.trim() || null,
    contract_start: form.contract_start || null,
    contract_end:   form.contract_end || null,
    rate_per_month: form.rate_per_month ? Number(form.rate_per_month) : 0,
    status:         form.status,
    note:           form.note?.trim() || null,
  }
}

export function useTransportCompanies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('transport_companies')
      .select('*')
      .order('code')
    if (err) { setError(err.message); setLoading(false); return }
    setCompanies(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const add = async (form) => {
    const { error: err } = await supabase.from('transport_companies').insert(buildPayload(form))
    if (err) throw err
    await load()
  }

  const update = async (id, form) => {
    const { error: err } = await supabase.from('transport_companies').update(buildPayload(form)).eq('id', id)
    if (err) throw err
    await load()
  }

  const remove = async (id) => {
    const { error: err } = await supabase.from('transport_companies').delete().eq('id', id)
    if (err) throw err
    await load()
  }

  return { companies, loading, error, refetch: load, add, update, remove }
}
