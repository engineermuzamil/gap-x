import { motion } from 'framer-motion'

interface NoteTitleInputProps {
  value: string
  onChange: (value: string) => void
}

// Simple focused component — just the title field
// Kept separate so note-form.tsx stays readable
export default function NoteTitleInput({ value, onChange }: NoteTitleInputProps) {
  return (
    <div className="mb-4">
      <motion.input
        whileFocus={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Note title"
        required
        className="w-full px-4 py-3 bg-[#3A3A3C] text-white placeholder-[#98989D] rounded-lg border-none focus:ring-2 focus:ring-[#0A84FF] focus:outline-none transition-all duration-200"
      />
    </div>
  )
}
