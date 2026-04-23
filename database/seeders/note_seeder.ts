import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Note from '#models/note'

export default class NoteSeeder extends BaseSeeder {
  async run() {
    await Note.createMany([
      {
        title: 'AdonisJS Project Setup',
        content: `## Getting Started

Clone the repo and install dependencies:

\`\`\`bash
git clone <repo-url>
cd project
npm install
\`\`\`

Configure your \`.env\` file, then run:

\`\`\`bash
node ace migration:run
node ace serve --watch
\`\`\`

> Visit \`http://localhost:3333\` to verify the setup.`,
        pinned: true,
      },
      {
        title: 'MVC Architecture',
        content: `## Model → View → Controller

| Layer | Role |
|-------|------|
| **Model** | Database interactions via Lucid ORM |
| **Controller** | Handles requests, applies logic |
| **View** | React components via Inertia.js |

No separate REST API needed — Inertia bridges backend and frontend directly.`,
        pinned: true,
      },
      {
        title: 'Lucid ORM Basics',
        content: `## Common Lucid Operations

**Fetch all records:**
\`\`\`ts
const notes = await Note.all()
\`\`\`

**Fetch one by id:**
\`\`\`ts
const note = await Note.find(id)
\`\`\`

**Create:**
\`\`\`ts
await Note.create({ title, content })
\`\`\`

**Update:**
\`\`\`ts
await note.merge({ title, content }).save()
\`\`\`

**Delete:**
\`\`\`ts
await note.delete()
\`\`\``,
        pinned: false,
      },
      {
        title: 'Inertia.js Flow',
        content: `## How Inertia Works

1. User visits \`/notes\`
2. AdonisJS route calls \`NotesController.index()\`
3. Controller fetches data and calls \`inertia.render('notes/index', { notes })\`
4. React component receives \`notes\` as props directly

**No fetch. No axios. No REST API.**

> Think of Inertia as the glue between your AdonisJS backend and React frontend.`,
        pinned: false,
      },
      {
        title: 'Migrations Cheatsheet',
        content: `## Migration Commands

| Command | Description |
|---------|-------------|
| \`node ace migration:run\` | Run pending migrations |
| \`node ace migration:rollback\` | Undo last batch |
| \`node ace migration:fresh\` | Drop all tables and re-run |
| \`node ace migration:fresh --seed\` | Fresh + seed data |

> Always run migrations before seeders to avoid errors.`,
        pinned: false,
      },
      {
        title: 'Seeders vs Migrations',
        content: `## Key Difference

- **Migrations** define the *structure* of your database (tables, columns, indexes)
- **Seeders** populate the database with *data* (test records, defaults)

### Order matters

\`\`\`bash
node ace migration:run   # structure first
node ace db:seed         # data second
\`\`\`

Never run seeders before migrations — the tables won't exist yet.`,
        pinned: false,
      },
    ])
  }
}
