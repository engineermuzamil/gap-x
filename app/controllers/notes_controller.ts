import { HttpContext } from '@adonisjs/core/http'
import Note from '#models/note'

export default class NotesController {
  async index({ inertia }: HttpContext) {
    const notes = await Note.all()
    return inertia.render('notes/index' as any, { notes } as any)
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['title', 'content', 'pinned'])
    await Note.create(data)
    return response.redirect().back()
  }

  async update({ params, request, response }: HttpContext) {
    const note = await Note.find(params.id)
    if (!note) {
      return response.notFound({ message: 'Note not found' })
    }
    const data = request.only(['title', 'content', 'pinned'])
    await note.merge(data).save()
    return response.redirect().back()
  }

  async destroy({ params, response }: HttpContext) {
    const note = await Note.find(params.id)
    if (!note) {
      return response.notFound({ message: 'Note not found' })
    }
    await note.delete()
    return response.redirect().back()
  }
}
