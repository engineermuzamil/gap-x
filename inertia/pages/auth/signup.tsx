import { Head, Link } from '@inertiajs/react'
import { useForm } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

export default function Signup() {
  const { data, setData, post, processing, errors } = useForm({
    fullName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/signup')
  }

  return (
    <>
      <Head title="Sign Up" />
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

            <h1 className="text-2xl font-bold mb-1">Create account</h1>
            <p className="text-sm text-[#98989D] mb-6">Enter your details to get started</p>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm text-[#98989D] mb-1.5">
                  Full name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={data.fullName}
                  onChange={(e) => setData('fullName', e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-[#3A3A3C] text-white placeholder-[#98989D] rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:outline-none"
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-[#FF6B6B]">{errors.fullName}</p>
                )}
              </div>

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
                  autoComplete="email"
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
                  autoComplete="new-password"
                  className="w-full px-4 py-3 bg-[#3A3A3C] text-white placeholder-[#98989D] rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:outline-none"
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-[#FF6B6B]">{errors.password}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="passwordConfirmation"
                  className="block text-sm text-[#98989D] mb-1.5"
                >
                  Confirm password
                </label>
                <input
                  id="passwordConfirmation"
                  type="password"
                  value={data.passwordConfirmation}
                  onChange={(e) => setData('passwordConfirmation', e.target.value)}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 bg-[#3A3A3C] text-white placeholder-[#98989D] rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:outline-none"
                />
                {errors.passwordConfirmation && (
                  <p className="mt-1 text-xs text-[#FF6B6B]">{errors.passwordConfirmation}</p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={processing}
                className="w-full bg-[#0A84FF] text-white py-3 rounded-lg font-medium hover:bg-[#0A74FF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
              >
                {processing ? 'Creating account...' : 'Sign up'}
              </motion.button>
            </form>

            <p className="text-center text-sm text-[#98989D] mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-[#0A84FF] hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  )
}
