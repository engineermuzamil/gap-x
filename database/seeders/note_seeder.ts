import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Note from '#models/note'

export default class NoteSeeder extends BaseSeeder {
  async run() {
    await Note.createMany([
      {
        title: 'AdonisJS Project Setup',
        content:
          'Clone the repo, run npm install, configure .env, then run node ace migration:run to get started. Use node ace serve --watch during development.',
        pinned: true,
      },
      {
        title: 'MVC Architecture',
        content:
          'Models handle database interactions via Lucid ORM. Controllers process requests and return responses. Views are handled by React via Inertia.js — no separate API needed.',
        pinned: true,
      },
      {
        title: 'Lucid ORM Basics',
        content:
          'Use Todo.all() to fetch all records. Use Todo.find(id) to fetch one. Use Todo.create(data) to insert. Use todo.merge(data).save() to update. Use todo.delete() to remove.',
        pinned: false,
      },
      {
        title: 'Inertia.js Flow',
        content:
          'User visits a route, controller fetches data and calls inertia.render with props, React component receives props directly. No fetch, no axios, no REST API needed.',
        pinned: false,
      },
      {
        title: 'Migrations Cheatsheet',
        content:
          'node ace migration:run to run pending migrations. node ace migration:rollback to undo last batch. node ace migration:fresh --seed to reset everything and seed fresh data.',
        pinned: false,
      },
      {
        title: 'Seeders vs Migrations',
        content:
          'Migrations define the database schema and structure. Seeders populate the database with test or default data. Always run migrations before seeders.',
        pinned: false,
      },
    ])
  }
}
