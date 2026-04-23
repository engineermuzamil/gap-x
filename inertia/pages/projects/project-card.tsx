import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { PencilIcon, Trash2 } from 'lucide-react'

interface Project {
  id: number
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed'
  createdAt: string
  updatedAt: string
}

interface ProjectCardProps {
  project: Project
  viewType: 'grid' | 'list'
  onEdit: (project: Project) => void
  onDelete: (id: number) => void
}

const statusStyles = {
  'pending': 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
  'in-progress': 'bg-blue-500/15 text-blue-300 border border-blue-500/30',
  'completed': 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
}

const statusLabels = {
  'pending': 'Pending',
  'in-progress': 'In Progress',
  'completed': 'Completed',
}

export default function ProjectCard({ project, viewType, onEdit, onDelete }: ProjectCardProps) {
  const timeAgo = formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })

  return (
    <motion.div
      className={`relative overflow-hidden backdrop-blur-sm bg-[#2C2C2E]/80 border border-[#3A3A3C] ${
        viewType === 'grid' ? 'h-full rounded-xl' : 'rounded-lg'
      }`}
      style={{ boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)' }}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`p-5 ${viewType === 'list' ? 'flex items-start gap-4' : ''}`}>
        <div className={viewType === 'list' ? 'flex-1' : ''}>
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h2 className="text-lg font-medium text-white">{project.title}</h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[project.status]}`}
                >
                  {statusLabels[project.status]}
                </span>
              </div>
              <span className="text-xs text-[#98989D]">{timeAgo}</span>
            </div>

            <div className="flex items-center gap-1 ml-2 shrink-0">
              <button
                type="button"
                onClick={() => onEdit(project)}
                className="h-7 w-7 rounded-lg bg-[#3A3A3C] flex items-center justify-center text-[#0A84FF] hover:text-[#3B9BFF] transition-colors"
              >
                <PencilIcon size={13} />
              </button>
              <button
                type="button"
                onClick={() => onDelete(project.id)}
                className="h-7 w-7 rounded-lg bg-[#3A3A3C] flex items-center justify-center text-[#FF6B6B] hover:text-[#FF8787] transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          <p className="text-[#98989D] text-sm leading-relaxed">{project.description}</p>
        </div>
      </div>
    </motion.div>
  )
}
