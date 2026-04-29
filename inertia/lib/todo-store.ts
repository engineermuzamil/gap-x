// lib/todo-store.ts
// ─────────────────────────────────────────────────────────────────────────────
// Zustand store for global UI state that is shared across todo components.
// Server data (the actual todos) still lives in TanStack Query — that's correct.
// Zustand here manages: which view, is the form open, which todo is being edited.
// ─────────────────────────────────────────────────────────────────────────────

import { create } from 'zustand'
import type { Todo } from './types'

type ViewType = 'grid' | 'list'

type TodoUIState = {
  // ─── State ───────────────────────────────────────────────────────────────
  viewType: ViewType
  isFormVisible: boolean
  editingTodo: Todo | null

  // ─── Actions ─────────────────────────────────────────────────────────────
  setViewType: (view: ViewType) => void
  openCreateForm: () => void
  openEditForm: (todo: Todo) => void
  closeForm: () => void
  toggleForm: () => void
}

export const useTodoStore = create<TodoUIState>((set, get) => ({
  // ─── Initial State ────────────────────────────────────────────────────────
  viewType: 'grid',
  isFormVisible: false,
  editingTodo: null,

  // ─── Actions ──────────────────────────────────────────────────────────────

  setViewType: (view) => set({ viewType: view }),

  openCreateForm: () =>
    set({
      isFormVisible: true,
      editingTodo: null,
    }),

  openEditForm: (todo) =>
    set({
      isFormVisible: true,
      editingTodo: todo,
    }),

  closeForm: () =>
    set({
      isFormVisible: false,
      editingTodo: null,
    }),

  // If the form is open → close it. If it is closed → open a fresh create form.
  toggleForm: () => {
    const { isFormVisible } = get()
    if (isFormVisible) {
      set({ isFormVisible: false, editingTodo: null })
    } else {
      set({ isFormVisible: true, editingTodo: null })
    }
  },
}))
