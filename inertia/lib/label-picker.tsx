import { getLabelColor } from './label-colors'
import type { Label } from './sort-notes'

interface LabelPickerProps {
  allLabels: Label[]
  selectedIds: number[]
  onChange: (ids: number[]) => void
}

export default function LabelPicker({ allLabels, selectedIds, onChange }: LabelPickerProps) {
  const toggle = (id: number) => {
    if (selectedIds.includes(id)) {
      // Remove it
      onChange(selectedIds.filter((existing) => existing !== id))
    } else {
      // Add it
      onChange([...selectedIds, id])
    }
  }

  return (
    <div className="mb-4">
      <p className="text-xs text-[#98989D] mb-2 uppercase tracking-wider">Labels</p>
      <div className="flex flex-wrap gap-2">
        {allLabels.map((label) => {
          const isSelected = selectedIds.includes(label.id)
          const { bg, text } = getLabelColor(label.name)

          return (
            <button
              key={label.id}
              type="button"
              onClick={() => toggle(label.id)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-150 ${
                isSelected
                  ? `${bg} ${text} border-transparent`
                  : 'border-[#3A3A3C] text-[#98989D] hover:text-white hover:border-[#98989D]'
              }`}
            >
              {label.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
