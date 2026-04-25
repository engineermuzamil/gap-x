import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.on('/').renderInertia('home', {}).as('home')

// ─── Session-based Auth (Notes) ───────────────────────────────────────────────

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])
    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())

// ─── JWT-based Auth (Todos) ───────────────────────────────────────────────────

router
  .group(() => {
    router.get('signup', ({ inertia }) => inertia.render('todos/signup', {})).as('signupPage')
    router.get('login', ({ inertia }) => inertia.render('todos/login', {})).as('loginPage')
    router.post('signup', [controllers.TodoAuths, 'signup']).as('signup')
    router.post('login', [controllers.TodoAuths, 'login']).as('login')
  })
  .prefix('/todo-auth')
  .as('todoAuth')

router
  .group(() => {
    router.post('logout', [controllers.TodoAuths, 'logout']).as('logout')
  })
  .prefix('/todo-auth')
  .as('todoAuth')
  .use(middleware.jwtAuth())

// ─── Notes ────────────────────────────────────────────────────────────────────

router.get('/notes/share/:token', [controllers.Notes, 'showShared']).as('notes.showShared')

router
  .group(() => {
    router.get('/', [controllers.Notes, 'index']).as('index')
    router.post('/', [controllers.Notes, 'store']).as('store')
    router.put('/:id', [controllers.Notes, 'update']).as('update')
    router.delete('/:id', [controllers.Notes, 'destroy']).as('destroy')
    router.post('/:id/restore', [controllers.Notes, 'restore']).as('restore')
    router.delete('/:id/force', [controllers.Notes, 'forceDestroy']).as('forceDestroy')
    router.post('/upload', [controllers.Notes, 'uploadImage']).as('upload')
    router.post('/:id/share', [controllers.Notes, 'share']).as('share')
    router.delete('/:id/share', [controllers.Notes, 'unshare']).as('unshare')
  })
  .prefix('/notes')
  .as('notes')
  .use(middleware.auth())

// ─── Todos ────────────────────────────────────────────────────────────────────

router.get('/todos', ({ inertia }) => inertia.render('todos/index', {})).as('todos.page')

router
  .group(() => {
    router.get('/data', [controllers.Todos, 'index']).as('index')
    router.post('/', [controllers.Todos, 'store']).as('store')
    router.get('/:id', [controllers.Todos, 'show']).as('show')
    router.put('/:id', [controllers.Todos, 'update']).as('update')
    router.delete('/:id', [controllers.Todos, 'destroy']).as('destroy')
  })
  .prefix('/todos')
  .as('todos')
  .use(middleware.jwtAuth())

// ─── Projects – Google OAuth ──────────────────────────────────────────────────

router
  .group(() => {
    router.get('/', [controllers.GoogleAuths, 'authPage']).as('page')

    router.get('google/redirect', [controllers.GoogleAuths, 'redirect']).as('google.redirect')
    router.get('google/callback', [controllers.GoogleAuths, 'callback']).as('google.callback')

    router.post('logout', [controllers.GoogleAuths, 'logout']).as('logout').use(middleware.auth())
  })
  .prefix('/projects/auth')
  .as('projectsAuth')

// ─── Projects – Protected CRUD ────────────────────────────────────────────────

router
  .group(() => {
    router.get('/', [controllers.Projects, 'index']).as('index')
    router.post('/', [controllers.Projects, 'store']).as('store')
    router.put('/:id', [controllers.Projects, 'update']).as('update')
    router.delete('/:id', [controllers.Projects, 'destroy']).as('destroy')
  })
  .prefix('/projects')
  .as('projects')
  .use(middleware.auth({ redirectTo: '/projects/auth' }))
