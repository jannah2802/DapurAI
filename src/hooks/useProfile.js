import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('dapur_ai_profiles')
    .select('id, username, display_name, created_at')
    .eq('id', userId)
    .single()

  if (error) {
    throw error
  }

  return data
}

export function useProfile(userId) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => fetchProfile(userId),
    enabled: Boolean(userId),
    retry: 1,
  })
}
