export type SortOption = 'pinned' | 'created_desc' | 'created_asc' | 'updated_desc' | 'updated_asc'

// Shared Label type used across notes and todos
export interface Label {
  id: number
  name: string
}

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
}

export function sortNotes(notes: Note[], sortBy: SortOption): Note[] {
  return [...notes].sort((a, b) => {
    switch (sortBy) {
      case 'pinned':
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()

      case 'created_desc':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()

      case 'created_asc':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()

      case 'updated_desc':
        return (
          new Date(b.updatedAt ?? b.createdAt).getTime() -
          new Date(a.updatedAt ?? a.createdAt).getTime()
        )

      case 'updated_asc':
        return (
          new Date(a.updatedAt ?? a.createdAt).getTime() -
          new Date(b.updatedAt ?? b.createdAt).getTime()
        )

      default:
        return 0
    }
  })
}
