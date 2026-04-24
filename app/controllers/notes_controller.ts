import { HttpContext } from '@adonisjs/core/http'
import Note from '#models/note'
import Label from '#models/label'
import { uploadToCloudinary, deleteFromCloudinary } from '#services/cloudinary_service'

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

  async uploadImage({ request, response }: HttpContext) {
    const imageFile = request.file('image', {
      size: '5mb',
      extnames: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    })

    if (!imageFile) {
      return response.badRequest({ error: 'No file uploaded' })
    }

    if (!imageFile.isValid) {
      return response.badRequest({ errors: imageFile.errors })
    }

    const imageUrl = await uploadToCloudinary(imageFile.tmpPath!)

    return response.ok({
      message: 'Image uploaded successfully!',
      url: imageUrl,
    })
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['title', 'content', 'pinned'])
    const labelIds: number[] = request.input('labelIds', [])

    const imageUrl: string | null = request.input('imageUrl', null)

    const note = await Note.create({ ...data, imageUrl })

    if (labelIds.length > 0) {
      await note.related('labels').attach(labelIds)
    }

    return response.redirect().back()
  }

  async update({ params, request, response }: HttpContext) {
    const note = await Note.find(params.id)
    if (!note) return response.notFound({ message: 'Note not found' })

    const data = request.only(['title', 'content', 'pinned'])
    const labelIds: number[] = request.input('labelIds', [])
    const imageUrl: string | null = request.input('imageUrl', null)
    const removeImage: boolean = request.input('removeImage', false)

    if (imageUrl && imageUrl !== note.imageUrl) {
      if (note.imageUrl) await deleteFromCloudinary(note.imageUrl)
      await note.merge({ ...data, imageUrl }).save()
    } else if (removeImage && note.imageUrl) {
      await deleteFromCloudinary(note.imageUrl)
      await note.merge({ ...data, imageUrl: null }).save()
    } else {
      await note.merge(data).save()
    }

    await note.related('labels').sync(labelIds)

    return response.redirect().back()
  }

  async destroy({ params, response }: HttpContext) {
    const note = await Note.find(params.id)
    if (!note) return response.notFound({ message: 'Note not found' })

    if (note.imageUrl) await deleteFromCloudinary(note.imageUrl)

    await note.delete()
    return response.redirect().back()
  }
}
