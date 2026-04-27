import type React from 'react'
import { motion } from 'framer-motion'
import LabelPicker from '../../lib/label-picker'
import type { Label } from '../../lib/types'
import NoteTitleInput from './note-title-input'
import NoteContentEditor from './note-content-editor'
import NoteImageUpload from './note-image-upload'

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

// This file is now just an orchestrator — it wires sub-components together
// and owns no logic of its own. Each sub-component is responsible for its
// own UI and internal state.
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
  // Compute displayed image URL here so we don't pass conflicting props down
  const displayedImageUrl = data.removeImage ? null : (data.imageUrl ?? existingImageUrl ?? null)

  return (
    <motion.div
      className="bg-[#2C2C2E] rounded-xl p-6 backdrop-blur-lg border border-[#3A3A3C]"
      style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)' }}
    >
      <h2 className="text-xl font-semibold text-white mb-4">
        {isEditing ? 'Edit Note' : 'New Note'}
      </h2>

      <form onSubmit={submit}>
        {/* Title field */}
        <NoteTitleInput value={data.title} onChange={(v) => setData('title', v)} />

        {/* Write/Preview tabs + textarea + giphy picker */}
        <NoteContentEditor
          value={data.content}
          onChange={(v) => setData('content', v)}
          onKeyDown={handleKeyDown}
        />

        {/* Image upload + preview */}
        <NoteImageUpload
          displayedImageUrl={displayedImageUrl}
          onUploaded={(url) => {
            setData('imageUrl', url)
            setData('removeImage', false)
          }}
          onRemove={() => {
            setData('imageUrl', null)
            setData('removeImage', true)
          }}
        />

        {/* Label picker */}
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

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={processing}
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
