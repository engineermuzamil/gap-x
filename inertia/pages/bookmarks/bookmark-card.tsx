// inertia/pages/bookmarks/bookmark-card.tsx

import { useState } from 'react'
import { router } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import {
  Trash2,
  ExternalLink,
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp,
  Globe,
} from 'lucide-react'
import { getLabelColor } from '../../lib/label-colors'
import type { Bookmark } from '../../lib/types'

interface BookmarkCardProps {
  bookmark: Bookmark
  viewType: 'grid' | 'list'
}

export default function BookmarkCard({ bookmark, viewType }: BookmarkCardProps) {
  const [tldr, setTldr] = useState<string | null>(bookmark.tldr)
  const [tldrLoading, setTldrLoading] = useState(false)
  const [tldrError, setTldrError] = useState<string | null>(null)
  const [tldrOpen, setTldrOpen] = useState(false)

  const timestamp = formatDistanceToNow(new Date(bookmark.createdAt), { addSuffix: true })

  const displaySite =
    bookmark.siteName ??
    (() => {
      try {
        return new URL(bookmark.url).hostname.replace('www.', '')
      } catch {
        return bookmark.url
      }
    })()

  const labelColors = bookmark.aiLabel ? getLabelColor(bookmark.aiLabel) : null

  const handleDelete = () => {
    router.delete(`/bookmarks/${bookmark.id}`, { preserveScroll: true })
  }

  const handleTldr = async () => {
    // Already have it — just toggle open/closed
    if (tldr) {
      setTldrOpen((prev) => !prev)
      return
    }

    setTldrLoading(true)
    setTldrError(null)

    // ── DEBUG ────────────────────────────────────────────────────────────────
    console.log('[TL;DR] all cookies:', document.cookie)

    const xsrfToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1]

    console.log('[TL;DR] xsrfToken raw    :', xsrfToken ?? 'NOT FOUND')
    console.log('[TL;DR] xsrfToken decoded:', xsrfToken ? decodeURIComponent(xsrfToken) : 'none')
    console.log('[TL;DR] POST url         :', `/bookmarks/${bookmark.id}/tldr`)
    // ── END DEBUG ────────────────────────────────────────────────────────────

    try {
      const response = await fetch(`/bookmarks/${bookmark.id}/tldr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
        },
      })

      // ── DEBUG ──────────────────────────────────────────────────────────────
      console.log('[TL;DR] response.status :', response.status)
      console.log('[TL;DR] response.ok     :', response.ok)
      console.log('[TL;DR] response headers:', Object.fromEntries(response.headers.entries()))
      // ── END DEBUG ──────────────────────────────────────────────────────────

      // Always read as text first so we can log it even on errors
      const rawText = await response.text()
      console.log('[TL;DR] raw body        :', rawText)

      if (!response.ok) {
        setTldrError(`Error ${response.status} — could not generate summary. Try again.`)
        return
      }

      const data = JSON.parse(rawText) as { tldr: string }
      console.log('[TL;DR] parsed          :', data)

      setTldr(data.tldr)
      setTldrOpen(true)
    } catch (err) {
      console.error('[TL;DR] exception:', err)
      setTldrError('Something went wrong. Please try again.')
    } finally {
      setTldrLoading(false)
    }
  }

  return (
    <motion.div
      className="relative overflow-hidden bg-[#2C2C2E]/80 border border-[#3A3A3C] rounded-xl flex flex-col"
      style={{ boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)' }}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {/* OG Image */}
      {bookmark.imageUrl && (
        <div className="relative w-full overflow-hidden">
          <img
            src={bookmark.imageUrl}
            alt={bookmark.title ?? 'Bookmark preview'}
            className={`w-full object-cover ${viewType === 'list' ? 'max-h-32' : 'max-h-48'}`}
            loading="lazy"
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.display = 'none'
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#2C2C2E]/60 to-transparent" />
        </div>
      )}

      {/* Card Body */}
      <div className="p-4 flex-1">
        <div className="flex items-center gap-1.5 mb-2">
          <Globe size={11} className="text-[#48484A] shrink-0" />
          <span className="text-xs text-[#48484A] truncate">{displaySite}</span>
        </div>

        <h2 className="text-base font-medium text-white mb-1 line-clamp-2">
          {bookmark.title ?? bookmark.url}
        </h2>

        {bookmark.description && (
          <p className="text-sm text-[#98989D] line-clamp-3 mb-3">{bookmark.description}</p>
        )}

        {bookmark.aiLabel && labelColors && (
          <div className="flex items-center gap-1.5 mb-3">
            <Sparkles size={11} className="text-[#BF5AF2]" />
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${labelColors.bg} ${labelColors.text}`}
            >
              {bookmark.aiLabel}
            </span>
            <span className="text-[10px] text-[#48484A]">AI label</span>
          </div>
        )}

        {/* TL;DR */}
        <div className="mt-2">
          <button
            type="button"
            onClick={handleTldr}
            disabled={tldrLoading}
            className="flex items-center gap-1.5 text-xs text-[#0A84FF] hover:text-[#3B9BFF] transition-colors disabled:opacity-50"
          >
            {tldrLoading ? (
              <>
                <Loader2 size={12} className="animate-spin" /> Generating summary...
              </>
            ) : (
              <>
                <Sparkles size={12} />
                TL;DR
                {tldr && (tldrOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
              </>
            )}
          </button>

          <AnimatePresence>
            {tldrOpen && tldr && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="mt-2 text-xs text-[#D1D1D6] bg-[#1C1C1E] rounded-lg p-3 border border-[#3A3A3C] leading-relaxed">
                  {tldr}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {tldrError && <p className="mt-1 text-xs text-[#FF6B6B]">{tldrError}</p>}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-[#3A3A3C] flex items-center justify-between gap-2">
        <span className="text-[11px] text-[#98989D] truncate">{timestamp}</span>
        <div className="flex items-center gap-1 shrink-0">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open bookmark"
            className="h-7 w-7 rounded-lg bg-[#3A3A3C] flex items-center justify-center text-[#0A84FF] hover:text-[#3B9BFF] transition-colors"
          >
            <ExternalLink size={13} />
          </a>
          <button
            type="button"
            onClick={handleDelete}
            title="Remove bookmark"
            className="h-7 w-7 rounded-lg bg-[#3A3A3C] flex items-center justify-center text-[#FF6B6B] hover:text-[#FF8787] transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
