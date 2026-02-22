import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn('Missing Supabase env vars: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY')
}

function buildOfflineSupabaseClient() {
  const missingEnvError = {
    message:
      'Supabase env vars are missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel.',
  }

  return {
    auth: {
      async getSession() {
        return { data: { session: null }, error: null }
      },
      onAuthStateChange() {
        return {
          data: {
            subscription: {
              unsubscribe() {},
            },
          },
        }
      },
      async signInWithPassword() {
        return { data: null, error: missingEnvError }
      },
      async signUp() {
        return { data: null, error: missingEnvError }
      },
      async signOut() {
        return { error: null }
      },
    },
    from() {
      return {
        select() {
          return {
            eq() {
              return {
                async single() {
                  return { data: null, error: missingEnvError }
                },
              }
            },
          }
        },
      }
    },
  }
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : buildOfflineSupabaseClient()
