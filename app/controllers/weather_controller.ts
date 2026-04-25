import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'

// ── In-memory cache ───────────────────────────────────────────────────────────
// We store weather responses here so we don't call OpenWeatherMap on every
// page load. Cache expires after 30 minutes per location.
//
// Key   = "lat,lon" rounded to 2 decimal places e.g. "27.71,68.86"
// Value = the weather data + the time we fetched it

interface WeatherData {
  city: string
  temp: number
  feelsLike: number
  humidity: number
  condition: string
  icon: string
  windSpeed: number
}

interface CacheEntry {
  data: WeatherData
  fetchedAt: number // timestamp in ms from Date.now()
}

// This Map lives in memory for as long as the server is running
const weatherCache = new Map<string, CacheEntry>()

// 30 minutes in milliseconds
const CACHE_TTL = 30 * 60 * 1000

export default class WeatherController {
  async show({ request, response }: HttpContext) {
    const apiKey = env.get('WEATHER_API_KEY')
    const ipinfoToken = env.get('IPINFO_TOKEN')

    let lat = request.input('lat')
    let lon = request.input('lon')

    // ── Step 1: IP fallback if no coords sent ─────────────────────────────────
    // The frontend only sends lat/lon when it has GPS permission.
    // If not, we use ipinfo.io to guess location from the server IP.
    if (!lat || !lon) {
      try {
        const ipRes = await fetch(`https://ipinfo.io/json?token=${ipinfoToken}`)
        const ipData = (await ipRes.json()) as { loc?: string }

        if (ipData.loc) {
          // loc comes as "27.70,68.85" — split into lat and lon
          const [ipLat, ipLon] = ipData.loc.split(',')
          lat = ipLat
          lon = ipLon
        } else {
          return response.status(400).json({ error: 'Could not determine location' })
        }
        console.log('ipinfo response:', ipData)
        console.log('Using coords:', lat, lon)
      } catch {
        return response.status(500).json({ error: 'Location lookup failed' })
      }
    }

    // ── Step 2: Round coords to 2 decimals for cache key ─────────────────────
    // e.g. 27.7051 → "27.71"  — close enough for weather, avoids cache misses
    // from tiny GPS movements
    const roundedLat = parseFloat(lat).toFixed(2)
    const roundedLon = parseFloat(lon).toFixed(2)
    const cacheKey = `${roundedLat},${roundedLon}`

    // ── Step 3: Check cache ───────────────────────────────────────────────────
    const cached = weatherCache.get(cacheKey)
    const now = Date.now()

    console.log('Cached: ', cached)
    if (cached && now - cached.fetchedAt < CACHE_TTL) {
      // Cache hit — return stored data, skip the API call
      const ageMinutes = Math.floor((now - cached.fetchedAt) / 60000)
      const ageSeconds = Math.floor(((now - cached.fetchedAt) % 60000) / 1000)
      console.log(`[Weather] Cache hit for ${cacheKey} (${ageMinutes}m ${ageSeconds}s old)`)
      return response.json(cached.data)
    }

    // ── Step 4: Cache miss — fetch fresh data from OpenWeatherMap ─────────────
    console.log(`[Weather] Cache miss for ${cacheKey} — fetching fresh data`)

    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      const weatherRes = await fetch(weatherUrl)

      if (!weatherRes.ok) {
        return response.status(500).json({ error: 'Weather data unavailable, try again later.' })
      }

      console.log('weather response status:', weatherRes.status)
      console.log('weather data:', weatherRes)

      const raw = (await weatherRes.json()) as {
        name: string
        main: { temp: number; feels_like: number; humidity: number }
        weather: { description: string; icon: string }[]
        wind: { speed: number }
      }

      const data: WeatherData = {
        city: raw.name,
        temp: Math.round(raw.main.temp),
        feelsLike: Math.round(raw.main.feels_like),
        humidity: raw.main.humidity,
        condition: raw.weather[0].description,
        icon: raw.weather[0].icon,
        windSpeed: raw.wind.speed,
      }

      // ── Step 5: Store in cache before returning ───────────────────────────
      weatherCache.set(cacheKey, { data, fetchedAt: now })
      console.log(`[Weather] Cached data for ${cacheKey}`)

      return response.json(data)
    } catch {
      return response.status(500).json({ error: 'Weather data unavailable, try again later.' })
    }
  }
}
