import { X } from 'lucide-react'
import { useNotesStore } from '../../lib/notes-store'
import { getLabelColor } from '../../lib/label-colors'
import type { Label } from '../../lib/types'

interface LabelFilterProps {
  labels: Label[]
}

export default function LabelFilter({ labels }: LabelFilterProps) {
  const { activeLabels, toggleLabel, clearLabels } = useNotesStore()

  if (!labels.length) return null

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-xs text-[#98989D] uppercase tracking-widest shrink-0">Filter</span>

      {labels.map((label) => {
        const isActive = activeLabels.includes(label.id)
        const { bg, text } = getLabelColor(label.name)
        return (
          <button
            key={label.id}
            type="button"
            onClick={() => toggleLabel(label.id)}
            className={`
              text-xs px-2.5 py-0.5 rounded-full transition-all duration-200 cursor-pointer
              ${bg} ${text}
              ${isActive ? 'opacity-100 ring-2 ring-white/20 scale-105' : 'opacity-40 hover:opacity-70'}
            `}
          >
            {label.name}
          </button>
        )
      })}

      {activeLabels.length > 0 && (
        <button
          type="button"
          onClick={clearLabels}
          className="flex items-center gap-1 text-xs text-[#98989D] hover:text-white transition-colors px-2 py-0.5 rounded-full border border-[#3A3A3C] hover:border-[#98989D]"
        >
          <X size={11} />
          Clear
        </button>
      )}
    </div>
  )
}
