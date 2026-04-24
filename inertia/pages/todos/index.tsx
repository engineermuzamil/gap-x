import { Head, useForm, Link, router, usePage } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { PlusIcon, XIcon, ArrowLeft } from 'lucide-react'
import TodoCard from './todo-card'
import TodoForm from './todo-form'
import ViewSwitcher from '../notes/view-switcher'
import type { Label } from '../../lib/sort-notes'

interface Todo {
  id: number
  title: string
  description: string | null
  isCompleted: boolean
  labels: Label[]
  createdAt: string
  updatedAt: string | null
}

type ViewType = 'grid' | 'list'

export default function Index() {
  // labels comes from the controller alongside todos
  const { todos, labels } = usePage<{ todos: Todo[]; labels: Label[] }>().props

  const [isFormVisible, setIsFormVisible] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [viewType, setViewType] = useState<ViewType>('grid')

  const { data, setData, post, put, processing, reset } = useForm({
    title: '',
    description: '',
    isCompleted: false,
    labelIds: [] as number[], // tracks which labels are selected
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingTodo) {
      put(`/todos/${editingTodo.id}`, {
        onSuccess: () => {
          reset()
          setEditingTodo(null)
          setIsFormVisible(false)
        },
      })
    } else {
      post('/todos', {
        onSuccess: () => {
          reset()
          setIsFormVisible(false)
        },
      })
    }
  }

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo)
    setData({
      title: todo.title,
      description: todo.description ?? '',
      isCompleted: todo.isCompleted,
      // Pre-fill the picker with the todo's current label IDs
      labelIds: todo.labels.map((l) => l.id),
    })
    setIsFormVisible(true)
  }

  const handleDelete = (id: number) => {
    router.delete(`/todos/${id}`)
  }

  const handleToggleComplete = (todo: Todo) => {
    router.put(`/todos/${todo.id}`, {
      title: todo.title,
      description: todo.description,
      isCompleted: !todo.isCompleted,
      // Keep existing labels unchanged during a complete toggle
      labelIds: todo.labels.map((l) => l.id),
    })
  }

  const handleToggleForm = () => {
    setIsFormVisible(!isFormVisible)
    if (isFormVisible) {
      reset()
      setEditingTodo(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      submit(e as any)
    }
  }

  return (
    <>
      <Head title="Todos" />
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
              <h1 className="text-3xl font-bold">Todos</h1>
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
                className="overflow-hidden mb-6"
              >
                <TodoForm
                  data={data}
                  setData={setData}
                  submit={submit}
                  processing={processing}
                  handleKeyDown={handleKeyDown}
                  isEditing={!!editingTodo}
                  allLabels={labels}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {!todos.length ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-dashed border-[#3A3A3C] bg-[#232325] px-6 py-12 text-center"
            >
              <h2 className="text-xl font-semibold">No todos yet</h2>
              <p className="mt-2 text-sm text-[#98989D]">
                Hit the + button to add your first todo.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={
                viewType === 'grid' ? 'columns-1 md:columns-2 gap-3' : 'flex flex-col gap-3'
              }
            >
              <AnimatePresence>
                {todos.map((todo, index) => (
                  <motion.div
                    key={todo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={viewType === 'grid' ? 'break-inside-avoid mb-3' : 'w-full'}
                  >
                    <TodoCard
                      todo={todo}
                      viewType={viewType}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onToggleComplete={handleToggleComplete}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}
