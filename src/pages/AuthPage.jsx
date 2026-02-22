import AuthForm from '../components/AuthForm'

export default function AuthPage({ auth }) {
  return <AuthForm onContinueAsGuest={auth.continueAsGuest} />
}
