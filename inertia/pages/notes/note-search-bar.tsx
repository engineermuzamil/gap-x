import { Search, X } from 'lucide-react'
import { useNotesStore } from '../../lib/notes-store'

// Reads and writes searchQuery from Zustand store
// No props needed — fully self-contained
export default function NoteSearchBar() {
  const { searchQuery, setSearchQuery, clearSearch } = useNotesStore()

  return (
    <div className="relative mb-4">
      <Search
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98989D] pointer-events-none"
      />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search notes by title or content..."
        className="w-full pl-9 pr-9 py-2.5 bg-[#2C2C2E] text-white text-sm placeholder-[#98989D] rounded-xl border border-[#3A3A3C] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] transition-all duration-200"
      />
      {/* Clear X — only visible when something is typed */}
      {searchQuery && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98989D] hover:text-white transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
