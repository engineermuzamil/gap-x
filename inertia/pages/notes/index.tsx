import { Head, useForm, router, usePage } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { PlusIcon, XIcon, ArrowLeft, LogOut } from 'lucide-react'
import NoteCard from './note-card'
import NoteForm from './note-form'
import ViewSwitcher from './view-switcher'
import SortSelector from './sort-selector'
import TrashSection from './trash-section'
import LabelFilter from './label-filter'
import { sortNotes } from '../../lib/sort-notes'
// ── Zustand store — replaces local useState for persistent UI state ────────
import { useNotesStore } from '../../lib/notes-store'
import type { SortOption, Note, Label } from '../../lib/types'

type ViewType = 'grid' | 'list'

export default function Index() {
  const { notes, trashedNotes, labels, user } = usePage<{
    notes: Note[]
    trashedNotes: Note[]
    labels: Label[]
    user?: { fullName: string | null; email: string; initials: string }
  }>().props

  // ── Zustand replaces useState for viewType, sortBy, isFormVisible ─────────
  // These now persist across page navigations via localStorage
  const {
    viewType,
    setViewType,
    sortBy,
    setSortBy,
    isFormVisible,
    setIsFormVisible,
    activeLabels,
  } = useNotesStore()

  // editingNote stays local — only relevant during this render session
  const [editingNote, setEditingNote] = useState<Note | null>(null)

  const { data, setData, post, put, processing, reset } = useForm({
    title: '',
    content: '',
    pinned: false,
    labelIds: [] as number[],
    imageUrl: null as string | null,
    removeImage: false,
  })

  // ── Filter notes by active labels (client-side, instant, no server call) ──
  // No filters active → show all notes
  // Filters active → show notes that have AT LEAST ONE of the selected labels
  const filteredNotes =
    activeLabels.length === 0
      ? notes
      : notes.filter((note) => note.labels.some((label) => activeLabels.includes(label.id)))

  const sortedNotes = sortNotes(filteredNotes, sortBy)
  const pinnedNotes = sortedNotes.filter((n) => n.pinned)
  const unpinnedNotes = sortedNotes.filter((n) => !n.pinned)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingNote) {
      put(`/notes/${editingNote.id}`, {
        onSuccess: () => {
          reset()
          setEditingNote(null)
          setIsFormVisible(false)
        },
      })
    } else {
      post('/notes', {
        onSuccess: () => {
          reset()
          setIsFormVisible(false)
        },
      })
    }
  }

  const handleEdit = (note: Note) => {
    setEditingNote(note)
    setData({
      title: note.title,
      content: note.content,
      pinned: note.pinned,
      labelIds: note.labels.map((l) => l.id),
      imageUrl: null,
      removeImage: false,
    })
    setIsFormVisible(true)
  }

  const handleDelete = (id: number) => router.delete(`/notes/${id}`)

  const handleTogglePin = (note: Note) => {
    router.put(`/notes/${note.id}`, {
      title: note.title,
      content: note.content,
      pinned: !note.pinned,
      labelIds: note.labels.map((l) => l.id),
      imageUrl: null,
      removeImage: false,
      pinToggle: true,
    })
  }

  const handleToggleForm = () => {
    // Closing → reset form and clear editing state
    if (isFormVisible) {
      reset()
      setEditingNote(null)
    }
    setIsFormVisible(!isFormVisible)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') submit(e as any)
  }

  const handleLogout = () => router.post('/logout')

  return (
    <>
      <Head title="Notes" />
      <div className="min-h-screen bg-[#1C1C1E] text-white">
        <div className="max-w-4xl mx-auto p-6">
          {/* ── Header ─────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-2 hover:bg-[#2C2C2E] rounded-full transition-colors duration-200"
              >
                <ArrowLeft size={24} />
              </Link>
              <h1 className="text-3xl font-bold">Notes</h1>
            </div>

            <div className="flex items-center gap-3">
              {user && (
                <div className="flex items-center gap-3 rounded-full border border-[#3A3A3C] bg-[#2C2C2E] px-3 py-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0A84FF]/15 text-sm font-semibold text-[#7DB7FF]">
                    {user.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{user.fullName || 'Notes User'}</p>
                    <p className="truncate text-xs text-[#98989D]">{user.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-full p-2 text-[#98989D] transition-colors hover:bg-[#3A3A3C] hover:text-white"
                    title="Log out"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              )}

              <SortSelector value={sortBy} onChange={setSortBy} />
              <ViewSwitcher currentView={viewType} onChange={setViewType} />

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleToggleForm}
                className="bg-[#0A84FF] text-white p-3 rounded-full shadow-lg hover:bg-[#0A74FF] transition-colors duration-200"
              >
                {isFormVisible ? <XIcon size={20} /> : <PlusIcon size={20} />}
              </motion.button>
            </div>
          </motion.div>

          {/* ── Note Form ──────────────────────────────────────────────────── */}
          <AnimatePresence>
            {isFormVisible && (
              <motion.div
                initial={{ opacity: 0, y: 20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mb-6"
              >
                <NoteForm
                  data={data}
                  setData={setData}
                  submit={submit}
                  processing={processing}
                  handleKeyDown={handleKeyDown}
                  isEditing={!!editingNote}
                  allLabels={labels}
                  existingImageUrl={editingNote?.imageUrl ?? null}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Label Filter chips — powered by Zustand ────────────────────── */}
          <LabelFilter labels={labels} />

          {/* ── Empty state ────────────────────────────────────────────────── */}
          {!sortedNotes.length ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-dashed border-[#3A3A3C] bg-[#232325] px-6 py-12 text-center"
            >
              <h2 className="text-xl font-semibold">
                {activeLabels.length > 0 ? 'No notes match this filter' : 'No notes yet'}
              </h2>
              <p className="mt-2 text-sm text-[#98989D]">
                {activeLabels.length > 0
                  ? 'Try selecting different labels or clear the filter.'
                  : 'Hit the + button to add your first note.'}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Pinned section */}
              {pinnedNotes.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#98989D]">
                      Pinned
                    </h2>
                    <div className="h-px flex-1 bg-[#0A84FF]/30" />
                  </div>
                  <div
                    className={
                      viewType === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 gap-3'
                        : 'flex flex-col gap-3'
                    }
                  >
                    <AnimatePresence>
                      {pinnedNotes.map((note, index) => (
                        <motion.div
                          key={note.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }}
                          exit={{ opacity: 0, scale: 0.9 }}
                        >
                          <NoteCard
                            note={note}
                            viewType={viewType}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onTogglePin={handleTogglePin}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </section>
              )}

              {/* Unpinned section */}
              {unpinnedNotes.length > 0 && (
                <div
                  className={
                    viewType === 'grid' ? 'columns-1 md:columns-2 gap-3' : 'flex flex-col gap-3'
                  }
                >
                  <AnimatePresence>
                    {unpinnedNotes.map((note, index) => (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={viewType === 'grid' ? 'break-inside-avoid mb-3' : 'w-full'}
                      >
                        <NoteCard
                          note={note}
                          viewType={viewType}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onTogglePin={handleTogglePin}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}

          {/* Trash — always at the bottom, collapsed by default */}
          <TrashSection trashedNotes={trashedNotes} />
        </div>
      </div>
    </>
  )
}
