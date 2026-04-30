import { useState } from 'react'
import { useForm } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { LinkIcon, Loader2Icon } from 'lucide-react'
import { z } from 'zod'

const urlSchema = z
  .string()
  .min(1, 'URL is required')
  .url('Please enter a valid URL (include https://)')

export default function BookmarkForm() {
  const { data, setData, post, processing, reset } = useForm({ url: '' })

  const [validationError, setValidationError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    const result = urlSchema.safeParse(data.url)
    if (!result.success) {
      setValidationError(result.error.issues[0].message)
      return
    }

    post('/bookmarks', {
      onSuccess: () => {
        reset()
        setValidationError(null)
      },
    })
  }

  return (
    <motion.div
      className="bg-[#2C2C2E] rounded-xl p-6 backdrop-blur-lg border border-[#3A3A3C] mb-6"
      style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)' }}
    >
      <h2 className="text-xl font-semibold text-white mb-4">Save a Bookmark</h2>

      <form onSubmit={handleSubmit}>
        {/* URL input */}
        <div className="mb-4">
          <div className="relative">
            <LinkIcon
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98989D] pointer-events-none"
            />
            <motion.input
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              type="url"
              value={data.url}
              onChange={(e) => {
                setData('url', e.target.value)

                if (validationError) setValidationError(null)
              }}
              placeholder="https://example.com/article"
              className="w-full pl-9 pr-4 py-3 bg-[#3A3A3C] text-white placeholder-[#98989D] rounded-lg border-none focus:ring-2 focus:ring-[#0A84FF] focus:outline-none transition-all duration-200"
            />
          </div>

          {/* Validation error */}
          {validationError && <p className="mt-1.5 text-xs text-[#FF6B6B]">{validationError}</p>}
        </div>

        {/* Info text — explains what happens after submit */}
        <p className="text-xs text-[#48484A] mb-4">
          We'll fetch the title, description, and image from the URL automatically, then use AI to
          suggest a label for it.
        </p>

        {/* Submit button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={processing}
          className="w-full bg-[#0A84FF] text-white px-4 py-3 rounded-lg hover:bg-[#0A74FF] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <Loader2Icon size={16} className="animate-spin" />
              Saving & analysing...
            </>
          ) : (
            'Save Bookmark'
          )}
        </motion.button>

        {/* Hint about what the loading state means */}
        {processing && (
          <p className="text-center text-xs text-[#98989D] mt-2">
            Fetching page info and generating AI label — this takes a few seconds
          </p>
        )}
      </form>
    </motion.div>
  )
}
