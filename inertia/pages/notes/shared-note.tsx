import { Head, Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { ArrowLeft, Pin } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import markdownComponents from '../../lib/markdown-components'
import { getLabelColor } from '../../lib/label-colors'
import type { Note } from '../../lib/types'

export default function Shared({ note }: { note: Note }) {
  const created = new Date(note.createdAt).getTime()
  const updated = note.updatedAt ? new Date(note.updatedAt).getTime() : null
  const wasEdited = updated !== null && updated - created > 5000
  const timestamp = wasEdited
    ? `Updated ${formatDistanceToNow(updated!, { addSuffix: true })}`
    : `Created ${formatDistanceToNow(created, { addSuffix: true })}`

  return (
    <>
      <Head title={note.title} />
      <div className="min-h-screen bg-[#1C1C1E] text-white">
        <div className="max-w-2xl mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <Link
              href="/"
              className="p-2 hover:bg-[#2C2C2E] rounded-full transition-colors duration-200"
            >
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-xl font-semibold text-[#98989D]">Shared Note</h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`relative overflow-hidden bg-[#2C2C2E]/80 border ${
              note.pinned ? 'border-[#0A84FF]/50' : 'border-[#3A3A3C]'
            } rounded-xl`}
            style={{ boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)' }}
          >
            {note.pinned && <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#0A84FF]/60" />}

            {note.imageUrl && (
              <div className="relative w-full overflow-hidden">
                <img
                  src={note.imageUrl}
                  alt={`Image for ${note.title}`}
                  className="w-full max-h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#2C2C2E]/60 to-transparent" />
              </div>
            )}

            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-2xl font-semibold text-white">{note.title}</h2>
                {note.pinned && (
                  <span className="flex items-center gap-1 text-xs text-[#0A84FF] bg-[#0A84FF]/10 border border-[#0A84FF]/30 px-2 py-1 rounded-full">
                    <Pin size={11} />
                    Pinned
                  </span>
                )}
              </div>

              <p className="text-xs text-[#98989D] mb-4">{timestamp}</p>

              {note.labels.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {note.labels.map((label) => {
                    const { bg, text } = getLabelColor(label.name)
                    return (
                      <span
                        key={label.id}
                        className={`text-xs px-2 py-0.5 rounded-full ${bg} ${text}`}
                      >
                        {label.name}
                      </span>
                    )
                  })}
                </div>
              )}

              <div className="text-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {note.content}
                </ReactMarkdown>
              </div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-xs text-[#98989D] mt-6"
          >
            This note was shared via a public link.
          </motion.p>
        </div>
      </div>
    </>
  )
}
