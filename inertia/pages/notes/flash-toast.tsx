import { useEffect, useState } from 'react'
import { usePage } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle } from 'lucide-react'

type FlashProps = {
  success?: string
  error?: string
}

function Toast({ text, type }: { text: string; type: 'success' | 'error' }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-sm font-medium border ${
              type === 'success'
                ? 'bg-[#1C1C1E] border-[#30D158]/40 text-[#30D158]'
                : 'bg-[#1C1C1E] border-[#FF6B6B]/40 text-[#FF6B6B]'
            }`}
          >
            {type === 'success' ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
            {text}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function FlashToast() {
  const page = usePage<{ flash: FlashProps }>()
  const flash = page.props.flash
  const visitKey = page.version

  const text = flash?.success || flash?.error
  const type: 'success' | 'error' = flash?.success ? 'success' : 'error'

  if (!text) return null

  return <Toast key={visitKey} text={text} type={type} />
}
