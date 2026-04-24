// inertia/lib/sort-notes.ts
import type { Note, SortOption } from './types'

const time = (date: string) => new Date(date).getTime()
const updatedOrCreated = (note: Note) => time(note.updatedAt ?? note.createdAt)

export function sortNotes(notes: Note[], sortBy: SortOption): Note[] {
  return [...notes].sort((a, b) => {
    switch (sortBy) {
      case 'pinned':
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
        return time(b.createdAt) - time(a.createdAt)

      case 'created_desc':
        return time(b.createdAt) - time(a.createdAt)

      case 'created_asc':
        return time(a.createdAt) - time(b.createdAt)

      case 'updated_desc':
        return updatedOrCreated(b) - updatedOrCreated(a)

      case 'updated_asc':
        return updatedOrCreated(a) - updatedOrCreated(b)

      default:
        return 0
    }
  })
}
