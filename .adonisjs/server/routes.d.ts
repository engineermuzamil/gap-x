import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'todoAuth.signupPage': { paramsTuple?: []; params?: {} }
    'todoAuth.loginPage': { paramsTuple?: []; params?: {} }
    'todoAuth.signup': { paramsTuple?: []; params?: {} }
    'todoAuth.login': { paramsTuple?: []; params?: {} }
    'todoAuth.logout': { paramsTuple?: []; params?: {} }
    'notes.showShared': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'notes.index': { paramsTuple?: []; params?: {} }
    'notes.store': { paramsTuple?: []; params?: {} }
    'notes.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'notes.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'notes.restore': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'notes.forceDestroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'notes.upload': { paramsTuple?: []; params?: {} }
    'notes.share': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'notes.unshare': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'todos.page': { paramsTuple?: []; params?: {} }
    'todos.index': { paramsTuple?: []; params?: {} }
    'todos.store': { paramsTuple?: []; params?: {} }
    'todos.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'todos.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'todos.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projectsAuth.page': { paramsTuple?: []; params?: {} }
    'projectsAuth.google.redirect': { paramsTuple?: []; params?: {} }
    'projectsAuth.google.callback': { paramsTuple?: []; params?: {} }
    'projectsAuth.logout': { paramsTuple?: []; params?: {} }
    'projects.index': { paramsTuple?: []; params?: {} }
    'projects.store': { paramsTuple?: []; params?: {} }
    'projects.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'weather.show': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'todoAuth.signupPage': { paramsTuple?: []; params?: {} }
    'todoAuth.loginPage': { paramsTuple?: []; params?: {} }
    'notes.showShared': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'notes.index': { paramsTuple?: []; params?: {} }
    'todos.page': { paramsTuple?: []; params?: {} }
    'todos.index': { paramsTuple?: []; params?: {} }
    'todos.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projectsAuth.page': { paramsTuple?: []; params?: {} }
    'projectsAuth.google.redirect': { paramsTuple?: []; params?: {} }
    'projectsAuth.google.callback': { paramsTuple?: []; params?: {} }
    'projects.index': { paramsTuple?: []; params?: {} }
    'weather.show': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'todoAuth.signupPage': { paramsTuple?: []; params?: {} }
    'todoAuth.loginPage': { paramsTuple?: []; params?: {} }
    'notes.showShared': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'notes.index': { paramsTuple?: []; params?: {} }
    'todos.page': { paramsTuple?: []; params?: {} }
    'todos.index': { paramsTuple?: []; params?: {} }
    'todos.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projectsAuth.page': { paramsTuple?: []; params?: {} }
    'projectsAuth.google.redirect': { paramsTuple?: []; params?: {} }
    'projectsAuth.google.callback': { paramsTuple?: []; params?: {} }
    'projects.index': { paramsTuple?: []; params?: {} }
    'weather.show': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'todoAuth.signup': { paramsTuple?: []; params?: {} }
    'todoAuth.login': { paramsTuple?: []; params?: {} }
    'todoAuth.logout': { paramsTuple?: []; params?: {} }
    'notes.store': { paramsTuple?: []; params?: {} }
    'notes.restore': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'notes.upload': { paramsTuple?: []; params?: {} }
    'notes.share': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'todos.store': { paramsTuple?: []; params?: {} }
    'projectsAuth.logout': { paramsTuple?: []; params?: {} }
    'projects.store': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'notes.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'todos.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'notes.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'notes.forceDestroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'notes.unshare': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'todos.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}