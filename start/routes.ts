// start/routes.ts
import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

// Homepage
router.on('/').renderInertia('home', {}).as('home')

// Authentication
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
router
  .group(() => {
    router.get('/', [controllers.Notes, 'index']).as('index')
    router.post('/', [controllers.Notes, 'store']).as('store')
    router.put('/:id', [controllers.Notes, 'update']).as('update')
    router.delete('/:id', [controllers.Notes, 'destroy']).as('destroy')

    router.post('/upload', [controllers.Notes, 'uploadImage']).as('upload')
  })
  .prefix('/notes')
  .as('notes')

// Todos
router
  .group(() => {
    router.get('/', [controllers.Todos, 'index']).as('index')
    router.post('/', [controllers.Todos, 'store']).as('store')
    router.put('/:id', [controllers.Todos, 'update']).as('update')
    router.delete('/:id', [controllers.Todos, 'destroy']).as('destroy')
  })
  .prefix('/todos')
  .as('todos')

// Projects
router
  .group(() => {
    router.get('/', [controllers.Projects, 'index']).as('index')
    router.post('/', [controllers.Projects, 'store']).as('store')
    router.put('/:id', [controllers.Projects, 'update']).as('update')
    router.delete('/:id', [controllers.Projects, 'destroy']).as('destroy')
  })
  .prefix('/projects')
  .as('projects')
