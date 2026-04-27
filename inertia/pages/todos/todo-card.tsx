import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { CheckCircle2, Circle, PencilIcon, Trash2 } from 'lucide-react'
import { getLabelColor } from '../../lib/label-colors'
import type { Todo } from '../../lib/types'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'

interface TodoCardProps {
  todo: Todo
  viewType: 'grid' | 'list'
  onEdit: (todo: Todo) => void
  onDelete: (id: number) => void
  onToggleComplete: (todo: Todo) => void
}

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

  return (
    // ShadCN Card replaces raw motion.div — we keep motion for animations
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={viewType === 'grid' ? 'h-full' : 'w-full'}
    >
      <Card className="bg-[#2C2C2E]/80 border-[#3A3A3C] text-white overflow-hidden">
        <CardContent className={`p-5 ${viewType === 'list' ? 'flex items-start gap-4' : ''}`}>
          <div className={viewType === 'list' ? 'flex-1' : ''}>
            {/* Title row + action buttons */}
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-start gap-3 flex-1">
                {/* Toggle complete button — kept as plain button for icon-only use */}
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
                  className={`text-lg font-medium ${
                    todo.isCompleted ? 'text-[#98989D] line-through' : 'text-white'
                  }`}
                >
                  {todo.title}
                </h2>
              </div>

              <div className="flex items-center gap-1 ml-2 shrink-0">
                <span className="text-xs text-[#98989D] mr-1">{timestamp}</span>

                {/* ShadCN Button variant="ghost" for icon action buttons */}
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

            {/* ShadCN Badge replaces raw span for labels */}
            {todo.labels.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2 ml-8">
                {todo.labels.map((label) => {
                  const { bg, text } = getLabelColor(label.name)
                  return (
                    <Badge
                      key={label.id}
                      variant="outline"
                      className={`text-xs border-none ${bg} ${text}`}
                    >
                      {label.name}
                    </Badge>
                  )
                })}
              </div>
            )}

            {todo.description && (
              <p className="text-[#98989D] text-sm leading-relaxed ml-8">{todo.description}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
