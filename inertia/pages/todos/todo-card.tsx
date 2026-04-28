import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { CheckCircle2, Circle, PencilIcon, Trash2, AlertCircle, Clock, Tag } from 'lucide-react'
import { getLabelColor } from '../../lib/label-colors'
import type { Todo } from '../../lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface TodoCardProps {
  todo: Todo
  viewType: 'grid' | 'list'
  onEdit: (todo: Todo) => void
  onDelete: (id: number) => void
  onToggleComplete: (todo: Todo) => void
}

// ── Priority — left border accent + icon + colored text ──────────────────────
const PRIORITY_CONFIG = {
  high: {
    label: 'High',
    border: 'border-l-[#FF6B6B]',
    text: 'text-[#FF6B6B]',
    bg: 'bg-[#FF6B6B]/10',
  },
  medium: {
    label: 'Medium',
    border: 'border-l-[#FFD60A]',
    text: 'text-[#FFD60A]',
    bg: 'bg-[#FFD60A]/10',
  },
  low: {
    label: 'Low',
    border: 'border-l-[#30D158]',
    text: 'text-[#30D158]',
    bg: 'bg-[#30D158]/10',
  },
} as const

// ── Status — distinct shape: rounded-md instead of rounded-full ───────────────
const STATUS_CONFIG = {
  pending: { label: 'Pending', bg: 'bg-[#3A3A3C]', text: 'text-[#98989D]' },
  in_progress: { label: 'In Progress', bg: 'bg-[#0A84FF]/15', text: 'text-[#0A84FF]' },
  completed: { label: 'Completed', bg: 'bg-[#30D158]/15', text: 'text-[#30D158]' },
} as const

function getTimestamp(todo: Todo): string {
  const created = new Date(todo.createdAt).getTime()
  const updated = todo.updatedAt ? new Date(todo.updatedAt).getTime() : null
  const wasEdited = updated !== null && updated - created > 5000
  if (wasEdited) return `Updated ${formatDistanceToNow(updated!, { addSuffix: true })}`
  return `Created ${formatDistanceToNow(created, { addSuffix: true })}`
}

export default function TodoCard({
  todo,
  viewType,
  onEdit,
  onDelete,
  onToggleComplete,
}: TodoCardProps) {
  const timestamp = getTimestamp(todo)
  const priority =
    PRIORITY_CONFIG[todo.priority as keyof typeof PRIORITY_CONFIG] ?? PRIORITY_CONFIG.medium
  const status = STATUS_CONFIG[todo.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={viewType === 'grid' ? 'h-full' : 'w-full'}
    >
      {/* Left border accent color reflects priority — immediately visible */}
      <Card
        className={`bg-[#2C2C2E]/80 border-[#3A3A3C] border-l-4 ${priority.border} text-white overflow-hidden`}
      >
        <CardContent className={`p-5 ${viewType === 'list' ? 'flex items-start gap-4' : ''}`}>
          <div className={viewType === 'list' ? 'flex-1' : ''}>
            {/* ── Title row ── */}
            <div className="flex justify-between items-start mb-3">
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
                  className={`text-base font-medium leading-snug ${
                    todo.isCompleted ? 'text-[#98989D] line-through' : 'text-white'
                  }`}
                >
                  {todo.title}
                </h2>
              </div>

              <div className="flex items-center gap-1 ml-2 shrink-0">
                <span className="text-xs text-[#98989D] mr-1 hidden sm:inline">{timestamp}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(todo)}
                  className="h-7 w-7 bg-[#3A3A3C] text-[#0A84FF] hover:text-[#3B9BFF] hover:bg-[#3A3A3C]"
                >
                  <PencilIcon size={13} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(todo.id)}
                  className="h-7 w-7 bg-[#3A3A3C] text-[#FF6B6B] hover:text-[#FF8787] hover:bg-[#3A3A3C]"
                >
                  <Trash2 size={13} />
                </Button>
              </div>
            </div>

            {/* ── Priority + Status row — visually distinct from labels ── */}
            <div className="flex flex-wrap items-center gap-2 mb-3 ml-8">
              {/* Priority — icon + colored text, pill shape */}
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${priority.bg} ${priority.text}`}
              >
                <AlertCircle size={11} />
                {priority.label}
              </span>

              {/* Divider dot */}
              <span className="text-[#3A3A3C] text-xs">·</span>

              {/* Status — square-ish rounded-md to differ from round priority pill */}
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md ${status.bg} ${status.text}`}
              >
                <Clock size={11} />
                {status.label}
              </span>
            </div>

            {/* ── Labels — smaller, no icon, clearly different row ── */}
            {todo.labels.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2 ml-8">
                {todo.labels.map((label) => {
                  const { bg, text } = getLabelColor(label.name)
                  return (
                    <Badge
                      key={label.id}
                      variant="outline"
                      className={`text-[11px] h-5 border-none font-normal ${bg} ${text}`}
                    >
                      {label.name}
                    </Badge>
                  )
                })}
              </div>
            )}

            {/* Description */}
            {todo.description && (
              <p className="text-[#98989D] text-sm leading-relaxed ml-8 mt-1">{todo.description}</p>
            )}

            {/* Timestamp on mobile — shown below since header hides it */}
            <p className="text-xs text-[#48484A] ml-8 mt-2 sm:hidden">{timestamp}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
