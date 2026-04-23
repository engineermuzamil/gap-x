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
  'todos.index': {
    methods: ["GET","HEAD"],
    pattern: '/todos',
    tokens: [{"old":"/todos","type":0,"val":"todos","end":""}],
    types: placeholder as Registry['todos.index']['types'],
  },
  'todos.store': {
    methods: ["POST"],
    pattern: '/todos',
    tokens: [{"old":"/todos","type":0,"val":"todos","end":""}],
    types: placeholder as Registry['todos.store']['types'],
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
