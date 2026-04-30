import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Label from '#models/label'

export default class LabelSeeder extends BaseSeeder {
  async run() {
    await Label.updateOrCreateMany('name', [
      { name: 'Work' },
      { name: 'Personal' },
      { name: 'Learning' },
      { name: 'Ideas' },
      { name: 'Finance' },
      { name: 'Health' },
      { name: 'Design' },
    ])

    console.log('✅ Labels seeded')
  }
}
