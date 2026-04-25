import { Head, useForm, Link, router } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { PlusIcon, XIcon, ArrowLeft, LogOut } from 'lucide-react'
import axios from 'axios'
import TodoCard from './todo-card'
import TodoForm from './todo-form'
import ViewSwitcher from '../notes/view-switcher'
import type { Todo, Label } from '../../lib/types'
import { authHeaders, getToken, logoutFromTodos } from '../../lib/todo-auth'

type ViewType = 'grid' | 'list'
type TodoUser = {
  fullName: string | null
  email: string
  initials: string
}

export default function Index() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [labels, setLabels] = useState<Label[]>([])
  const [user, setUser] = useState<TodoUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [viewType, setViewType] = useState<ViewType>('grid')

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.visit('/todo-auth/login')
      return
    }

    void fetchTodos()
  }, [])

  const fetchTodos = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/todos/data', { headers: authHeaders() })
      setTodos(response.data.todos)
      setLabels(response.data.labels)
      setUser(response.data.user)
      setError(null)
    } catch (err: any) {
      if (err.response?.status === 401) {
        await logoutFromTodos()
        router.visit('/todo-auth/login')
        return
      }

      setError('Failed to load todos.')
    } finally {
      setLoading(false)
    }
  }

  const { data, setData, reset } = useForm({
    title: '',
    description: '',
    isCompleted: false,
    labelIds: [] as number[],
  })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      if (editingTodo) {
        const response = await axios.put(`/todos/${editingTodo.id}`, data, {
          headers: authHeaders(),
        })

        setTodos((current) =>
          current.map((todo) => (todo.id === editingTodo.id ? response.data : todo))
        )
      } else {
        const response = await axios.post('/todos', data, {
          headers: authHeaders(),
        })

        setTodos((current) => [response.data, ...current])
      }

      reset()
      setEditingTodo(null)
      setIsFormVisible(false)
    } catch (err: any) {
      if (err.response?.status === 401) {
        await logoutFromTodos()
        router.visit('/todo-auth/login')
        return
      }

      setError(editingTodo ? 'Failed to update todo.' : 'Failed to create todo.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo)
    setData({
      title: todo.title,
      description: todo.description ?? '',
      isCompleted: todo.isCompleted,
      labelIds: todo.labels.map((l) => l.id),
    })
    setIsFormVisible(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/todos/${id}`, { headers: authHeaders() })
      setTodos((current) => current.filter((todo) => todo.id !== id))
    } catch (err: any) {
      if (err.response?.status === 401) {
        await logoutFromTodos()
        router.visit('/todo-auth/login')
        return
      }

      setError('Failed to delete todo.')
    }
  }

  const handleToggleComplete = async (todo: Todo) => {
    try {
      const response = await axios.put(
        `/todos/${todo.id}`,
        {
          title: todo.title,
          description: todo.description,
          isCompleted: !todo.isCompleted,
          labelIds: todo.labels.map((l) => l.id),
        },
        { headers: authHeaders() }
      )

      setTodos((current) => current.map((item) => (item.id === todo.id ? response.data : item)))
    } catch (err: any) {
      if (err.response?.status === 401) {
        await logoutFromTodos()
        router.visit('/todo-auth/login')
        return
      }

      setError('Failed to update todo.')
    }
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

  const handleLogout = async () => {
    await logoutFromTodos()
    router.visit('/todo-auth/login')
  }

  return (
    <>
      <Head title="Todos" />
      <div className="min-h-screen bg-[#1C1C1E] text-white">
        <div className="max-w-4xl mx-auto p-6">
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 text-sm text-[#FF6B6B]">
              {error}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
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

            <div className="flex flex-wrap items-center gap-3 md:justify-end">
              {user && (
                <div className="flex items-center gap-3 rounded-full border border-[#3A3A3C] bg-[#2C2C2E] px-3 py-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0A84FF]/15 text-sm font-semibold text-[#7DB7FF]">
                    {user.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{user.fullName || 'Todos User'}</p>
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
                  processing={submitting}
                  handleKeyDown={handleKeyDown}
                  isEditing={!!editingTodo}
                  allLabels={labels}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
            <div className="text-center text-[#98989D] py-12">Loading...</div>
          ) : !todos.length ? (
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
