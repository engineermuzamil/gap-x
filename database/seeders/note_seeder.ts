import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Note from '#models/note'
import User from '#models/user'
import Label from '#models/label'

export default class NoteSeeder extends BaseSeeder {
  async run() {
    const user = await User.firstOrFail()

    const labels = await Label.query().whereIn('name', ['Learning', 'Work', 'Ideas', 'Personal'])
    const byName = Object.fromEntries(labels.map((l) => [l.name, l]))

    // ── Notes data ────────────────────────────────────────────────────────────
    const notesData = [
      // ── Markdown notes ──────────────────────────────────────────────────────

      {
        title: 'MVC Architecture',
        pinned: true,
        labelNames: ['Learning', 'Work'],
        content: `## Model → View → Controller

| Layer | Role |
|-------|------|
| **Model** | Database interactions via Lucid ORM |
| **Controller** | Handles requests, applies logic |
| **View** | React components via Inertia.js |

No separate REST API needed — Inertia bridges backend and frontend directly.`,
      },

      {
        title: 'How Inertia.js Works',
        pinned: true,
        labelNames: ['Learning'],
        content: `## How Inertia Works

1. User visits \`/notes\`
2. AdonisJS controller fetches data
3. Controller calls \`inertia.render('notes/index', { notes })\`
4. React component receives \`notes\` as props

**No fetch. No axios. No REST API.**`,
      },

      {
        title: 'Database Relationships',
        pinned: false,
        labelNames: ['Learning'],
        content: `## Lucid ORM Relationships

\`\`\`typescript
// One user has many notes
@hasMany(() => Note)
declare notes: HasMany<typeof Note>

// Each note belongs to one user
@belongsTo(() => User)
declare user: BelongsTo<typeof User>
\`\`\`

> Always declare both sides of the relationship — the \`hasMany\` on User and the \`belongsTo\` on Note.`,
      },

      {
        title: 'Zustand vs TanStack Query',
        pinned: false,
        labelNames: ['Learning', 'Work'],
        content: `## State Management Strategy

| Tool | What it manages |
|------|----------------|
| **Zustand** | UI state — view type, form open/closed, filters |
| **TanStack Query** | Server data — fetching, caching, refetching |

### Rule of thumb
- Is it *server data*? → TanStack Query
- Is it *UI-only state*? → Zustand
- Does it need to *persist on refresh*? → Zustand \`persist\` middleware`,
      },

      {
        title: 'Soft Delete Pattern',
        pinned: false,
        labelNames: ['Work'],
        content: `## Soft Delete vs Hard Delete

Soft delete sets \`deleted_at\` instead of removing the row:

\`\`\`typescript
// Soft delete
note.deletedAt = DateTime.now()
await note.save()

// Restore
note.deletedAt = null
await note.save()

// Hard delete (permanent)
await note.delete()
\`\`\`

Always filter active records with \`.whereNull('deleted_at')\`.`,
      },

      // ── Plain text notes ─────────────────────────────────────────────────────

      {
        title: 'Weekend Goals',
        pinned: false,
        labelNames: ['Personal'],
        content: `Finish the bookmark module and write tests for the notes controller. Also need to review the database migration changes and make sure everything is running cleanly after the schema fixes.

Maybe spend Sunday going through the Lucid ORM docs properly — relationships and query scopes especially.`,
      },

      {
        title: 'Book Recommendations',
        pinned: false,
        labelNames: ['Personal', 'Ideas'],
        content: `Books to read this quarter:

The Pragmatic Programmer — Andy Hunt
Clean Code — Robert C. Martin
Designing Data-Intensive Applications — Martin Kleppmann
You Don't Know JS — Kyle Simpson

Start with Pragmatic Programmer since it's language-agnostic and will apply immediately to what we're building.`,
      },

      {
        title: 'API Design Notes',
        pinned: false,
        labelNames: ['Work', 'Ideas'],
        content: `Key decisions for the REST endpoints:

Use plural nouns for resources — /notes not /note, /todos not /todo.
Keep controllers thin — validation in form request classes, business logic in services.
Always return consistent error shapes so the frontend can handle them generically.
Use 422 for validation errors, 401 for unauthenticated, 403 for unauthorised, 404 for not found.`,
      },

      {
        title: 'Quick Git Commands',
        pinned: false,
        labelNames: ['Work'],
        content: `Git commands I always forget:

Undo last commit but keep changes staged:
git reset --soft HEAD~1

Undo last commit and unstage changes:
git reset HEAD~1

Stash with a message:
git stash push -m "work in progress on notes feature"

See what's in stash:
git stash list`,
      },

      {
        title: 'Project Ideas',
        pinned: false,
        labelNames: ['Ideas'],
        content: `Side project ideas to explore after this bootcamp:

A habit tracker that uses AI to suggest better habits based on patterns.
A recipe manager that generates shopping lists automatically.
A code snippet manager with syntax highlighting and tag search.
A simple invoicing tool for freelancers — just the basics, nothing bloated.

The code snippet manager is probably the most useful day-to-day. Start there.`,
      },
    ]

    // ── Create notes and attach labels ────────────────────────────────────────
    for (const { title, content, pinned, labelNames } of notesData) {
      // updateOrCreate — safe to re-run, won't create duplicates
      const note = await Note.updateOrCreate(
        { title, userId: user.id },
        { title, content, pinned, userId: user.id }
      )

      // Attach the relevant labels — sync keeps it idempotent
      const labelIds = labelNames
        .map((name) => byName[name]?.id)
        .filter((id): id is number => id !== undefined)

      if (labelIds.length > 0) {
        await note.related('labels').sync(labelIds)
      }
    }

    console.log(`✅ Notes seeded for user: ${user.email}`)
  }
}
