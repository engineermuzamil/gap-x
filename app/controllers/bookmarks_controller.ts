import { HttpContext } from '@adonisjs/core/http'
import { z } from 'zod'
import Bookmark from '#models/bookmark'
import { fetchOgData } from '#services/og_service'
import { generateLabel, generateTldr } from '#services/gemini_service'

const bookmarkSchema = z.object({
  url: z.string().min(1, 'URL is required').url('Please enter a valid URL (include https://)'),
})

export default class BookmarksController {
  async index({ auth, inertia }: HttpContext) {
    const user = auth.getUserOrFail()

    const bookmarks = await Bookmark.query().where('user_id', user.id).orderBy('created_at', 'desc')

    return inertia.render('bookmarks/index', {
      bookmarks: bookmarks.map((b) => b.serialize()),
    } as never)
  }

  async store({ auth, request, response, session }: HttpContext) {
    const user = auth.getUserOrFail()

    const parsed = bookmarkSchema.safeParse(request.only(['url']))
    if (!parsed.success) {
      session.flash('error', parsed.error.issues[0].message)
      return response.redirect().back()
    }

    const { url } = parsed.data

    const ogData = await fetchOgData(url)

    const aiLabel = await generateLabel(ogData.title, ogData.description)

    await Bookmark.create({
      userId: user.id,
      url,
      title: ogData.title,
      description: ogData.description,
      imageUrl: ogData.imageUrl,
      siteName: ogData.siteName,
      aiLabel,
      tldr: null,
    })

    session.flash('success', 'Bookmark saved!')
    return response.redirect().back()
  }

  async destroy({ auth, params, response, session }: HttpContext) {
    const user = auth.getUserOrFail()

    const bookmark = await Bookmark.query()
      .where('user_id', user.id)
      .where('id', params.id)
      .firstOrFail()

    await bookmark.delete()

    session.flash('success', 'Bookmark removed')
    return response.redirect().back()
  }

  async generateTldr({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const bookmark = await Bookmark.query()
      .where('user_id', user.id)
      .where('id', params.id)
      .firstOrFail()

    if (bookmark.tldr) {
      return response.ok({ tldr: bookmark.tldr })
    }

    const tldr = await generateTldr(bookmark.title, bookmark.description, bookmark.url)

    if (!tldr) {
      return response.serviceUnavailable({
        error: 'Could not generate a summary right now. Please try again.',
      })
    }

    bookmark.tldr = tldr
    await bookmark.save()

    return response.ok({ tldr })
  }
}
