// database/seeders/project_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Project from '#models/project'
import User from '#models/user'

export default class ProjectSeeder extends BaseSeeder {
  async run() {
    const email = 'muzamilmemon315@gmail.com'

    const user = await User.firstOrCreate(
      { email },
      {
        email,
        fullName: 'Muzamil Memon',
        password: 'projects123',
      }
    )

    await Project.query().where('user_id', user.id).delete()

    await Project.createMany([
      {
        title: 'Build an AdonisJS App',
        description: 'Develop a full-stack app using AdonisJS and Inertia.js.',
        status: 'completed',
        userId: user.id,
      },
      {
        title: 'Write API Documentation',
        description: 'Document all API endpoints for better maintainability.',
        status: 'in-progress',
        userId: user.id,
      },
      {
        title: 'Deploy the Application',
        description: 'Deploy the project to a cloud provider.',
        status: 'pending',
        userId: user.id,
      },
      {
        title: 'Setup CI/CD Pipeline',
        description: 'Automate testing and deployment using GitHub Actions.',
        status: 'pending',
        userId: user.id,
      },
      {
        title: 'Write Unit Tests',
        description: 'Cover all critical paths with unit and functional tests.',
        status: 'in-progress',
        userId: user.id,
      },
      {
        title: 'Setup CI/CD Pipeline',
        description: 'Automate testing and deployment using GitHub Actions.',
        status: 'pending',
        userId: user.id,
      },
      {
        title: 'Deploy the Application',
        description: 'Deploy the project to a cloud provider.',
        status: 'pending',
        userId: user.id,
      },
    ])
  }
}
