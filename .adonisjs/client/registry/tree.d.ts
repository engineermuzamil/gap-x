/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  newAccount: {
    create: typeof routes['new_account.create']
    store: typeof routes['new_account.store']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  notes: {
    index: typeof routes['notes.index']
    store: typeof routes['notes.store']
    update: typeof routes['notes.update']
    destroy: typeof routes['notes.destroy']
    upload: typeof routes['notes.upload']
  }
  todos: {
    index: typeof routes['todos.index']
    store: typeof routes['todos.store']
    update: typeof routes['todos.update']
    destroy: typeof routes['todos.destroy']
  }
  projects: {
    index: typeof routes['projects.index']
    store: typeof routes['projects.store']
    update: typeof routes['projects.update']
    destroy: typeof routes['projects.destroy']
  }
}
