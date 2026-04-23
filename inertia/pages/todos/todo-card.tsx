import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { CheckCircle2, Circle, PencilIcon, Trash2 } from 'lucide-react'

interface Todo {
  id: number
  title: string
  description: string | null
  isCompleted: boolean
  createdAt: string
  updatedAt: string
}

interface TodoCardProps {
  todo: Todo
  viewType: 'grid' | 'list'
  onEdit: (todo: Todo) => void
  onDelete: (id: number) => void
  onToggleComplete: (todo: Todo) => void
}

export default function TodoCard({
  todo,
  viewType,
  onEdit,
  onDelete,
  onToggleComplete,
}: TodoCardProps) {
  const timeAgo = formatDistanceToNow(new Date(todo.createdAt), { addSuffix: true })

  return (
    <motion.div
      className={`relative overflow-hidden backdrop-blur-sm bg-[#2C2C2E]/80 border border-[#3A3A3C] ${
        viewType === 'grid' ? 'rounded-xl break-inside-avoid mb-4' : 'rounded-lg'
      }`}
      style={{ boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)' }}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`p-5 ${viewType === 'list' ? 'flex items-start gap-4' : ''}`}>
        <div className={viewType === 'list' ? 'flex-1' : ''}>
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-start gap-3 flex-1">
              <button
                type="button"
                onClick={() => onToggleComplete(todo)}
                className="mt-0.5 shrink-0"
              >
                {todo.isCompleted ? (
                  <CheckCircle2 size={20} className="text-[#30D158]" />
                ) : (
                  <Circle size={20} className="text-[#8E8E93]" />
                )}
              </button>
              <h2
                className={`text-lg font-medium ${todo.isCompleted ? 'text-[#98989D] line-through' : 'text-white'}`}
              >
                {todo.title}
              </h2>
            </div>

            <div className="flex items-center gap-1 ml-2 shrink-0">
              <span className="text-xs text-[#98989D] mr-1">{timeAgo}</span>
              <button
                type="button"
                onClick={() => onEdit(todo)}
                className="h-7 w-7 rounded-lg bg-[#3A3A3C] flex items-center justify-center text-[#0A84FF] hover:text-[#3B9BFF] transition-colors"
              >
                <PencilIcon size={13} />
              </button>
              <button
                type="button"
                onClick={() => onDelete(todo.id)}
                className="h-7 w-7 rounded-lg bg-[#3A3A3C] flex items-center justify-center text-[#FF6B6B] hover:text-[#FF8787] transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {todo.description && (
            <p className="text-[#98989D] text-sm leading-relaxed ml-8">{todo.description}</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
