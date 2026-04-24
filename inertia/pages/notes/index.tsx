import { Head, useForm, Link, router, usePage } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { PlusIcon, XIcon, ArrowLeft } from 'lucide-react'
import NoteCard from './note-card'
import NoteForm from './note-form'
import ViewSwitcher from './view-switcher'
import SortSelector from './sort-selector'
import { sortNotes, type SortOption, type Note, type Label } from '../../lib/sort-notes'

type ViewType = 'grid' | 'list'

export default function Index() {
  const { notes, labels } = usePage<{ notes: Note[]; labels: Label[] }>().props

  const [isFormVisible, setIsFormVisible] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [viewType, setViewType] = useState<ViewType>('grid')
  const [sortBy, setSortBy] = useState<SortOption>('pinned')

  const { data, setData, post, put, processing, reset } = useForm({
    title: '',
    content: '',
    pinned: false,
    labelIds: [] as number[],
    imageUrl: null as string | null,
    removeImage: false,
  })

  const sortedNotes = sortNotes(notes, sortBy)
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

  const handleDelete = (id: number) => {
    router.delete(`/notes/${id}`)
  }

  const handleTogglePin = (note: Note) => {
    router.put(`/notes/${note.id}`, {
      title: note.title,
      content: note.content,
      pinned: !note.pinned,
      labelIds: note.labels.map((l) => l.id),
      imageUrl: null,
      removeImage: false,
    })
  }

  const handleToggleForm = () => {
    setIsFormVisible(!isFormVisible)
    if (isFormVisible) {
      reset()
      setEditingNote(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      submit(e as any)
    }
  }

  return (
    <>
      <Head title="Notes" />
      <div className="min-h-screen bg-[#1C1C1E] text-white">
        <div className="max-w-4xl mx-auto p-6">
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

          {!sortedNotes.length ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-dashed border-[#3A3A3C] bg-[#232325] px-6 py-12 text-center"
            >
              <h2 className="text-xl font-semibold">No notes yet</h2>
              <p className="mt-2 text-sm text-[#98989D]">
                Hit the + button to add your first note.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-6">
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
        </div>
      </div>
    </>
  )
}
