import { HttpContext } from '@adonisjs/core/http'
import Note from '#models/note'
import Label from '#models/label'

export default class NotesController {
  async index({ inertia }: HttpContext) {
    const [notes, labels] = await Promise.all([
      Note.query().preload('labels').orderBy('created_at', 'desc'),
      Label.all(),
    ])

    const serialized = notes.map((note) => ({
      ...note.serialize(),
      pinned: Boolean(note.pinned),
    }))

    return inertia.render('notes/index', { notes: serialized, labels } as never)
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['title', 'content', 'pinned'])
    const labelIds: number[] = request.input('labelIds', [])

    const note = await Note.create(data)

    // Attach the selected labels to the note via the pivot table
    if (labelIds.length > 0) {
      await note.related('labels').attach(labelIds)
    }

    return response.redirect().back()
  }

  async update({ params, request, response }: HttpContext) {
    const note = await Note.find(params.id)
    if (!note) {
      return response.notFound({ message: 'Note not found' })
    }

    const data = request.only(['title', 'content', 'pinned'])
    const labelIds: number[] = request.input('labelIds', [])

    await note.merge(data).save()

    // sync() replaces all existing pivot records with the new set
    // Pass an empty array to remove all labels when none are selected
    await note.related('labels').sync(labelIds)

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
