import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Label from '#models/label'

export default class LabelSeeder extends BaseSeeder {
  async run() {
    await Label.createMany([
      { name: 'Work' },
      { name: 'Personal' },
      { name: 'Urgent' },
      { name: 'Learning' },
      { name: 'Ideas' },
      { name: 'Health' },
    ])
  }
}
