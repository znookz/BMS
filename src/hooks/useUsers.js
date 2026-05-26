import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.rpc('admin_list_users')
    if (error) { setError(error.message); setLoading(false); return }
    setUsers(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const add = async (form) => {
    const { error } = await supabase.rpc('admin_create_user', {
      p_email: form.email, p_password: form.password,
      p_name: form.name, p_role: form.role, p_username: form.username,
    })
    if (error) throw error
    await load()
  }

  const update = async (id, form) => {
    const { error } = await supabase.rpc('admin_update_user', {
      p_user_id: id, p_name: form.name, p_role: form.role,
      p_username: form.username, p_status: form.status,
      p_password: form.password || null,
    })
    if (error) throw error
    await load()
  }

  const remove = async (id) => {
    const { error } = await supabase.rpc('admin_delete_user', { p_user_id: id })
    if (error) throw error
    await load()
  }

  return { users, loading, error, refetch: load, add, update, remove }
}
