import { Head, usePage } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ArrowLeft, PlusIcon, XIcon, LayoutGridIcon, ListIcon, Search, X } from 'lucide-react'
import BookmarkForm from './bookmark-form'
import BookmarkCard from './bookmark-card'
import type { Bookmark } from '../../lib/types'

export default function BookmarksIndex() {
  const { bookmarks, user } = usePage<{
    bookmarks: Bookmark[]
    user?: { fullName: string | null; email: string; initials: string }
  }>().props

  // Local UI state — bookmarks page is simpler than notes, no need for Zustand
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')

  // Client-side search — filter by title, description, site name, or label
  const filtered =
    searchQuery.trim() === ''
      ? bookmarks
      : bookmarks.filter((b) => {
          const q = searchQuery.toLowerCase()
          return (
            b.title?.toLowerCase().includes(q) ||
            b.description?.toLowerCase().includes(q) ||
            b.siteName?.toLowerCase().includes(q) ||
            b.aiLabel?.toLowerCase().includes(q) ||
            b.url.toLowerCase().includes(q)
          )
        })

  return (
    <>
      <Head title="Bookmarks" />
      <div className="min-h-screen bg-[#1C1C1E] text-white">
        <div className="max-w-4xl mx-auto p-6">
          {/* ── Header ─────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <div className="flex items-center gap-3">
              {/* Back to Notes */}
              <Link
                href="/notes"
                className="p-2 hover:bg-[#2C2C2E] rounded-full transition-colors duration-200"
              >
                <ArrowLeft size={24} />
              </Link>
              <h1 className="text-3xl font-bold">Bookmarks</h1>
            </div>

            <div className="flex items-center gap-3">
              {/* User badge — same as notes header */}
              {user && (
                <div className="flex items-center gap-3 rounded-full border border-[#3A3A3C] bg-[#2C2C2E] px-3 py-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0A84FF]/15 text-sm font-semibold text-[#7DB7FF]">
                    {user.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{user.fullName || 'Notes User'}</p>
                    <p className="truncate text-xs text-[#98989D]">{user.email}</p>
                  </div>
                </div>
              )}

              {/* Grid / List switcher */}
              <div className="bg-[#2C2C2E] rounded-lg p-1 flex gap-1">
                <button
                  type="button"
                  onClick={() => setViewType('grid')}
                  className={`p-2 rounded transition-colors ${viewType === 'grid' ? 'bg-[#3A3A3C] text-white' : 'text-[#98989D] hover:text-white'}`}
                >
                  <LayoutGridIcon size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewType('list')}
                  className={`p-2 rounded transition-colors ${viewType === 'list' ? 'bg-[#3A3A3C] text-white' : 'text-[#98989D] hover:text-white'}`}
                >
                  <ListIcon size={18} />
                </button>
              </div>

              {/* Add / Close button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFormVisible((v) => !v)}
                className="bg-[#0A84FF] text-white p-3 rounded-full shadow-lg hover:bg-[#0A74FF] transition-colors duration-200"
              >
                {isFormVisible ? <XIcon size={20} /> : <PlusIcon size={20} />}
              </motion.button>
            </div>
          </motion.div>

          {/* ── Add Bookmark Form ───────────────────────────────────────────── */}
          <AnimatePresence>
            {isFormVisible && (
              <motion.div
                initial={{ opacity: 0, y: 20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <BookmarkForm />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Search Bar ──────────────────────────────────────────────────── */}
          <div className="relative mb-6">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98989D] pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bookmarks by title, site, or label..."
              className="w-full pl-9 pr-9 py-2.5 bg-[#2C2C2E] text-white text-sm placeholder-[#98989D] rounded-xl border border-[#3A3A3C] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] transition-all duration-200"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98989D] hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* ── Count ───────────────────────────────────────────────────────── */}
          {bookmarks.length > 0 && (
            <p className="text-xs text-[#48484A] mb-4">
              {filtered.length === bookmarks.length
                ? `${bookmarks.length} bookmark${bookmarks.length !== 1 ? 's' : ''}`
                : `${filtered.length} of ${bookmarks.length} bookmarks`}
            </p>
          )}

          {/* ── Empty State ─────────────────────────────────────────────────── */}
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-dashed border-[#3A3A3C] bg-[#232325] px-6 py-12 text-center"
            >
              <h2 className="text-xl font-semibold">
                {bookmarks.length === 0 ? 'No bookmarks yet' : 'No bookmarks match'}
              </h2>
              <p className="mt-2 text-sm text-[#98989D]">
                {bookmarks.length === 0
                  ? 'Hit the + button to save your first bookmark.'
                  : 'Try a different search.'}
              </p>
            </motion.div>
          ) : (
            /* ── Bookmark Grid / List ─────────────────────────────────────── */
            <div
              className={
                viewType === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
                  : 'flex flex-col gap-3'
              }
            >
              <AnimatePresence>
                {filtered.map((bookmark, index) => (
                  <motion.div
                    key={bookmark.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: index * 0.04 } }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <BookmarkCard bookmark={bookmark} viewType={viewType} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
