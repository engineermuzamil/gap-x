import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Todo from '#models/todo'
import Label from '#models/label'
import User from '#models/user'

export default class TodoSeeder extends BaseSeeder {
  async run() {
    const todosUser = await User.findByOrFail('email', 'todos@gap.com')
    const todosUserOne = await User.findByOrFail('email', 'todos1@gap.com')
    const todosUserTwo = await User.findByOrFail('email', 'todos2@gap.com')

    const labels = await Label.all()
    const id = (name: string) => labels.find((l) => l.name === name)!.id

    const createTodo = async ({
      title,
      description,
      priority,
      status,
      userId,
      labelNames,
    }: {
      title: string
      description: string | null
      priority: string
      status: string
      userId: number
      labelNames: string[]
    }) => {
      const todo = await Todo.create({ title, description, priority, status, userId })
      await todo.related('labels').attach(labelNames.map(id))
      return todo
    }

    await createTodo({
      title: 'Set up AdonisJS project',
      description:
        'Clone the repo, install dependencies, configure .env and run migrations to get the project running locally.',
      priority: 'high',
      status: 'completed',
      userId: todosUser.id,
      labelNames: ['Work', 'Learning'],
    })

    await createTodo({
      title: 'Understand MVC architecture',
      description:
        'Study how Models, Views, and Controllers interact in AdonisJS. Look at existing controllers and models for reference.',
      priority: 'medium',
      status: 'completed',
      userId: todosUser.id,
      labelNames: ['Learning'],
    })

    await createTodo({
      title: 'Create Notes module',
      description:
        'Build full CRUD for notes including migration, model, controller, routes, and React frontend with Inertia.js.',
      priority: 'high',
      status: 'in_progress',
      userId: todosUser.id,
      labelNames: ['Work', 'Learning'],
    })

    await createTodo({
      title: 'Create Todos module',
      description:
        'Build full CRUD for todos with status toggle and consistent UI matching the Notes module.',
      priority: 'medium',
      status: 'in_progress',
      userId: todosUser.id,
      labelNames: ['Work'],
    })

    await createTodo({
      title: 'Implement pagination for Projects',
      description:
        'Add paginate() in the ProjectsController and wire up page navigation buttons in the frontend.',
      priority: 'high',
      status: 'pending',
      userId: todosUser.id,
      labelNames: ['Work'],
    })

    await createTodo({
      title: 'Write seeders for all modules',
      description:
        'Create seed data for Notes, Todos, and Projects so the app has realistic content for testing and demos.',
      priority: 'low',
      status: 'completed',
      userId: todosUser.id,
      labelNames: ['Work'],
    })

    await createTodo({
      title: 'Morning workout',
      description: '30 minutes of cardio or strength training before starting work.',
      priority: 'medium',
      status: 'pending',
      userId: todosUser.id,
      labelNames: ['Health', 'Personal'],
    })

    await createTodo({
      title: 'Buy groceries',
      description: 'Eggs, milk, yogurt, bananas, and tea bags.',
      priority: 'low',
      status: 'pending',
      userId: todosUserOne.id,
      labelNames: ['Personal'],
    })

    await createTodo({
      title: 'Reply to internship email',
      description: 'Send the updated CV and portfolio link before 6 pm.',
      priority: 'high',
      status: 'pending',
      userId: todosUserOne.id,
      labelNames: ['Work'],
    })

    await createTodo({
      title: 'Clean desk',
      description: 'Throw away old papers and organize cables.',
      priority: 'low',
      status: 'completed',
      userId: todosUserOne.id,
      labelNames: ['Personal'],
    })

    await createTodo({
      title: 'Read JWT article',
      description: 'Understand token signing, expiration, and Authorization headers.',
      priority: 'medium',
      status: 'pending',
      userId: todosUserOne.id,
      labelNames: ['Learning'],
    })

    await createTodo({
      title: 'Call mechanic',
      description: 'Ask about bike brake repair cost and pickup time.',
      priority: 'low',
      status: 'pending',
      userId: todosUserTwo.id,
      labelNames: ['Personal'],
    })

    await createTodo({
      title: 'Submit assignment',
      description: 'Finalize screenshots and send the repo link.',
      priority: 'high',
      status: 'in_progress',
      userId: todosUserTwo.id,
      labelNames: ['Work'],
    })

    await createTodo({
      title: 'Evening walk',
      description: 'Walk for 20 minutes after maghrib.',
      priority: 'low',
      status: 'completed',
      userId: todosUserTwo.id,
      labelNames: ['Health'],
    })

    await createTodo({
      title: 'Watch React video',
      description: 'Finish the section on forms and controlled inputs.',
      priority: 'medium',
      status: 'pending',
      userId: todosUserTwo.id,
      labelNames: ['Learning'],
    })
  }
}
