import type React from 'react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import markdownComponents from '../../lib/markdown-components'

interface NoteFormProps {
  data: {
    title: string
    content: string
    pinned: boolean
  }
  setData: (field: string, value: any) => void
  submit: (e: React.FormEvent) => void
  processing: boolean
  handleKeyDown: (e: React.KeyboardEvent) => void
  isEditing: boolean
}

const MARKDOWN_PLACEHOLDER = `Write your note here... Markdown is supported.

## Heading
**bold**, *italic*, \`inline code\`

- list item
- another item

\`\`\`ts
const hello = 'world'
\`\`\`

> blockquote`

export default function NoteForm({
  data,
  setData,
  submit,
  processing,
  handleKeyDown,
  isEditing,
}: NoteFormProps) {
  const [preview, setPreview] = useState(false)

  return (
    <motion.div
      className="bg-[#2C2C2E] rounded-xl p-6 backdrop-blur-lg border border-[#3A3A3C]"
      style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)' }}
    >
      <h2 className="text-xl font-semibold text-white mb-4">
        {isEditing ? 'Edit Note' : 'New Note'}
      </h2>

      <form onSubmit={submit}>
        <div className="mb-4">
          <motion.input
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            type="text"
            value={data.title}
            onChange={(e) => setData('title', e.target.value)}
            placeholder="Note title"
            className="w-full px-4 py-3 bg-[#3A3A3C] text-white placeholder-[#98989D] rounded-lg border-none focus:ring-2 focus:ring-[#0A84FF] focus:outline-none transition-all duration-200"
            required
          />
        </div>

        {/* Write / Preview toggle */}
        <div className="flex items-center gap-2 mb-2">
          <button
            type="button"
            onClick={() => setPreview(false)}
            className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
              !preview ? 'bg-[#3A3A3C] text-white' : 'text-[#98989D] hover:text-white'
            }`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setPreview(true)}
            className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
              preview ? 'bg-[#3A3A3C] text-white' : 'text-[#98989D] hover:text-white'
            }`}
          >
            Preview
          </button>
        </div>

        <div className="mb-4">
          {preview ? (
            <div className="w-full px-4 py-3 bg-[#3A3A3C] rounded-lg min-h-[120px] text-sm prose-note">
              {data.content ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {data.content}
                </ReactMarkdown>
              ) : (
                <p className="text-[#98989D]">Nothing to preview yet.</p>
              )}
            </div>
          ) : (
            <motion.textarea
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              value={data.content}
              onChange={(e) => setData('content', e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={MARKDOWN_PLACEHOLDER}
              className="w-full px-4 py-3 bg-[#3A3A3C] text-white placeholder-[#98989D] rounded-lg border-none focus:ring-2 focus:ring-[#0A84FF] focus:outline-none min-h-[120px] transition-all duration-200 font-mono text-sm"
              required
            />
          )}
        </div>

        <div className="mb-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setData('pinned', !data.pinned)}
            className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${
              data.pinned
                ? 'border-[#0A84FF] text-[#0A84FF] bg-[#0A84FF]/10'
                : 'border-[#3A3A3C] text-[#98989D] hover:text-white'
            }`}
          >
            {data.pinned ? 'Pinned ✓' : 'Pin this note'}
          </button>
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
              ? 'Save Note'
              : 'Add Note'}
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
