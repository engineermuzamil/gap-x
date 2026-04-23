import type React from 'react'
import { motion } from 'framer-motion'

interface TodoFormProps {
  data: {
    title: string
    description: string
    isCompleted: boolean
  }
  setData: (field: string, value: string | boolean) => void
  submit: (e: React.FormEvent) => void
  processing: boolean
  handleKeyDown: (e: React.KeyboardEvent) => void
  isEditing: boolean
}

export default function TodoForm({
  data,
  setData,
  submit,
  processing,
  handleKeyDown,
  isEditing,
}: TodoFormProps) {
  return (
    <motion.div
      className="bg-[#2C2C2E] rounded-xl p-6 backdrop-blur-lg border border-[#3A3A3C]"
      style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)' }}
    >
      <h2 className="text-xl font-semibold text-white mb-4">
        {isEditing ? 'Edit Todo' : 'New Todo'}
      </h2>

      <form onSubmit={submit}>
        <div className="mb-4">
          <motion.input
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            type="text"
            value={data.title}
            onChange={(e) => setData('title', e.target.value)}
            placeholder="Todo title"
            className="w-full px-4 py-3 bg-[#3A3A3C] text-white placeholder-[#98989D] rounded-lg border-none focus:ring-2 focus:ring-[#0A84FF] focus:outline-none transition-all duration-200"
            required
          />
        </div>

        <div className="mb-4">
          <motion.textarea
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            value={data.description}
            onChange={(e) => setData('description', e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Todo description (optional)"
            className="w-full px-4 py-3 bg-[#3A3A3C] text-white placeholder-[#98989D] rounded-lg border-none focus:ring-2 focus:ring-[#0A84FF] focus:outline-none min-h-[120px] transition-all duration-200"
          />
        </div>

        <label className="flex items-center gap-3 mb-4 text-sm text-[#98989D]">
          <input
            type="checkbox"
            checked={data.isCompleted}
            onChange={(e) => setData('isCompleted', e.target.checked)}
            className="h-4 w-4 rounded accent-[#0A84FF]"
          />
          Mark as completed
        </label>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={processing}
          className="w-full bg-[#0A84FF] text-white px-4 py-3 rounded-lg hover:bg-[#0A74FF] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:ring-offset-2 focus:ring-offset-[#2C2C2E] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {processing
            ? isEditing
              ? 'Saving...'
              : 'Adding...'
            : isEditing
              ? 'Save Todo'
              : 'Add Todo'}
        </motion.button>

        <p className="text-center text-sm text-[#98989D] mt-2">
          Hit{' '}
          {typeof navigator !== 'undefined' && navigator.platform?.includes('Mac') ? '⌘' : 'Ctrl'} +
          Enter to save
        </p>
      </form>
    </motion.div>
  )
}
