import { Head, Link, router, useForm } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { ArrowLeft, KeyRound } from 'lucide-react'
import { useState } from 'react'
import { authHeaders, getToken, loginForTodos } from '../../lib/todo-auth'
import axios from 'axios'
// ShadCN components
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'

export default function TodoLogin() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { data, setData } = useForm({ email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await loginForTodos({ email: data.email, password: data.password })
      const token = getToken()
      if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
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
          {/* ShadCN Card replaces the raw div */}
          <Card className="bg-[#2C2C2E] border-[#3A3A3C] text-white">
            <CardHeader>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-[#98989D] hover:text-white transition-colors mb-2"
              >
                <ArrowLeft size={16} />
                Back to home
              </Link>

              <div className="flex items-center gap-3">
                {/* Icon badge */}
                <div className="p-2 bg-[#0A84FF]/10 rounded-lg">
                  <KeyRound size={20} className="text-[#0A84FF]" />
                </div>
                {/* ShadCN CardTitle + CardDescription */}
                <div>
                  <CardTitle className="text-2xl text-white">Welcome back</CardTitle>
                  <CardDescription className="text-[#98989D]">
                    Log in to your Todo account
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
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
                <div className="space-y-1.5">
                  {/* ShadCN Label */}
                  <Label htmlFor="email" className="text-[#98989D]">
                    Email
                  </Label>
                  {/* ShadCN Input */}
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="username"
                    required
                    className="bg-[#3A3A3C] border-none text-white placeholder:text-[#98989D] focus-visible:ring-[#0A84FF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-[#98989D]">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    autoComplete="current-password"
                    required
                    className="bg-[#3A3A3C] border-none text-white placeholder:text-[#98989D] focus-visible:ring-[#0A84FF]"
                  />
                </div>

                {/* ShadCN Button replaces raw button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0A84FF] hover:bg-[#0A74FF] text-white mt-2"
                >
                  {loading ? 'Logging in...' : 'Log in'}
                </Button>
              </form>

              <p className="text-center text-sm text-[#98989D] mt-6">
                Don't have an account?{' '}
                <Link href="/todo-auth/signup" className="text-[#0A84FF] hover:underline">
                  Sign up
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  )
}
