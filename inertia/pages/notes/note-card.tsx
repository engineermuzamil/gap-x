import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { PencilIcon, Trash2, Pin, PinOff } from 'lucide-react'

interface Note {
  id: number
  title: string
  content: string
  pinned: boolean
  createdAt: string
  updatedAt: string | null
}

interface NoteCardProps {
  note: Note
  viewType: 'grid' | 'list'
  onEdit: (note: Note) => void
  onDelete: (id: number) => void
  onTogglePin: (note: Note) => void
}

export default function NoteCard({ note, viewType, onEdit, onDelete, onTogglePin }: NoteCardProps) {
  const timeAgo = formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })
  const isPinned = Boolean(note.pinned)

  return (
    <motion.div
      className={`relative overflow-hidden backdrop-blur-sm bg-[#2C2C2E]/80 border ${
        isPinned ? 'border-[#0A84FF]/50' : 'border-[#3A3A3C]'
      } ${viewType === 'grid' ? 'rounded-xl break-inside-avoid mb-4' : 'rounded-lg'}`}
      style={{ boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)' }}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {isPinned && <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#0A84FF]/60" />}

      <div className={`p-5 ${viewType === 'list' ? 'flex items-start gap-4' : ''}`}>
        <div className={viewType === 'list' ? 'flex-1' : ''}>
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-lg font-medium text-white">{note.title}</h2>

            <div className="flex items-center gap-1 ml-2 shrink-0">
              <span className="text-xs text-[#98989D] mr-1">{timeAgo}</span>

              <button
                type="button"
                onClick={() => onTogglePin(note)}
                title={isPinned ? 'Unpin note' : 'Pin note'}
                className={`h-7 w-7 rounded-lg bg-[#3A3A3C] flex items-center justify-center transition-colors ${
                  isPinned
                    ? 'text-[#0A84FF] hover:text-[#3B9BFF]'
                    : 'text-[#98989D] hover:text-white'
                }`}
              >
                {isPinned ? <PinOff size={13} /> : <Pin size={13} />}
              </button>

              <button
                type="button"
                onClick={() => onEdit(note)}
                title="Edit note"
                className="h-7 w-7 rounded-lg bg-[#3A3A3C] flex items-center justify-center text-[#0A84FF] hover:text-[#3B9BFF] transition-colors"
              >
                <PencilIcon size={13} />
              </button>

              <button
                type="button"
                onClick={() => onDelete(note.id)}
                title="Delete note"
                className="h-7 w-7 rounded-lg bg-[#3A3A3C] flex items-center justify-center text-[#FF6B6B] hover:text-[#FF8787] transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          <p className="text-[#98989D] text-sm leading-relaxed">{note.content}</p>
        </div>
      </div>
    </motion.div>
  )
}
