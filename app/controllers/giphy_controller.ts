import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'

interface GiphyResult {
  id: string
  title: string
  images: {
    fixed_height: { url: string }
    original: { url: string }
  }
}

export default class GiphyController {
  async search({ request, response }: HttpContext) {
    const apiKey = env.get('GIPHY_API_KEY')
    const q = request.input('q', '').trim()

    if (!q) {
      return response.badRequest({ error: 'Search query is required' })
    }

    const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(q)}&limit=12&rating=g`

    // Log to terminal so you can see the request happening
    console.log('[Giphy] Fetching:', url.replace(apiKey, 'HIDDEN'))

    const res = await fetch(url)

    // Log the status — if 401 your API key is wrong, if 200 it worked
    console.log('[Giphy] Response status:', res.status)

    if (!res.ok) {
      const errorBody = await res.text()
      console.error('[Giphy] Error body:', errorBody)
      return response.status(500).json({ error: `Giphy API error: ${res.status}` })
    }

    const json = (await res.json()) as { data: GiphyResult[] }

    console.log('[Giphy] GIFs returned:', json.data.length)

    const gifs = json.data.map((gif) => ({
      id: gif.id,
      title: gif.title,
      previewUrl: gif.images.fixed_height.url,
      originalUrl: gif.images.original.url,
    }))

    return response.json({ gifs })
  }
}
