import { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'

export default class ProjectsController {
  async index({ inertia, request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 5

    const projects = await Project.query().orderBy('created_at', 'desc').paginate(page, limit)

    return inertia.render('projects/index' as any, { projects } as any)
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['title', 'description', 'status'])
    await Project.create(data)
    return response.redirect().back()
  }

  async update({ params, request, response }: HttpContext) {
    const project = await Project.find(params.id)
    if (!project) {
      return response.notFound({ message: 'Project not found' })
    }
    const data = request.only(['title', 'description', 'status'])
    await project.merge(data).save()
    return response.redirect().back()
  }

  async destroy({ params, response }: HttpContext) {
    const project = await Project.find(params.id)
    if (!project) {
      return response.notFound({ message: 'Project not found' })
    }
    await project.delete()
    return response.redirect().back()
  }
}
