import { useState } from 'react'
import { z } from 'zod'
import { LogIn, UserPlus, WifiOff } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { authBaseSchema, signupSchema } from '../utils/authSchemas'

const loginSchema = authBaseSchema

export default function AuthForm({ onContinueAsGuest }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    const payload = { email, password, confirmPassword }
    const schema = mode === 'login' ? loginSchema : signupSchema

    try {
      schema.parse(payload)
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        setError(validationError.issues[0]?.message ?? 'Input tidak sah.')
        return
      }
      setError('Input tidak sah.')
      return
    }

    setLoading(true)

    try {
      if (mode === 'login') {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) throw signInError
      } else {
        const { error: signupError } = await supabase.auth.signUp({ email, password })
        if (signupError) throw signupError
        setSuccess('Akaun berjaya dibuat. Sila semak emel jika verifikasi diaktifkan.')
      }
    } catch (requestError) {
      setError(requestError.message || 'Gagal proses auth.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-8">
      <section className="y2k-shell w-full p-5">
        <h1 className="font-impact text-4xl uppercase leading-none text-magenta">Dapur AI</h1>
        <p className="mt-2 font-ios text-sm text-black/80">Masuk bahan anda. Dapat idea masak malam ini, cepat.</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <input
            className="focus-ring w-full rounded-2xl border-2 border-black/20 bg-white p-3 font-ios text-sm"
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            className="focus-ring w-full rounded-2xl border-2 border-black/20 bg-white p-3 font-ios text-sm"
            type="password"
            placeholder="Password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {mode === 'signup' ? (
            <input
              className="focus-ring w-full rounded-2xl border-2 border-black/20 bg-white p-3 font-ios text-sm"
              type="password"
              placeholder="Confirm password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          ) : null}

          {error ? <p className="rounded-xl bg-iosRed/15 p-2 font-ios text-xs text-iosRed">{error}</p> : null}
          {success ? <p className="rounded-xl bg-iosGreen/15 p-2 font-ios text-xs text-iosGreen">{success}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-magenta bg-magenta px-4 py-3 font-ios text-sm font-semibold text-white disabled:opacity-70"
          >
            {mode === 'login' ? <LogIn size={16} /> : <UserPlus size={16} />}
            {loading ? 'Memproses...' : mode === 'login' ? 'Log Masuk' : 'Cipta Akaun'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode((current) => (current === 'login' ? 'signup' : 'login'))}
          className="mt-3 w-full rounded-2xl border-2 border-iosBlue bg-white px-4 py-2 font-ios text-sm font-semibold text-iosBlue"
        >
          {mode === 'login' ? 'Belum ada akaun? Sign up' : 'Sudah ada akaun? Log masuk'}
        </button>

        <button
          type="button"
          onClick={onContinueAsGuest}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-iosOrange bg-iosOrange px-4 py-2 font-ios text-sm font-semibold text-white"
        >
          <WifiOff size={15} />
          Teruskan Offline (Guest)
        </button>
      </section>
    </main>
  )
}
