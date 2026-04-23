import { Head, useForm, Link, router } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { PlusIcon, XIcon, ArrowLeft } from 'lucide-react'
import NoteCard from './note-card'
import NoteForm from './note-form'
import ViewSwitcher from './view-switcher'

interface Note {
  id: number
  title: string
  content: string
  pinned: boolean
  createdAt: string
  updatedAt: string | null
}

type ViewType = 'grid' | 'list'

export default function Index({ notes }: { notes: Note[] }) {
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [viewType, setViewType] = useState<ViewType>('grid')

  const { data, setData, post, put, processing, reset } = useForm({
    title: '',
    content: '',
    pinned: false,
  })

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
    setData({ title: note.title, content: note.content, pinned: note.pinned })
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
                className="overflow-hidden mb-8"
              >
                <NoteForm
                  data={data}
                  setData={setData}
                  submit={submit}
                  processing={processing}
                  handleKeyDown={handleKeyDown}
                  isEditing={!!editingNote}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={viewType === 'grid' ? 'columns-1 md:columns-2 gap-4' : 'flex flex-col gap-3'}
          >
            <AnimatePresence>
              {notes.length ? (
                notes.map((note, index) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={viewType === 'list' ? 'w-full' : ''}
                  >
                    <NoteCard
                      note={note}
                      viewType={viewType}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onTogglePin={handleTogglePin}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-2 rounded-2xl border border-dashed border-[#3A3A3C] bg-[#232325] px-6 py-12 text-center"
                >
                  <h2 className="text-xl font-semibold">No notes yet</h2>
                  <p className="mt-2 text-sm text-[#98989D]">
                    Hit the + button to add your first note.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </>
  )
}
