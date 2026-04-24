import type React from 'react'
import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import markdownComponents from '../../lib/markdown-components'
import LabelPicker from '../../lib/label-picker'
import type { Label } from '../../lib/sort-notes'
import { ImageIcon, XCircleIcon, UploadIcon, Loader2Icon } from 'lucide-react'

interface NoteFormProps {
  data: {
    title: string
    content: string
    pinned: boolean
    labelIds: number[]
    imageUrl: string | null
    removeImage: boolean
  }
  setData: (field: string, value: any) => void
  submit: (e: React.FormEvent) => void
  processing: boolean
  handleKeyDown: (e: React.KeyboardEvent) => void
  isEditing: boolean
  allLabels: Label[]
  existingImageUrl?: string | null
}

const MARKDOWN_PLACEHOLDER = `Write your note here... Markdown is supported.

## Heading
**bold**, *italic*, \`inline code\`

- list item

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
  allLabels,
  existingImageUrl,
}: NoteFormProps) {
  const [preview, setPreview] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const displayedImageUrl = data.removeImage ? null : (data.imageUrl ?? existingImageUrl ?? null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await axios.post<{ url: string }>('/notes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setData('imageUrl', response.data.url)
      setData('removeImage', false)
    } catch {
      setUploadError('Upload failed — please try again.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleRemoveImage = () => {
    setData('imageUrl', null)
    setData('removeImage', true)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <motion.div
      className="bg-[#2C2C2E] rounded-xl p-6 backdrop-blur-lg border border-[#3A3A3C]"
      style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)' }}
    >
      <h2 className="text-xl font-semibold text-white mb-4">
        {isEditing ? 'Edit Note' : 'New Note'}
      </h2>

      <form onSubmit={submit}>
        {/* Title */}
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
          {['Write', 'Preview'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setPreview(tab === 'Preview')}
              className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
                (tab === 'Preview') === preview
                  ? 'bg-[#3A3A3C] text-white'
                  : 'text-[#98989D] hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
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

        {/* ── Image upload section ─────────────────────────────────────────── */}
        <div className="mb-4">
          <p className="text-xs text-[#98989D] mb-2 flex items-center gap-1.5">
            <ImageIcon size={13} />
            Image (optional · jpg, png, gif, webp · max 5 MB)
          </p>

          {/* Preview area */}
          <AnimatePresence>
            {displayedImageUrl && (
              <motion.div
                key="img-preview"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="relative mb-3 rounded-lg overflow-hidden border border-[#3A3A3C]"
              >
                <img
                  src={displayedImageUrl}
                  alt="Note image preview"
                  className="w-full max-h-56 object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  title="Remove image"
                  className="absolute top-2 right-2 bg-[#1C1C1E]/80 rounded-full p-0.5 text-[#FF6B6B] hover:text-[#FF8787] transition-colors"
                >
                  <XCircleIcon size={22} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upload button / spinner */}
          <label
            className={`flex items-center gap-2 w-fit ${uploading ? 'cursor-wait' : 'cursor-pointer'}`}
          >
            <span
              className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition-colors ${
                uploading
                  ? 'border-[#0A84FF] text-[#0A84FF]'
                  : 'border-[#3A3A3C] text-[#98989D] hover:text-white hover:border-[#0A84FF]'
              }`}
            >
              {uploading ? (
                <>
                  <Loader2Icon size={14} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadIcon size={14} />
                  {displayedImageUrl ? 'Replace image' : 'Upload image'}
                </>
              )}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>

          {/* Upload error message */}
          {uploadError && <p className="mt-1.5 text-xs text-[#FF6B6B]">{uploadError}</p>}
        </div>

        {/* Labels */}
        <LabelPicker
          allLabels={allLabels}
          selectedIds={data.labelIds}
          onChange={(ids) => setData('labelIds', ids)}
        />

        {/* Pin toggle */}
        <div className="mb-4">
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
          disabled={processing || uploading}
          className="w-full bg-[#0A84FF] text-white px-4 py-3 rounded-lg hover:bg-[#0A74FF] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
