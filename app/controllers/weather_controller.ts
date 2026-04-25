import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'

export default class WeatherController {
  async show({ request, response }: HttpContext) {
    const apiKey = env.get('WEATHER_API_KEY')

    let lat = request.input('lat')
    let lon = request.input('lon')

    // --- Fallback: use ipinfo.io if no coords provided ---
    if (!lat || !lon) {
      const ipinfoToken = env.get('IPINFO_TOKEN')
      const ipRes = await fetch(`https://ipinfo.io/json?token=${ipinfoToken}`)
      const ipData = (await ipRes.json()) as { loc: string; status?: string }

      if (!ipData.loc) {
        return response.status(400).json({ error: 'Could not determine location' })
      }

      // ipinfo returns loc as "latitude,longitude" e.g. "27.70,68.85"
      const [ipLat, ipLon] = ipData.loc.split(',')
      lat = ipLat
      lon = ipLon
    }

    // --- Fetch weather from OpenWeatherMap ---
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`

    const weatherRes = await fetch(weatherUrl)

    if (!weatherRes.ok) {
      return response.status(500).json({ error: 'Failed to fetch weather data' })
    }

    const weatherData = (await weatherRes.json()) as {
      name: string
      main: { temp: number; feels_like: number; humidity: number }
      weather: { description: string; icon: string }[]
      wind: { speed: number }
    }

    return response.json({
      city: weatherData.name,
      temp: Math.round(weatherData.main.temp),
      feelsLike: Math.round(weatherData.main.feels_like),
      humidity: weatherData.main.humidity,
      condition: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
      windSpeed: weatherData.wind.speed,
    })
  }
}
