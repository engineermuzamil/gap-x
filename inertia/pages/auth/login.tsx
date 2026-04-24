import { Head, Link } from '@inertiajs/react'
import { useForm } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/login')
  }

  return (
    <>
      <Head title="Log In" />
      <div className="min-h-screen bg-[#1C1C1E] text-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div
            className="bg-[#2C2C2E] rounded-2xl p-8 border border-[#3A3A3C]"
            style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-[#98989D] hover:text-white transition-colors mb-6"
            >
              <ArrowLeft size={16} />
              Back to home
            </Link>

            <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
            <p className="text-sm text-[#98989D] mb-6">Log in to your account</p>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm text-[#98989D] mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="username"
                  className="w-full px-4 py-3 bg-[#3A3A3C] text-white placeholder-[#98989D] rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:outline-none"
                />
                {errors.email && <p className="mt-1 text-xs text-[#FF6B6B]">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm text-[#98989D] mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  autoComplete="current-password"
                  className="w-full px-4 py-3 bg-[#3A3A3C] text-white placeholder-[#98989D] rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:outline-none"
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-[#FF6B6B]">{errors.password}</p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={processing}
                className="w-full bg-[#0A84FF] text-white py-3 rounded-lg font-medium hover:bg-[#0A74FF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
              >
                {processing ? 'Logging in...' : 'Log in'}
              </motion.button>
            </form>

            <p className="text-center text-sm text-[#98989D] mt-6">
              Don't have an account?{' '}
              <Link href="/signup" className="text-[#0A84FF] hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  )
}
