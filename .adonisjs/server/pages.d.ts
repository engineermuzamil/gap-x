import '@adonisjs/inertia/types'

import type React from 'react'
import type { Prettify } from '@adonisjs/core/types/common'

type ExtractProps<T> =
  T extends React.FC<infer Props>
    ? Prettify<Omit<Props, 'children'>>
    : T extends React.Component<infer Props>
      ? Prettify<Omit<Props, 'children'>>
      : never

declare module '@adonisjs/inertia/types' {
  export interface InertiaPages {
    'auth/login': ExtractProps<(typeof import('../../inertia/pages/auth/login.tsx'))['default']>
    'auth/signup': ExtractProps<(typeof import('../../inertia/pages/auth/signup.tsx'))['default']>
    'errors/not_found': ExtractProps<(typeof import('../../inertia/pages/errors/not_found.tsx'))['default']>
    'errors/server_error': ExtractProps<(typeof import('../../inertia/pages/errors/server_error.tsx'))['default']>
    'home': ExtractProps<(typeof import('../../inertia/pages/home.tsx'))['default']>
    'notes/flash-toast': ExtractProps<(typeof import('../../inertia/pages/notes/flash-toast.tsx'))['default']>
    'notes/index': ExtractProps<(typeof import('../../inertia/pages/notes/index.tsx'))['default']>
    'notes/note-card': ExtractProps<(typeof import('../../inertia/pages/notes/note-card.tsx'))['default']>
    'notes/note-form': ExtractProps<(typeof import('../../inertia/pages/notes/note-form.tsx'))['default']>
    'notes/shared-note': ExtractProps<(typeof import('../../inertia/pages/notes/shared-note.tsx'))['default']>
    'notes/sort-selector': ExtractProps<(typeof import('../../inertia/pages/notes/sort-selector.tsx'))['default']>
    'notes/trash-section': ExtractProps<(typeof import('../../inertia/pages/notes/trash-section.tsx'))['default']>
    'notes/view-switcher': ExtractProps<(typeof import('../../inertia/pages/notes/view-switcher.tsx'))['default']>
    'projects/index': ExtractProps<(typeof import('../../inertia/pages/projects/index.tsx'))['default']>
    'projects/project-card': ExtractProps<(typeof import('../../inertia/pages/projects/project-card.tsx'))['default']>
    'projects/project-form': ExtractProps<(typeof import('../../inertia/pages/projects/project-form.tsx'))['default']>
    'projects/view-switcher': ExtractProps<(typeof import('../../inertia/pages/projects/view-switcher.tsx'))['default']>
    'todos/index': ExtractProps<(typeof import('../../inertia/pages/todos/index.tsx'))['default']>
    'todos/todo-card': ExtractProps<(typeof import('../../inertia/pages/todos/todo-card.tsx'))['default']>
    'todos/todo-form': ExtractProps<(typeof import('../../inertia/pages/todos/todo-form.tsx'))['default']>
    'todos/view-switcher': ExtractProps<(typeof import('../../inertia/pages/todos/view-switcher.tsx'))['default']>
  }
}
