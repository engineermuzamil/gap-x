/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'new_account.create': {
    methods: ["GET","HEAD"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.create']['types'],
  },
  'new_account.store': {
    methods: ["POST"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.store']['types'],
  },
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.store']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['session.destroy']['types'],
  },
  'todoAuth.signupPage': {
    methods: ["GET","HEAD"],
    pattern: '/todo-auth/signup',
    tokens: [{"old":"/todo-auth/signup","type":0,"val":"todo-auth","end":""},{"old":"/todo-auth/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['todoAuth.signupPage']['types'],
  },
  'todoAuth.loginPage': {
    methods: ["GET","HEAD"],
    pattern: '/todo-auth/login',
    tokens: [{"old":"/todo-auth/login","type":0,"val":"todo-auth","end":""},{"old":"/todo-auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['todoAuth.loginPage']['types'],
  },
  'todoAuth.signup': {
    methods: ["POST"],
    pattern: '/todo-auth/signup',
    tokens: [{"old":"/todo-auth/signup","type":0,"val":"todo-auth","end":""},{"old":"/todo-auth/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['todoAuth.signup']['types'],
  },
  'todoAuth.login': {
    methods: ["POST"],
    pattern: '/todo-auth/login',
    tokens: [{"old":"/todo-auth/login","type":0,"val":"todo-auth","end":""},{"old":"/todo-auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['todoAuth.login']['types'],
  },
  'todoAuth.logout': {
    methods: ["POST"],
    pattern: '/todo-auth/logout',
    tokens: [{"old":"/todo-auth/logout","type":0,"val":"todo-auth","end":""},{"old":"/todo-auth/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['todoAuth.logout']['types'],
  },
  'notes.showShared': {
    methods: ["GET","HEAD"],
    pattern: '/notes/share/:token',
    tokens: [{"old":"/notes/share/:token","type":0,"val":"notes","end":""},{"old":"/notes/share/:token","type":0,"val":"share","end":""},{"old":"/notes/share/:token","type":1,"val":"token","end":""}],
    types: placeholder as Registry['notes.showShared']['types'],
  },
  'notes.index': {
    methods: ["GET","HEAD"],
    pattern: '/notes',
    tokens: [{"old":"/notes","type":0,"val":"notes","end":""}],
    types: placeholder as Registry['notes.index']['types'],
  },
  'notes.store': {
    methods: ["POST"],
    pattern: '/notes',
    tokens: [{"old":"/notes","type":0,"val":"notes","end":""}],
    types: placeholder as Registry['notes.store']['types'],
  },
  'notes.update': {
    methods: ["PUT"],
    pattern: '/notes/:id',
    tokens: [{"old":"/notes/:id","type":0,"val":"notes","end":""},{"old":"/notes/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['notes.update']['types'],
  },
  'notes.destroy': {
    methods: ["DELETE"],
    pattern: '/notes/:id',
    tokens: [{"old":"/notes/:id","type":0,"val":"notes","end":""},{"old":"/notes/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['notes.destroy']['types'],
  },
  'notes.restore': {
    methods: ["POST"],
    pattern: '/notes/:id/restore',
    tokens: [{"old":"/notes/:id/restore","type":0,"val":"notes","end":""},{"old":"/notes/:id/restore","type":1,"val":"id","end":""},{"old":"/notes/:id/restore","type":0,"val":"restore","end":""}],
    types: placeholder as Registry['notes.restore']['types'],
  },
  'notes.forceDestroy': {
    methods: ["DELETE"],
    pattern: '/notes/:id/force',
    tokens: [{"old":"/notes/:id/force","type":0,"val":"notes","end":""},{"old":"/notes/:id/force","type":1,"val":"id","end":""},{"old":"/notes/:id/force","type":0,"val":"force","end":""}],
    types: placeholder as Registry['notes.forceDestroy']['types'],
  },
  'notes.upload': {
    methods: ["POST"],
    pattern: '/notes/upload',
    tokens: [{"old":"/notes/upload","type":0,"val":"notes","end":""},{"old":"/notes/upload","type":0,"val":"upload","end":""}],
    types: placeholder as Registry['notes.upload']['types'],
  },
  'notes.share': {
    methods: ["POST"],
    pattern: '/notes/:id/share',
    tokens: [{"old":"/notes/:id/share","type":0,"val":"notes","end":""},{"old":"/notes/:id/share","type":1,"val":"id","end":""},{"old":"/notes/:id/share","type":0,"val":"share","end":""}],
    types: placeholder as Registry['notes.share']['types'],
  },
  'notes.unshare': {
    methods: ["DELETE"],
    pattern: '/notes/:id/share',
    tokens: [{"old":"/notes/:id/share","type":0,"val":"notes","end":""},{"old":"/notes/:id/share","type":1,"val":"id","end":""},{"old":"/notes/:id/share","type":0,"val":"share","end":""}],
    types: placeholder as Registry['notes.unshare']['types'],
  },
  'todos.page': {
    methods: ["GET","HEAD"],
    pattern: '/todos',
    tokens: [{"old":"/todos","type":0,"val":"todos","end":""}],
    types: placeholder as Registry['todos.page']['types'],
  },
  'todos.index': {
    methods: ["GET","HEAD"],
    pattern: '/todos/data',
    tokens: [{"old":"/todos/data","type":0,"val":"todos","end":""},{"old":"/todos/data","type":0,"val":"data","end":""}],
    types: placeholder as Registry['todos.index']['types'],
  },
  'todos.store': {
    methods: ["POST"],
    pattern: '/todos',
    tokens: [{"old":"/todos","type":0,"val":"todos","end":""}],
    types: placeholder as Registry['todos.store']['types'],
  },
  'todos.show': {
    methods: ["GET","HEAD"],
    pattern: '/todos/:id',
    tokens: [{"old":"/todos/:id","type":0,"val":"todos","end":""},{"old":"/todos/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['todos.show']['types'],
  },
  'todos.update': {
    methods: ["PUT"],
    pattern: '/todos/:id',
    tokens: [{"old":"/todos/:id","type":0,"val":"todos","end":""},{"old":"/todos/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['todos.update']['types'],
  },
  'todos.destroy': {
    methods: ["DELETE"],
    pattern: '/todos/:id',
    tokens: [{"old":"/todos/:id","type":0,"val":"todos","end":""},{"old":"/todos/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['todos.destroy']['types'],
  },
  'projectsAuth.page': {
    methods: ["GET","HEAD"],
    pattern: '/projects/auth',
    tokens: [{"old":"/projects/auth","type":0,"val":"projects","end":""},{"old":"/projects/auth","type":0,"val":"auth","end":""}],
    types: placeholder as Registry['projectsAuth.page']['types'],
  },
  'projectsAuth.google.redirect': {
    methods: ["GET","HEAD"],
    pattern: '/projects/auth/google/redirect',
    tokens: [{"old":"/projects/auth/google/redirect","type":0,"val":"projects","end":""},{"old":"/projects/auth/google/redirect","type":0,"val":"auth","end":""},{"old":"/projects/auth/google/redirect","type":0,"val":"google","end":""},{"old":"/projects/auth/google/redirect","type":0,"val":"redirect","end":""}],
    types: placeholder as Registry['projectsAuth.google.redirect']['types'],
  },
  'projectsAuth.google.callback': {
    methods: ["GET","HEAD"],
    pattern: '/projects/auth/google/callback',
    tokens: [{"old":"/projects/auth/google/callback","type":0,"val":"projects","end":""},{"old":"/projects/auth/google/callback","type":0,"val":"auth","end":""},{"old":"/projects/auth/google/callback","type":0,"val":"google","end":""},{"old":"/projects/auth/google/callback","type":0,"val":"callback","end":""}],
    types: placeholder as Registry['projectsAuth.google.callback']['types'],
  },
  'projectsAuth.logout': {
    methods: ["POST"],
    pattern: '/projects/auth/logout',
    tokens: [{"old":"/projects/auth/logout","type":0,"val":"projects","end":""},{"old":"/projects/auth/logout","type":0,"val":"auth","end":""},{"old":"/projects/auth/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['projectsAuth.logout']['types'],
  },
  'projects.index': {
    methods: ["GET","HEAD"],
    pattern: '/projects',
    tokens: [{"old":"/projects","type":0,"val":"projects","end":""}],
    types: placeholder as Registry['projects.index']['types'],
  },
  'projects.store': {
    methods: ["POST"],
    pattern: '/projects',
    tokens: [{"old":"/projects","type":0,"val":"projects","end":""}],
    types: placeholder as Registry['projects.store']['types'],
  },
  'projects.update': {
    methods: ["PUT"],
    pattern: '/projects/:id',
    tokens: [{"old":"/projects/:id","type":0,"val":"projects","end":""},{"old":"/projects/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['projects.update']['types'],
  },
  'projects.destroy': {
    methods: ["DELETE"],
    pattern: '/projects/:id',
    tokens: [{"old":"/projects/:id","type":0,"val":"projects","end":""},{"old":"/projects/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['projects.destroy']['types'],
  },
  'weather.show': {
    methods: ["GET","HEAD"],
    pattern: '/weather',
    tokens: [{"old":"/weather","type":0,"val":"weather","end":""}],
    types: placeholder as Registry['weather.show']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
