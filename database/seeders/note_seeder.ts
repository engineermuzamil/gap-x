import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Note from '#models/note'
import Label from '#models/label'
import User from '#models/user'

export default class NoteSeeder extends BaseSeeder {
  async run() {
    const notesUser = await User.findByOrFail('email', 'notes@gap.com')
    const notesUserOne = await User.findByOrFail('email', 'notes1@gap.com')
    const notesUserTwo = await User.findByOrFail('email', 'notes2@gap.com')

    // Fetch all labels by name so we can attach them by ID
    const labels = await Label.all()

    // Helper: find a label's id by name
    const id = (name: string) => labels.find((l) => l.name === name)!.id

    const createNote = async ({
      title,
      content,
      pinned,
      userId,
      labelNames,
    }: {
      title: string
      content: string
      pinned: boolean
      userId: number
      labelNames: string[]
    }) => {
      const note = await Note.create({ title, content, pinned, userId })
      await note.related('labels').attach(labelNames.map(id))
      return note
    }

    await createNote({
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
      userId: notesUser.id,
      labelNames: ['Learning', 'Work'],
    })

    await createNote({
      title: 'MVC Architecture',
      content: `## Model → View → Controller

| Layer | Role |
|-------|------|
| **Model** | Database interactions via Lucid ORM |
| **Controller** | Handles requests, applies logic |
| **View** | React components via Inertia.js |

No separate REST API needed — Inertia bridges backend and frontend directly.`,
      pinned: true,
      userId: notesUser.id,
      labelNames: ['Learning'],
    })

    await createNote({
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
      userId: notesUser.id,
      labelNames: ['Learning'],
    })

    await createNote({
      title: 'Inertia.js Flow',
      content: `## How Inertia Works

1. User visits \`/notes\`
2. AdonisJS controller fetches data
3. Controller calls \`inertia.render('notes/index', { notes })\`
4. React component receives \`notes\` as props

**No fetch. No axios. No REST API.**`,
      pinned: false,
      userId: notesUser.id,
      labelNames: ['Learning', 'Ideas'],
    })

    await createNote({
      title: 'Migrations Cheatsheet',
      content: `## Migration Commands

| Command | Description |
|---------|-------------|
| \`node ace migration:run\` | Run pending migrations |
| \`node ace migration:rollback\` | Undo last batch |
| \`node ace migration:fresh\` | Drop all & re-run |
| \`node ace migration:fresh --seed\` | Fresh + seed |`,
      pinned: false,
      userId: notesUser.id,
      labelNames: ['Work', 'Learning'],
    })

    await createNote({
      title: 'Healthy Habits Tracker',
      content: `## Daily Goals

- [ ] Drink 8 glasses of water
- [ ] 30 min walk or workout
- [ ] Sleep before midnight
- [ ] No screens 1hr before bed

> Small consistent habits beat big sporadic efforts.`,
      pinned: false,
      userId: notesUser.id,
      labelNames: ['Health', 'Personal'],
    })

    await createNote({
      title: 'Groceries for the Week',
      content: `Milk
Eggs
Bread
Bananas
Chicken
Coffee beans`,
      pinned: false,
      userId: notesUserOne.id,
      labelNames: ['Personal'],
    })

    await createNote({
      title: 'Call Ammi on Sunday',
      content: `Remember to call around 7 pm after dinner.

Ask about:
- doctor appointment
- electricity bill
- weekend plan`,
      pinned: true,
      userId: notesUserOne.id,
      labelNames: ['Personal'],
    })

    await createNote({
      title: 'Room Setup Ideas',
      content: `Need a cleaner desk layout.

Maybe add:
- warm desk lamp
- cable organizer
- small plant near monitor`,
      pinned: false,
      userId: notesUserOne.id,
      labelNames: ['Ideas', 'Personal'],
    })

    await createNote({
      title: 'Frontend Fixes',
      content: `## Next UI fixes

- align the notes toolbar on mobile
- improve empty state spacing
- keep button sizes consistent

\`\`\`tsx
<button className="rounded-lg px-3 py-2">Save</button>
\`\`\``,
      pinned: false,
      userId: notesUserOne.id,
      labelNames: ['Work', 'Learning'],
    })

    await createNote({
      title: 'Meeting Notes',
      content: `Standup highlights:

Ali will finish auth routes.
Sana is handling the labels cleanup.
I need to test note sharing before tomorrow.`,
      pinned: true,
      userId: notesUserTwo.id,
      labelNames: ['Work'],
    })

    await createNote({
      title: 'Weekend Plan',
      content: `Saturday:
- breakfast out
- buy shoes
- clean room

Sunday:
- finish assignment
- family dinner`,
      pinned: false,
      userId: notesUserTwo.id,
      labelNames: ['Personal'],
    })

    await createNote({
      title: 'API Reminder',
      content: `Use the token in the Authorization header.

\`\`\`
Authorization: Bearer <token>
\`\`\`

Do not pass tokens in query params.`,
      pinned: false,
      userId: notesUserTwo.id,
      labelNames: ['Learning', 'Work'],
    })

    await createNote({
      title: 'Random Thought',
      content: `A simple notes app becomes much more useful once sharing, labels, and auth are added step by step.`,
      pinned: false,
      userId: notesUserTwo.id,
      labelNames: ['Ideas'],
    })
  }
}
