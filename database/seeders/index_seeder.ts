import { BaseSeeder } from '@adonisjs/lucid/seeders'
import UserSeeder from './user_seeder.ts'
import LabelSeeder from './label_seeder.ts'
import NoteSeeder from './note_seeder.ts'
import TodoSeeder from './todo_seeder.ts'

export default class IndexSeeder extends BaseSeeder {
  async run() {
    await new UserSeeder(this.client).run()
    await new LabelSeeder(this.client).run()
    await new NoteSeeder(this.client).run()
    await new TodoSeeder(this.client).run()

    console.log('✅ All seeders complete')
  }
}
