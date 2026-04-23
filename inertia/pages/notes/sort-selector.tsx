// import { ArrowUpDown } from 'lucide-react'
// import type { SortOption } from '../../lib/sort-notes'

// interface SortSelectorProps {
//   value: SortOption
//   onChange: (value: SortOption) => void
// }

// const SORT_OPTIONS: { value: SortOption; label: string }[] = [
//   { value: 'pinned', label: 'Pinned first' },
//   { value: 'created_desc', label: 'Newest first' },
//   { value: 'created_asc', label: 'Oldest first' },
//   { value: 'updated_desc', label: 'Recently updated' },
//   { value: 'updated_asc', label: 'Least recently updated' },
// ]

// export default function SortSelector({ value, onChange }: SortSelectorProps) {
//   return (
//     <div className="flex items-center gap-2">
//       <ArrowUpDown size={15} className="text-[#98989D] shrink-0" />
//       <select
//         value={value}
//         onChange={(e) => onChange(e.target.value as SortOption)}
//         className="bg-[#2C2C2E] text-white text-sm px-3 py-2 rounded-lg border border-[#3A3A3C] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] cursor-pointer appearance-none pr-7"
//         style={{ backgroundImage: 'none' }}
//       >
//         {SORT_OPTIONS.map((opt) => (
//           <option key={opt.value} value={opt.value}>
//             {opt.label}
//           </option>
//         ))}
//       </select>
//     </div>
//   )
// }

import { ArrowUpDown } from 'lucide-react'
import type { SortOption } from '../../lib/sort-notes'

interface SortSelectorProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'pinned', label: 'Pinned' },
  { value: 'created_desc', label: 'Newest first' },
  { value: 'created_asc', label: 'Oldest first' },
  { value: 'updated_desc', label: 'Recently updated' },
  { value: 'updated_asc', label: 'Least recently updated' },
]

export default function SortSelector({ value, onChange }: SortSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown size={15} className="text-[#98989D] shrink-0" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="bg-[#2C2C2E] text-white text-sm px-3 py-2 rounded-lg border border-[#3A3A3C] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] cursor-pointer appearance-none"
        style={{ backgroundImage: 'none' }}
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
