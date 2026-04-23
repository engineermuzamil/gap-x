// database/seeders/project_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Project from '#models/project'

export default class ProjectSeeder extends BaseSeeder {
  async run() {
    await Project.createMany([
      {
        title: 'Build an AdonisJS App',
        description: 'Develop a full-stack app using AdonisJS and Inertia.js.',
        status: 'completed',
      },
      {
        title: 'Write API Documentation',
        description: 'Document all API endpoints for better maintainability.',
        status: 'in-progress',
      },
      {
        title: 'Deploy the Application',
        description: 'Deploy the project to a cloud provider.',
        status: 'pending',
      },
      {
        title: 'Setup CI/CD Pipeline',
        description: 'Automate testing and deployment using GitHub Actions.',
        status: 'pending',
      },
      {
        title: 'Write Unit Tests',
        description: 'Cover all critical paths with unit and functional tests.',
        status: 'in-progress',
      },
      {
        title: 'Setup CI/CD Pipeline',
        description: 'Automate testing and deployment using GitHub Actions.',
        status: 'pending',
      },
      {
        title: 'Deploy the Application',
        description: 'Deploy the project to a cloud provider.',
        status: 'pending',
      },
    ])
  }
}
