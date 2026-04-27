import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { ImageIcon, XCircleIcon, UploadIcon, Loader2Icon } from 'lucide-react'

interface NoteImageUploadProps {
  // The URL currently shown (could be newly uploaded or existing)
  displayedImageUrl: string | null
  onUploaded: (url: string) => void
  onRemove: () => void
}

// Handles everything image-related:
// uploading to /notes/upload, previewing, removing
// Parent (note-form) just receives the final URL via onUploaded
export default function NoteImageUpload({
  displayedImageUrl,
  onUploaded,
  onRemove,
}: NoteImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      onUploaded(response.data.url)
    } catch {
      setUploadError('Upload failed — please try again.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="mb-4">
      <p className="text-xs text-[#98989D] mb-2 flex items-center gap-1.5">
        <ImageIcon size={13} />
        Image (optional · jpg, png, gif, webp · max 5 MB)
      </p>

      {/* Image preview — animates in/out */}
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
              onClick={onRemove}
              title="Remove image"
              className="absolute top-2 right-2 bg-[#1C1C1E]/80 rounded-full p-0.5 text-[#FF6B6B] hover:text-[#FF8787] transition-colors"
            >
              <XCircleIcon size={22} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload button — wraps a hidden file input */}
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
              <Loader2Icon size={14} className="animate-spin" /> Uploading...
            </>
          ) : (
            <>
              <UploadIcon size={14} /> {displayedImageUrl ? 'Replace image' : 'Upload image'}
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

      {uploadError && <p className="mt-1.5 text-xs text-[#FF6B6B]">{uploadError}</p>}
    </div>
  )
}
