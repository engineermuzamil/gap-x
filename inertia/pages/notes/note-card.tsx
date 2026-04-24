import { useState } from 'react'
import { motion } from 'framer-motion'
import { router } from '@inertiajs/react'
import { formatDistanceToNow } from 'date-fns'
import {
  PencilIcon,
  Trash2,
  Pin,
  PinOff,
  ImageIcon,
  Share2,
  Link2Off,
  Copy,
  Check,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import markdownComponents from '../../lib/markdown-components'
import { getLabelColor } from '../../lib/label-colors'
import type { Note } from '../../lib/types'

interface NoteCardProps {
  note: Note
  viewType: 'grid' | 'list'
  onEdit: (note: Note) => void
  onDelete: (id: number) => void
  onTogglePin: (note: Note) => void
}

function getTimestamp(note: Note): string {
  const created = new Date(note.createdAt).getTime()
  const updated = note.updatedAt ? new Date(note.updatedAt).getTime() : null
  const wasEdited = updated !== null && updated - created > 5000
  if (wasEdited) return `Updated ${formatDistanceToNow(updated!, { addSuffix: true })}`
  return `Created ${formatDistanceToNow(created, { addSuffix: true })}`
}

export default function NoteCard({ note, viewType, onEdit, onDelete, onTogglePin }: NoteCardProps) {
  const isPinned = Boolean(note.pinned)
  const timestamp = getTimestamp(note)

  const [shareToken, setShareToken] = useState<string | null>(note.shareToken ?? null)
  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    router.post(
      `/notes/${note.id}/share`,
      {},
      {
        preserveScroll: true,
        onSuccess: (page) => {
          const updatedNote = (page.props.notes as Note[])?.find((n) => n.id === note.id)
          if (updatedNote?.shareToken) setShareToken(updatedNote.shareToken)
        },
      }
    )
  }

  const handleUnshare = () => {
    router.delete(`/notes/${note.id}/share`, {
      preserveScroll: true,
      onSuccess: () => setShareToken(null),
    })
  }

  const handleCopyLink = () => {
    if (!shareToken) return
    navigator.clipboard.writeText(`${window.location.origin}/notes/share/${shareToken}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      className={`relative overflow-hidden backdrop-blur-sm bg-[#2C2C2E]/80 border ${
        isPinned ? 'border-[#0A84FF]/50' : 'border-[#3A3A3C]'
      } rounded-xl flex flex-col`}
      style={{ boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)' }}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {isPinned && <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#0A84FF]/60" />}

      {note.imageUrl && (
        <div className="relative w-full overflow-hidden">
          <img
            src={note.imageUrl}
            alt={`Image for ${note.title}`}
            className={`w-full object-cover ${viewType === 'list' ? 'max-h-32' : 'max-h-48'}`}
            loading="lazy"
          />
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#2C2C2E]/60 to-transparent" />
          <span className="absolute top-2 right-2 bg-[#1C1C1E]/70 rounded-md px-1.5 py-0.5 flex items-center gap-1 text-[10px] text-[#98989D]">
            <ImageIcon size={10} />
            image
          </span>
        </div>
      )}

      {/* Card body */}
      <div className="p-4 flex-1">
        <h2 className="text-base font-medium text-white mb-2">{note.title}</h2>

        {note.labels.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {note.labels.map((label) => {
              const { bg, text } = getLabelColor(label.name)
              return (
                <span key={label.id} className={`text-xs px-2 py-0.5 rounded-full ${bg} ${text}`}>
                  {label.name}
                </span>
              )
            })}
          </div>
        )}

        <div className="text-sm text-[#E5E5EA]">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {note.content}
          </ReactMarkdown>
        </div>
      </div>

      {/* Footer: timestamp left, actions right */}
      <div className="px-4 py-2 border-t border-[#3A3A3C] flex items-center justify-between gap-2">
        <span className="text-[11px] text-[#98989D] truncate">{timestamp}</span>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onTogglePin(note)}
            title={isPinned ? 'Unpin note' : 'Pin note'}
            className={`h-7 w-7 rounded-lg bg-[#3A3A3C] flex items-center justify-center transition-colors ${
              isPinned ? 'text-[#0A84FF] hover:text-[#3B9BFF]' : 'text-[#98989D] hover:text-white'
            }`}
          >
            {isPinned ? <PinOff size={13} /> : <Pin size={13} />}
          </button>

          <button
            type="button"
            onClick={shareToken ? handleUnshare : handleShare}
            title={shareToken ? 'Revoke shared link' : 'Share note'}
            className={`h-7 w-7 rounded-lg bg-[#3A3A3C] flex items-center justify-center transition-colors ${
              shareToken ? 'text-[#30D158] hover:text-[#34C759]' : 'text-[#98989D] hover:text-white'
            }`}
          >
            {shareToken ? <Link2Off size={13} /> : <Share2 size={13} />}
          </button>

          {shareToken && (
            <button
              type="button"
              onClick={handleCopyLink}
              title="Copy share link"
              className="h-7 w-7 rounded-lg bg-[#3A3A3C] flex items-center justify-center text-[#98989D] hover:text-white transition-colors"
            >
              {copied ? <Check size={13} className="text-[#30D158]" /> : <Copy size={13} />}
            </button>
          )}

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
    </motion.div>
  )
}
