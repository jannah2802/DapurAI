export default function LoadingSpinner({ label = 'Sedang memproses...' }) {
  return (
    <div className="y2k-shell mx-auto flex w-full max-w-xl items-center justify-center gap-3 p-6">
      <span className="h-5 w-5 animate-spin rounded-full border-4 border-magenta border-t-transparent" />
      <p className="font-ios text-sm text-black">{label}</p>
    </div>
  )
}
