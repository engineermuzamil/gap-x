import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SortOption } from './types'

interface NotesStore {
  // ── UI State ──────────────────────────────────────────────────────────────
  viewType: 'grid' | 'list'
  sortBy: SortOption
  isFormVisible: boolean

  // ── Search + Filter ───────────────────────────────────────────────────────
  searchQuery: string
  activeLabels: number[]

  // ── Actions ───────────────────────────────────────────────────────────────
  setViewType: (view: 'grid' | 'list') => void
  setSortBy: (sort: SortOption) => void
  setIsFormVisible: (visible: boolean) => void
  toggleFormVisible: () => void
  setSearchQuery: (query: string) => void
  toggleLabel: (id: number) => void
  clearLabels: () => void
  clearSearch: () => void
  clearAll: () => void
}

export const useNotesStore = create<NotesStore>()(
  persist(
    (set) => ({
      // ── Defaults ────────────────────────────────────────────────────────
      viewType: 'grid',
      sortBy: 'pinned',
      isFormVisible: false,
      searchQuery: '',
      activeLabels: [],

      // ── Actions ──────────────────────────────────────────────────────────
      setViewType: (view) => set({ viewType: view }),
      setSortBy: (sort) => set({ sortBy: sort }),
      setIsFormVisible: (visible) => set({ isFormVisible: visible }),
      toggleFormVisible: () => set((state) => ({ isFormVisible: !state.isFormVisible })),
      setSearchQuery: (query) => set({ searchQuery: query }),
      toggleLabel: (id) =>
        set((state) => ({
          activeLabels: state.activeLabels.includes(id)
            ? state.activeLabels.filter((l) => l !== id)
            : [...state.activeLabels, id],
        })),
      clearLabels: () => set({ activeLabels: [] }),
      clearSearch: () => set({ searchQuery: '' }),
      // Clears both search and label filters at once
      clearAll: () => set({ searchQuery: '', activeLabels: [] }),
    }),
    {
      name: 'notes-ui-store',
      // isFormVisible and searchQuery are NOT persisted — always fresh on load
      partialize: (state) => ({
        viewType: state.viewType,
        sortBy: state.sortBy,
        activeLabels: state.activeLabels,
      }),
    }
  )
)
