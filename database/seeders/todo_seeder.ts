import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Todo from '#models/todo'
import Label from '#models/label'

export default class TodoSeeder extends BaseSeeder {
  async run() {
    // Fetch all labels by name so we can attach them by ID
    const labels = await Label.all()

    // Helper: find a label's id by name
    const id = (name: string) => labels.find((l) => l.name === name)!.id

    const todos = await Todo.createMany([
      {
        title: 'Set up AdonisJS project',
        description:
          'Clone the repo, install dependencies, configure .env and run migrations to get the project running locally.',
        isCompleted: false,
      },
      {
        title: 'Understand MVC architecture',
        description:
          'Study how Models, Views, and Controllers interact in AdonisJS. Look at existing controllers and models for reference.',
        isCompleted: true,
      },
      {
        title: 'Create Notes module',
        description:
          'Build full CRUD for notes including migration, model, controller, routes, and React frontend with Inertia.js.',
        isCompleted: false,
      },
      {
        title: 'Create Todos module',
        description:
          'Build full CRUD for todos with isCompleted toggle and consistent UI matching the Notes module.',
        isCompleted: false,
      },
      {
        title: 'Implement pagination for Projects',
        description:
          'Add paginate() in the ProjectsController and wire up page navigation buttons in the frontend.',
        isCompleted: false,
      },
      {
        title: 'Write seeders for all modules',
        description:
          'Create seed data for Notes, Todos, and Projects so the app has realistic content for testing and demos.',
        isCompleted: true,
      },
      {
        title: 'Morning workout',
        description: '30 minutes of cardio or strength training before starting work.',
        isCompleted: false,
      },
    ])

    // Attach labels to each todo using the pivot table
    // related('labels').attach() inserts rows into todo_labels
    await todos[0].related('labels').attach([id('Work'), id('Learning')])
    await todos[1].related('labels').attach([id('Learning')])
    await todos[2].related('labels').attach([id('Work'), id('Learning')])
    await todos[3].related('labels').attach([id('Work')])
    await todos[4].related('labels').attach([id('Work'), id('Urgent')])
    await todos[5].related('labels').attach([id('Work')])
    await todos[6].related('labels').attach([id('Health'), id('Personal')])
  }
}
