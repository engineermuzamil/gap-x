import { Head, Link, router, useForm } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { ArrowLeft, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { signupForTodos } from '../../lib/todo-auth'
// ShadCN components
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'

export default function TodoSignup() {
  const [loading, setLoading] = useState(false)
  const { data, setData } = useForm({
    fullName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (data.password !== data.passwordConfirmation) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await signupForTodos(data)
      router.visit('/todos')
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head title="Sign Up — Todos" />
      <div className="min-h-screen bg-[#1C1C1E] text-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
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
                <div className="p-2 bg-[#30D158]/10 rounded-lg">
                  <UserPlus size={20} className="text-[#30D158]" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-white">Create account</CardTitle>
                  <CardDescription className="text-[#98989D]">
                    Start managing your todos
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
                  <Label htmlFor="fullName" className="text-[#98989D]">
                    Full name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={data.fullName}
                    onChange={(e) => setData('fullName', e.target.value)}
                    placeholder="John Doe"
                    required
                    className="bg-[#3A3A3C] border-none text-white placeholder:text-[#98989D] focus-visible:ring-[#0A84FF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-[#98989D]">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
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
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className="bg-[#3A3A3C] border-none text-white placeholder:text-[#98989D] focus-visible:ring-[#0A84FF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="passwordConfirmation" className="text-[#98989D]">
                    Confirm password
                  </Label>
                  <Input
                    id="passwordConfirmation"
                    type="password"
                    value={data.passwordConfirmation}
                    onChange={(e) => setData('passwordConfirmation', e.target.value)}
                    autoComplete="new-password"
                    required
                    className="bg-[#3A3A3C] border-none text-white placeholder:text-[#98989D] focus-visible:ring-[#0A84FF]"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0A84FF] hover:bg-[#0A74FF] text-white mt-2"
                >
                  {loading ? 'Creating account...' : 'Sign up'}
                </Button>
              </form>

              <p className="text-center text-sm text-[#98989D] mt-6">
                Already have an account?{' '}
                <Link href="/todo-auth/login" className="text-[#0A84FF] hover:underline">
                  Log in
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  )
}
