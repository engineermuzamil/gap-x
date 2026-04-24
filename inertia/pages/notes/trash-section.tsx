import { useState } from 'react'
import { router } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, RotateCcw, XCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { Note } from '../../lib/types'

interface TrashSectionProps {
  trashedNotes: Note[]
}

export default function TrashSection({ trashedNotes }: TrashSectionProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!trashedNotes.length) return null

  const handleRestore = (id: number) => {
    router.post(`/notes/${id}/restore`, {}, { preserveScroll: true })
  }

  const handleForceDelete = (id: number) => {
    router.delete(`/notes/${id}/force`, { preserveScroll: true })
  }

  return (
    <div className="mt-8">
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 w-full group"
      >
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#98989D] group-hover:text-white transition-colors">
          <Trash2 size={14} />
          Trash
          <span className="text-xs font-normal normal-case tracking-normal bg-[#3A3A3C] px-1.5 py-0.5 rounded-full">
            {trashedNotes.length}
          </span>
        </div>
        <div className="h-px flex-1 bg-[#3A3A3C]" />
        {isOpen ? (
          <ChevronUp size={14} className="text-[#98989D]" />
        ) : (
          <ChevronDown size={14} className="text-[#98989D]" />
        )}
      </button>

      {/* Trashed notes list */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2 mt-3">
              {trashedNotes.map((note) => (
                <div
                  key={note.id}
                  className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl bg-[#2C2C2E]/60 border border-[#3A3A3C] opacity-60 hover:opacity-100 transition-opacity"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{note.title}</p>
                    <p className="text-xs text-[#98989D] mt-0.5">
                      Deleted{' '}
                      {note.deletedAt
                        ? formatDistanceToNow(new Date(note.deletedAt), { addSuffix: true })
                        : 'recently'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Restore */}
                    <button
                      type="button"
                      onClick={() => handleRestore(note.id)}
                      title="Restore note"
                      className="h-7 w-7 rounded-lg bg-[#3A3A3C] flex items-center justify-center text-[#30D158] hover:text-[#34C759] transition-colors"
                    >
                      <RotateCcw size={13} />
                    </button>

                    {/* Permanently delete */}
                    <button
                      type="button"
                      onClick={() => handleForceDelete(note.id)}
                      title="Permanently delete"
                      className="h-7 w-7 rounded-lg bg-[#3A3A3C] flex items-center justify-center text-[#FF6B6B] hover:text-[#FF8787] transition-colors"
                    >
                      <XCircle size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
