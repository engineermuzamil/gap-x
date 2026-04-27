import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SortOption } from './types'

// Shape of the store — all UI state for the notes page lives here
interface NotesStore {
  // ── UI State ──────────────────────────────────────────────────────────────
  viewType: 'grid' | 'list'
  sortBy: SortOption
  isFormVisible: boolean

  // ── Active label filters — IDs of labels the user has toggled on ─────────
  activeLabels: number[]

  // ── Actions — functions components call to update state ──────────────────
  setViewType: (view: 'grid' | 'list') => void
  setSortBy: (sort: SortOption) => void
  setIsFormVisible: (visible: boolean) => void
  toggleFormVisible: () => void
  toggleLabel: (id: number) => void
  clearLabels: () => void
}

// create() builds the store
// persist() wraps it so viewType, sortBy, activeLabels survive page refresh
export const useNotesStore = create<NotesStore>()(
  persist(
    (set) => ({
      // ── Defaults ────────────────────────────────────────────────────────
      viewType: 'grid',
      sortBy: 'pinned',
      isFormVisible: false,
      activeLabels: [],

      // ── Actions ──────────────────────────────────────────────────────────
      setViewType: (view) => set({ viewType: view }),
      setSortBy: (sort) => set({ sortBy: sort }),
      setIsFormVisible: (visible) => set({ isFormVisible: visible }),

      // Flip form open/closed
      toggleFormVisible: () => set((state) => ({ isFormVisible: !state.isFormVisible })),

      // If label is already active → remove it. Otherwise → add it.
      toggleLabel: (id) =>
        set((state) => ({
          activeLabels: state.activeLabels.includes(id)
            ? state.activeLabels.filter((l) => l !== id)
            : [...state.activeLabels, id],
        })),

      clearLabels: () => set({ activeLabels: [] }),
    }),
    {
      // Key in localStorage
      name: 'notes-ui-store',
      // Only persist these — isFormVisible always starts closed on fresh load
      partialize: (state) => ({
        viewType: state.viewType,
        sortBy: state.sortBy,
        activeLabels: state.activeLabels,
      }),
    }
  )
)
