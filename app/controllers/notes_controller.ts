import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import { randomUUID } from 'node:crypto'
import Note from '#models/note'
import Label from '#models/label'
import { uploadToCloudinary, deleteFromCloudinary } from '#services/cloudinary_service'

export default class NotesController {
  async index({ auth, inertia }: HttpContext) {
    const user = auth.getUserOrFail()

    const [notes, trashedNotes, labels] = await Promise.all([
      // active notes only — exclude soft deleted
      Note.query()
        .where('user_id', user.id)
        .whereNull('deleted_at')
        .preload('labels')
        .orderBy('created_at', 'desc'),

      // soft deleted notes only
      Note.query()
        .where('user_id', user.id)
        .whereNotNull('deleted_at')
        .preload('labels')
        .orderBy('deleted_at', 'desc'),

      Label.all(),
    ])

    const serialize = (note: Note) => ({
      ...note.serialize(),
      pinned: Boolean(note.pinned),
    })

    return inertia.render('notes/index', {
      notes: notes.map(serialize),
      trashedNotes: trashedNotes.map(serialize),
      labels,
    } as never)
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

  async store({ auth, request, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = request.only(['title', 'content', 'pinned'])
    const labelIds: number[] = request.input('labelIds', [])
    const imageUrl: string | null = request.input('imageUrl', null)

    if (labelIds.length > 0) {
      const validLabels = await Label.query().whereIn('id', labelIds)
      if (validLabels.length !== labelIds.length) {
        return response.badRequest({ error: 'One or more label IDs are invalid' })
      }
    }

    const note = await Note.create({ ...data, imageUrl, userId: user.id })

    if (labelIds.length > 0) {
      await note.related('labels').attach(labelIds)
    }

    session.flash('success', 'Note created')
    return response.redirect().back()
  }

  async update({ auth, params, request, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const note = await Note.query()
      .where('user_id', user.id)
      .whereNull('deleted_at')
      .where('id', params.id)
      .firstOrFail()

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

    session.flash(
      'success',
      pinToggle ? (data.pinned ? 'Note pinned' : 'Note unpinned') : 'Note updated'
    )

    return response.redirect().back()
  }

  // Soft delete — sets deleted_at, keeps the record in the database
  async destroy({ auth, params, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const note = await Note.query()
      .where('user_id', user.id)
      .whereNull('deleted_at')
      .where('id', params.id)
      .firstOrFail()

    note.deletedAt = DateTime.now()
    await note.save()

    session.flash('success', 'Note moved to trash')
    return response.redirect().back()
  }

  // Restore — clears deleted_at, brings note back to active
  async restore({ auth, params, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const note = await Note.query()
      .where('user_id', user.id)
      .whereNotNull('deleted_at')
      .where('id', params.id)
      .firstOrFail()

    note.deletedAt = null
    await note.save()

    session.flash('success', 'Note restored')
    return response.redirect().back()
  }

  // Permanent delete — only works on already soft-deleted notes
  async forceDestroy({ auth, params, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const note = await Note.query()
      .where('user_id', user.id)
      .whereNotNull('deleted_at')
      .where('id', params.id)
      .firstOrFail()

    if (note.imageUrl) await deleteFromCloudinary(note.imageUrl)
    await note.delete()

    session.flash('success', 'Note permanently deleted')
    return response.redirect().back()
  }

  async share({ auth, params, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const note = await Note.query()
      .where('user_id', user.id)
      .whereNull('deleted_at')
      .where('id', params.id)
      .firstOrFail()

    if (!note.shareToken) {
      note.shareToken = randomUUID()
      await note.save()
    }

    session.flash('success', 'Note is now shared')
    return response.redirect().back()
  }

  async unshare({ auth, params, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const note = await Note.query()
      .where('user_id', user.id)
      .whereNull('deleted_at')
      .where('id', params.id)
      .firstOrFail()

    note.shareToken = null
    await note.save()

    session.flash('success', 'Sharing revoked')
    return response.redirect().back()
  }

  async showShared({ params, inertia, response }: HttpContext) {
    const note = await Note.query()
      .whereNull('deleted_at')
      .where('share_token', params.token)
      .preload('labels')
      .first()

    if (!note) {
      return response.notFound({ error: 'This shared note does not exist or the link has expired' })
    }

    return inertia.render('notes/shared-note', {
      note: { ...note.serialize(), pinned: Boolean(note.pinned) },
    } as never)
  }
}
