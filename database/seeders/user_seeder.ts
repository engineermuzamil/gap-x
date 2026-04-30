import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class UserSeeder extends BaseSeeder {
  async run() {
    await User.updateOrCreate(
      { email: 'user@gap.com' },
      {
        fullName: 'Gap User',
        email: 'user@gap.com',
        password: 'user123',
      }
    )

    console.log('✅ User seeded — user@gap.com / user123')
  }
}
