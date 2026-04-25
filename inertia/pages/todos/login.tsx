import { Head, Link, router, useForm } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { ArrowLeft, KeyRound } from 'lucide-react'
import { useState } from 'react'
import { authHeaders, getToken, loginForTodos } from '../../lib/todo-auth'
import axios from 'axios'

export default function TodoLogin() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { data, setData } = useForm({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await loginForTodos({ email: data.email, password: data.password })
      const token = getToken()
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }
      router.visit('/todos', { headers: authHeaders() })
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head title="Log In — Todos" />
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

            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-[#0A84FF]/10 rounded-lg">
                <KeyRound size={20} className="text-[#0A84FF]" />
              </div>
              <h1 className="text-2xl font-bold">Welcome back</h1>
            </div>
            <p className="text-sm text-[#98989D] mb-6 ml-11">Log in to your Todo account</p>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 text-sm text-[#FF6B6B] bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 rounded-lg px-4 py-2"
              >
                {error}
              </motion.p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  required
                  className="w-full px-4 py-3 bg-[#3A3A3C] text-white placeholder-[#98989D] rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:outline-none"
                />
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
                  required
                  className="w-full px-4 py-3 bg-[#3A3A3C] text-white placeholder-[#98989D] rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:outline-none"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-[#0A84FF] text-white py-3 rounded-lg font-medium hover:bg-[#0A74FF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
              >
                {loading ? 'Logging in...' : 'Log in'}
              </motion.button>
            </form>

            <p className="text-center text-sm text-[#98989D] mt-6">
              Don't have an account?{' '}
              <Link href="/todo-auth/signup" className="text-[#0A84FF] hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  )
}
