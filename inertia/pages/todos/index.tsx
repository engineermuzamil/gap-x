import { Head, useForm, Link, router } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { PlusIcon, XIcon, ArrowLeft, LogOut } from 'lucide-react'
import TodoCard from './todo-card'
import TodoForm from './todo-form'
import ViewSwitcher from '../notes/view-switcher'
import type { Todo } from '../../lib/types'
import { logoutFromTodos } from '../../lib/todo-auth'
import { Button } from '@/components/ui/button'
import { useTodos } from '../../lib/use-todos'

import { useTodoStore } from '../../lib/todo-store'
import { validateTodo } from '../../lib/todo-schema'

export default function Index() {
  const {
    todos,
    labels,
    user,
    loading,
    error,
    submitting,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
  } = useTodos()

  const { viewType, isFormVisible, editingTodo, setViewType, openEditForm, closeForm, toggleForm } =
    useTodoStore()

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const { data, setData, reset } = useForm({
    title: '',
    description: '',
    labelIds: [] as number[],
    priority: 'medium',
    status: 'pending',
  })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { success, errors } = validateTodo(data)

    if (!success) {
      setValidationErrors(errors)
      return
    }

    setValidationErrors({})

    if (editingTodo) {
      await updateTodo.mutateAsync({ id: editingTodo.id, input: data })
    } else {
      await createTodo.mutateAsync(data)
    }

    reset()
    closeForm()
  }

  const handleEdit = (todo: Todo) => {
    setData({
      title: todo.title,
      description: todo.description ?? '',
      labelIds: todo.labels.map((l) => l.id),
      priority: todo.priority ?? 'medium',
      status: todo.status ?? 'pending',
    })
    setValidationErrors({})
    openEditForm(todo)
  }

  const handleDelete = (id: number) => deleteTodo.mutate(id)

  const handleToggleForm = () => {
    if (isFormVisible) {
      reset()
      setValidationErrors({})
    }
    toggleForm()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') submit(e as any)
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
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    title="Log out"
                    className="rounded-full text-[#98989D] hover:bg-[#3A3A3C] hover:text-white h-8 w-8"
                  >
                    <LogOut size={16} />
                  </Button>
                </div>
              )}
              <ViewSwitcher currentView={viewType} onChange={setViewType} />
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleToggleForm}
                  className="bg-[#0A84FF] hover:bg-[#0A74FF] text-white p-3 rounded-full shadow-lg h-auto w-auto"
                >
                  {isFormVisible ? <XIcon size={20} /> : <PlusIcon size={20} />}
                </Button>
              </motion.div>
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
                  validationErrors={validationErrors}
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
                      onToggleComplete={toggleComplete}
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
