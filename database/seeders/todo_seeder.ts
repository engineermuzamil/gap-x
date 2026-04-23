import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Todo from '#models/todo'

export default class TodoSeeder extends BaseSeeder {
  async run() {
    await Todo.createMany([
      {
        title: 'Set up AdonisJS project',
        description:
          'Clone the repo, install dependencies, configure .env file and run migrations to get the project running locally.',
        isCompleted: true,
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
          'Build the full CRUD for notes including migration, model, controller, routes, and React frontend with Inertia.js.',
        isCompleted: true,
      },
      {
        title: 'Create Todos module',
        description:
          'Build the full CRUD for todos with isCompleted toggle functionality and consistent UI matching the Notes module.',
        isCompleted: false,
      },
      {
        title: 'Create Projects module',
        description:
          'Build projects with status management using enums (pending, in-progress, completed) and pagination support.',
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
        isCompleted: false,
      },
    ])
  }
}
