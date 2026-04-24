import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class AuthUserSeeder extends BaseSeeder {
  async run() {
    const users = [
      {
        email: 'notes@gap.com',
        fullName: 'Notes User',
        password: 'notes123',
      },
      {
        email: 'notes1@gap.com',
        fullName: 'Notes 1',
        password: 'notes123',
      },
      {
        email: 'notes2@gap.com',
        fullName: 'Notes 2',
        password: 'notes123',
      },
      {
        email: 'todos@gap.com',
        fullName: 'Todos User',
        password: 'todos123',
      },
      {
        email: 'todos1@gap.com',
        fullName: 'Todos 1',
        password: 'todos123',
      },
      {
        email: 'todos2@gap.com',
        fullName: 'Todos 2',
        password: 'todos123',
      },
    ]

    for (const userData of users) {
      const existingUser = await User.findBy('email', userData.email)

      if (existingUser) {
        await existingUser.delete()
      }

      await User.create(userData)
    }
  }
}
