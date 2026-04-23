// start/routes.ts
import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.on('/').renderInertia('home', {}).as('home')

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

// Notes
router.get('/notes', [controllers.Notes, 'index']).as('notes.index')
router.post('/notes', [controllers.Notes, 'store']).as('notes.store')
router.put('/notes/:id', [controllers.Notes, 'update']).as('notes.update')
router.delete('/notes/:id', [controllers.Notes, 'destroy']).as('notes.destroy')

// Todos
router.get('/todos', [controllers.Todos, 'index']).as('todos.index')
router.get('/todos/:id', [controllers.Todos, 'show']).as('todos.show')
router.post('/todos', [controllers.Todos, 'store']).as('todos.store')
router.put('/todos/:id', [controllers.Todos, 'update']).as('todos.update')
router.delete('/todos/:id', [controllers.Todos, 'destroy']).as('todos.destroy')

// Projects
router.get('/projects', [controllers.Projects, 'index']).as('projects.index')
router.post('/projects', [controllers.Projects, 'store']).as('projects.store')
router.put('/projects/:id', [controllers.Projects, 'update']).as('projects.update')
router.delete('/projects/:id', [controllers.Projects, 'destroy']).as('projects.destroy')
