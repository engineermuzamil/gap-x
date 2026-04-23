import type React from 'react'
import { motion } from 'framer-motion'

interface ProjectFormProps {
  data: {
    title: string
    description: string
    status: 'pending' | 'in-progress' | 'completed'
  }
  setData: (field: string, value: string) => void
  submit: (e: React.FormEvent) => void
  processing: boolean
  handleKeyDown: (e: React.KeyboardEvent) => void
  isEditing: boolean
}

export default function ProjectForm({
  data,
  setData,
  submit,
  processing,
  handleKeyDown,
  isEditing,
}: ProjectFormProps) {
  return (
    <motion.div
      className="bg-[#2C2C2E] rounded-xl p-6 backdrop-blur-lg border border-[#3A3A3C]"
      style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)' }}
    >
      <h2 className="text-xl font-semibold text-white mb-4">
        {isEditing ? 'Edit Project' : 'New Project'}
      </h2>

      <form onSubmit={submit}>
        <div className="mb-4">
          <motion.input
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            type="text"
            value={data.title}
            onChange={(e) => setData('title', e.target.value)}
            placeholder="Project title"
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
            placeholder="Project description"
            className="w-full px-4 py-3 bg-[#3A3A3C] text-white placeholder-[#98989D] rounded-lg border-none focus:ring-2 focus:ring-[#0A84FF] focus:outline-none min-h-[120px] transition-all duration-200"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-[#98989D] mb-2">Status</label>
          <div className="flex gap-3">
            {(['pending', 'in-progress', 'completed'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setData('status', s)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                  data.status === s
                    ? s === 'pending'
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500'
                      : s === 'in-progress'
                        ? 'bg-blue-500/15 text-blue-300 border-blue-500'
                        : 'bg-emerald-500/15 text-emerald-300 border-emerald-500'
                    : 'bg-[#3A3A3C] text-[#98989D] border-transparent hover:text-white'
                }`}
              >
                {s === 'pending' ? 'Pending' : s === 'in-progress' ? 'In Progress' : 'Completed'}
              </button>
            ))}
          </div>
        </div>

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
              ? 'Save Project'
              : 'Add Project'}
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
