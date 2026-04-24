// inertia/lib/types.ts
// ─────────────────────────────────────────────────────────────────────────────
// All shared types used across the app.
// Import from here instead of defining types locally in each file.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Shared ───────────────────────────────────────────────────────────────────

export interface Label {
  id: number
  name: string
}

// ─── Note ─────────────────────────────────────────────────────────────────────

export interface Note {
  id: number
  title: string
  content: string
  pinned: boolean
  imageUrl: string | null
  shareToken: string | null
  labels: Label[]
  createdAt: string
  updatedAt: string | null
  deletedAt: string | null
}

export type SortOption = 'pinned' | 'created_desc' | 'created_asc' | 'updated_desc' | 'updated_asc'

// ─── Todo ─────────────────────────────────────────────────────────────────────

export interface Todo {
  id: number
  userId: number
  title: string
  description: string | null
  isCompleted: boolean
  labels: Label[]
  createdAt: string
  updatedAt: string
}

// ─── Project ──────────────────────────────────────────────────────────────────

export interface Project {
  id: number
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed'
  createdAt: string
  updatedAt: string
}

export type ProjectStatus = Project['status']

export interface PaginatedProjects {
  data: Project[]
  meta: {
    currentPage: number
    lastPage: number
    perPage: number
    total: number
  }
}
