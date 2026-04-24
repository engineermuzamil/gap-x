import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Note from '#models/note'
import Label from '#models/label'

export default class NoteSeeder extends BaseSeeder {
  async run() {
    // Fetch all labels by name so we can attach them by ID
    const labels = await Label.all()

    // Helper: find a label's id by name
    const id = (name: string) => labels.find((l) => l.name === name)!.id

    const notes = await Note.createMany([
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

**Fetch all:**
\`\`\`ts
const notes = await Note.all()
\`\`\`

**Find by id:**
\`\`\`ts
const note = await Note.find(id)
\`\`\`

**Create:**
\`\`\`ts
await Note.create({ title, content })
\`\`\`

**Update:**
\`\`\`ts
await note.merge({ title }).save()
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
2. AdonisJS controller fetches data
3. Controller calls \`inertia.render('notes/index', { notes })\`
4. React component receives \`notes\` as props

**No fetch. No axios. No REST API.**`,
        pinned: false,
      },
      {
        title: 'Migrations Cheatsheet',
        content: `## Migration Commands

| Command | Description |
|---------|-------------|
| \`node ace migration:run\` | Run pending migrations |
| \`node ace migration:rollback\` | Undo last batch |
| \`node ace migration:fresh\` | Drop all & re-run |
| \`node ace migration:fresh --seed\` | Fresh + seed |`,
        pinned: false,
      },
      {
        title: 'Healthy Habits Tracker',
        content: `## Daily Goals

- [ ] Drink 8 glasses of water
- [ ] 30 min walk or workout
- [ ] Sleep before midnight
- [ ] No screens 1hr before bed

> Small consistent habits beat big sporadic efforts.`,
        pinned: false,
      },
    ])

    // Attach labels to each note using the pivot table
    // related('labels').attach() inserts rows into note_labels
    await notes[0].related('labels').attach([id('Learning'), id('Work')])
    await notes[1].related('labels').attach([id('Learning')])
    await notes[2].related('labels').attach([id('Learning')])
    await notes[3].related('labels').attach([id('Learning'), id('Ideas')])
    await notes[4].related('labels').attach([id('Work'), id('Learning')])
    await notes[5].related('labels').attach([id('Health'), id('Personal')])
  }
}
