import type { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'

export default class ProjectsController {
  async index({ inertia, request, auth, response }: HttpContext) {
    if (!auth.isAuthenticated) {
      return response.redirect('/projects/auth')
    }

    const page = request.input('page', 1)
    const limit = 5
    const user = auth.getUserOrFail()

    const projects = await Project.query()
      .where('user_id', user.id)
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    return inertia.render('projects/index', {
      projects,
      authUser: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    })
  }

  async store({ request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const { title, description, status } = request.only(['title', 'description', 'status'])

    await Project.create({
      title,
      description,
      status,
      user_id: user.id,
    } as any)

    return response.redirect().back()
  }

  async update({ params, request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()

    const project = await Project.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .firstOrFail()

    const data = request.only(['title', 'description', 'status'])
    await project.merge(data).save()

    return response.redirect().back()
  }

  async destroy({ params, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()

    const project = await Project.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .firstOrFail()

    await project.delete()

    return response.redirect().back()
  }
}
