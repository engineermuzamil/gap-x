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
  todoAuth: {
    signupPage: typeof routes['todoAuth.signupPage']
    loginPage: typeof routes['todoAuth.loginPage']
    signup: typeof routes['todoAuth.signup']
    login: typeof routes['todoAuth.login']
    logout: typeof routes['todoAuth.logout']
  }
  notes: {
    showShared: typeof routes['notes.showShared']
    index: typeof routes['notes.index']
    store: typeof routes['notes.store']
    update: typeof routes['notes.update']
    destroy: typeof routes['notes.destroy']
    restore: typeof routes['notes.restore']
    forceDestroy: typeof routes['notes.forceDestroy']
    upload: typeof routes['notes.upload']
    share: typeof routes['notes.share']
    unshare: typeof routes['notes.unshare']
  }
  todos: {
    page: typeof routes['todos.page']
    index: typeof routes['todos.index']
    store: typeof routes['todos.store']
    show: typeof routes['todos.show']
    update: typeof routes['todos.update']
    destroy: typeof routes['todos.destroy']
  }
  projectsAuth: {
    page: typeof routes['projectsAuth.page']
    google: {
      redirect: typeof routes['projectsAuth.google.redirect']
      callback: typeof routes['projectsAuth.google.callback']
    }
    logout: typeof routes['projectsAuth.logout']
  }
  projects: {
    index: typeof routes['projects.index']
    store: typeof routes['projects.store']
    update: typeof routes['projects.update']
    destroy: typeof routes['projects.destroy']
  }
  weather: {
    show: typeof routes['weather.show']
  }
}
