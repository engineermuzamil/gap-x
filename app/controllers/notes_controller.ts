import { HttpContext } from '@adonisjs/core/http'
import { randomUUID } from 'node:crypto'
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
      return response.badRequest({
        error: 'Invalid file',
        details: imageFile.errors.map((e) => e.message),
      })
    }

    const imageUrl = await uploadToCloudinary(imageFile.tmpPath!)
    return response.ok({ url: imageUrl })
  }

  async store({ request, response, session }: HttpContext) {
    const data = request.only(['title', 'content', 'pinned'])
    const labelIds: number[] = request.input('labelIds', [])
    const imageUrl: string | null = request.input('imageUrl', null)

    if (labelIds.length > 0) {
      const validLabels = await Label.query().whereIn('id', labelIds)
      if (validLabels.length !== labelIds.length) {
        return response.badRequest({ error: 'One or more label IDs are invalid' })
      }
    }

    const note = await Note.create({ ...data, imageUrl })
    if (labelIds.length > 0) {
      await note.related('labels').attach(labelIds)
    }

    session.flash('success', 'Note created')
    return response.redirect().back()
  }

  async update({ params, request, response, session }: HttpContext) {
    const note = await Note.find(params.id)
    if (!note) {
      return response.notFound({ error: `Note with ID ${params.id} not found` })
    }

    const data = request.only(['title', 'content', 'pinned'])
    const labelIds: number[] = request.input('labelIds', [])
    const imageUrl: string | null = request.input('imageUrl', null)
    const removeImage: boolean = request.input('removeImage', false)
    const pinToggle: boolean = request.input('pinToggle', false)

    if (labelIds.length > 0) {
      const validLabels = await Label.query().whereIn('id', labelIds)
      if (validLabels.length !== labelIds.length) {
        return response.badRequest({ error: 'One or more label IDs are invalid' })
      }
    }

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

    if (pinToggle) {
      session.flash('success', data.pinned ? 'Note pinned' : 'Note unpinned')
    } else {
      session.flash('success', 'Note updated')
    }

    return response.redirect().back()
  }

  async destroy({ params, response, session }: HttpContext) {
    const note = await Note.find(params.id)
    if (!note) {
      return response.notFound({ error: `Note with ID ${params.id} not found` })
    }

    if (note.imageUrl) await deleteFromCloudinary(note.imageUrl)
    await note.delete()

    session.flash('success', 'Note deleted')
    return response.redirect().back()
  }

  async share({ params, response, session }: HttpContext) {
    const note = await Note.find(params.id)
    if (!note) {
      return response.notFound({ error: `Note with ID ${params.id} not found` })
    }

    if (!note.shareToken) {
      note.shareToken = randomUUID()
      await note.save()
    }

    session.flash('success', 'Note is now shared')
    return response.redirect().back()
  }

  async unshare({ params, response, session }: HttpContext) {
    const note = await Note.find(params.id)
    if (!note) {
      return response.notFound({ error: `Note with ID ${params.id} not found` })
    }

    note.shareToken = null
    await note.save()

    session.flash('success', 'Sharing revoked')
    return response.redirect().back()
  }

  async showShared({ params, inertia, response }: HttpContext) {
    const note = await Note.query().where('share_token', params.token).preload('labels').first()

    if (!note) {
      return response.notFound({ error: 'This shared note does not exist or the link has expired' })
    }

    return inertia.render('notes/shared-note', {
      note: { ...note.serialize(), pinned: Boolean(note.pinned) },
    } as never)
  }
}
