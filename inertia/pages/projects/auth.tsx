// inertia/pages/projects/auth.tsx

import { Head, usePage } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import { motion } from 'framer-motion'
import { ArrowLeft, FolderKanban } from 'lucide-react'

// Record<string, unknown> satisfies Inertia's PageProps index signature constraint.
// We pull flash out loosely since its shape is owned by HandleInertiaRequests.
interface AuthProps extends Record<string, unknown> {
  flash?: { error?: string; success?: string }
}

export default function Auth() {
  const { flash } = usePage<AuthProps>().props
  const shouldShowError = !!flash?.error && !flash.error.toLowerCase().includes('unauthorized')

  return (
    <>
      <Head title="Projects" />

      <div className="min-h-screen bg-[#1C1C1E] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Blue glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(10,132,255,0.08) 0%, transparent 70%)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-sm"
        >
          <div
            className="bg-[#242426] border border-[#3A3A3C] rounded-2xl p-8"
            style={{
              boxShadow: '0 24px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04) inset',
            }}
          >
            <Link
              href="/"
              className="mb-5 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-[#98989D] transition-colors hover:bg-[#2C2C2E] hover:text-white"
              title="Back to home"
            >
              <ArrowLeft size={18} />
              <span>Back to home</span>
            </Link>

            {/* Brand */}
            <div className="mb-8 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#0A84FF]/10 border border-[#0A84FF]/20 flex items-center justify-center">
                <FolderKanban size={18} className="text-[#0A84FF]" />
              </div>
              <span className="text-white font-semibold tracking-tight">Projects</span>
            </div>

            <h1 className="text-[22px] font-bold text-white leading-tight mb-1">Get started</h1>
            <p className="text-sm text-[#636366] mb-7 leading-relaxed">
              Sign in or create an account — we'll figure out the rest.
            </p>

            {/* Error flash set by GoogleAuthController on OAuth failure */}
            {shouldShowError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                {flash.error}
              </motion.div>
            )}

            {/* Plain <a> – bypasses Inertia so the browser follows the OAuth redirect */}
            <a
              href="/projects/auth/google/redirect"
              className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl bg-white text-[#1a1a1a] text-sm font-semibold hover:bg-[#f0f0f0] active:bg-[#e4e4e4] transition-colors duration-150 shadow-sm"
            >
              <GoogleIcon />
              Continue with Google
            </a>

            <p className="text-center text-xs text-[#48484A] mt-5 leading-relaxed">
              New here? We'll create your account automatically.
            </p>
          </div>
        </motion.div>
      </div>
    </>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className="shrink-0">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  )
}
