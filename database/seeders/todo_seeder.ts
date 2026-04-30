import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Todo from '#models/todo'
import User from '#models/user'
import Label from '#models/label'

export default class TodoSeeder extends BaseSeeder {
  async run() {
    const user = await User.firstOrFail()

    const labels = await Label.query().whereIn('name', ['Work', 'Learning', 'Personal'])
    const byName = Object.fromEntries(labels.map((l) => [l.name, l]))

    const todosData = [
      // ── Pending ──────────────────────────────────────────────────────────────
      {
        title: 'Write migration for bookmark table',
        description:
          'Add user_id FK with CASCADE, url, og metadata fields, ai_label, tldr columns.',
        priority: 'high' as const,
        status: 'pending' as const,
        labelNames: ['Work'],
      },
      {
        title: 'Read Lucid ORM relationships docs',
        description:
          'Focus on hasMany, belongsTo, manyToMany and how preload works with nested relations.',
        priority: 'medium' as const,
        status: 'pending' as const,
        labelNames: ['Learning'],
      },
      {
        title: 'Add form validation with Zod',
        description: null,
        priority: 'medium' as const,
        status: 'pending' as const,
        labelNames: ['Work'],
      },
      {
        title: 'Book dentist appointment',
        description: null,
        priority: 'low' as const,
        status: 'pending' as const,
        labelNames: ['Personal'],
      },

      // ── In Progress ──────────────────────────────────────────────────────────
      {
        title: 'Integrate Google Gemini API',
        description:
          'Set up gemini_service.ts with generateLabel and generateTldr functions. Use @google/generative-ai SDK.',
        priority: 'high' as const,
        status: 'in_progress' as const,
        labelNames: ['Work', 'Learning'],
      },
      {
        title: 'Fix database schema relationships',
        description:
          'Make user_id NOT NULL on notes and todos. Drop defaultTo(1) on projects. Add @belongsTo to Project model.',
        priority: 'high' as const,
        status: 'in_progress' as const,
        labelNames: ['Work'],
      },

      // ── Completed ────────────────────────────────────────────────────────────
      {
        title: 'Set up Inertia.js with React',
        description: null,
        priority: 'high' as const,
        status: 'completed' as const,
        labelNames: ['Work', 'Learning'],
      },
      {
        title: 'Build notes CRUD with soft delete',
        description: 'Notes can be trashed and restored. Permanent delete only from trash.',
        priority: 'high' as const,
        status: 'completed' as const,
        labelNames: ['Work'],
      },
      {
        title: 'Add Cloudinary image upload to notes',
        description: null,
        priority: 'medium' as const,
        status: 'completed' as const,
        labelNames: ['Work'],
      },
    ]

    for (const { title, description, priority, status, labelNames } of todosData) {
      const todo = await Todo.updateOrCreate(
        { title, userId: user.id },
        { title, description, priority, status, userId: user.id }
      )

      const labelIds = labelNames
        .map((name) => byName[name]?.id)
        .filter((id): id is number => id !== undefined)

      if (labelIds.length > 0) {
        await todo.related('labels').sync(labelIds)
      }
    }

    console.log(`✅ Todos seeded for user: ${user.email}`)
  }
}
