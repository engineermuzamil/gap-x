import { useEffect, useState } from 'react'
import { Wind, Droplets, Thermometer, MapPin, RefreshCw } from 'lucide-react'

// This is the shape of data we get back from our /weather endpoint
interface WeatherData {
  city: string
  temp: number
  feelsLike: number
  humidity: number
  condition: string
  icon: string
  windSpeed: number
}

export default function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch weather — tries GPS first, then falls back to IP location
  const fetchWeather = (lat?: number, lon?: number) => {
    setLoading(true)
    setError(null)

    // Build URL with or without coords
    const url = lat && lon ? `/weather?lat=${lat}&lon=${lon}` : '/weather'

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Weather fetch failed')
        return res.json() as Promise<WeatherData>
      })
      .then((data) => {
        setWeather(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Could not load weather')
        setLoading(false)
      })
  }

  useEffect(() => {
    // Ask the browser for GPS coordinates
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // Success: we have GPS coords
        (pos) => {
          fetchWeather(pos.coords.latitude, pos.coords.longitude)
        },
        // Denied or error: fall back to IP-based location
        () => {
          fetchWeather()
        }
      )
    } else {
      // Browser doesn't support geolocation at all
      fetchWeather()
    }
  }, [])

  // --- Loading state ---
  if (loading) {
    return (
      <div className="bg-[#2C2C2E] p-6 rounded-xl animate-pulse">
        <div className="h-5 w-24 bg-[#3A3A3C] rounded mb-4" />
        <div className="h-10 w-20 bg-[#3A3A3C] rounded mb-2" />
        <div className="h-4 w-32 bg-[#3A3A3C] rounded" />
      </div>
    )
  }

  // --- Error state ---
  if (error || !weather) {
    return (
      <div className="bg-[#2C2C2E] p-6 rounded-xl">
        <p className="text-gray-400 text-sm">{error ?? 'No weather data'}</p>
        <button
          onClick={() => fetchWeather()}
          className="mt-2 text-[#0A84FF] text-sm flex items-center gap-1 hover:underline"
        >
          <RefreshCw size={13} /> Try again
        </button>
      </div>
    )
  }

  // Icon URL from OpenWeatherMap
  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`

  // Capitalize condition text e.g. "clear sky" → "Clear sky"
  const conditionLabel = weather.condition.charAt(0).toUpperCase() + weather.condition.slice(1)

  return (
    <div className="bg-[#2C2C2E] p-6 rounded-xl hover:bg-[#3C3C3E] transition-colors duration-200">
      {/* City name */}
      <div className="flex items-center gap-1.5 text-gray-400 mb-3">
        <MapPin size={14} />
        <span className="text-sm">{weather.city}</span>
      </div>

      {/* Main temp + icon */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-5xl font-bold">{weather.temp}°C</span>
        <img src={iconUrl} alt={conditionLabel} className="w-16 h-16" />
      </div>

      {/* Condition label */}
      <p className="text-gray-300 text-sm mb-4 capitalize">{conditionLabel}</p>

      {/* Extra stats row */}
      <div className="flex gap-4 text-xs text-gray-400 border-t border-[#3A3A3C] pt-4">
        <div className="flex items-center gap-1">
          <Thermometer size={13} />
          <span>Feels {weather.feelsLike}°C</span>
        </div>
        <div className="flex items-center gap-1">
          <Droplets size={13} />
          <span>{weather.humidity}%</span>
        </div>
        <div className="flex items-center gap-1">
          <Wind size={13} />
          <span>{weather.windSpeed} m/s</span>
        </div>
      </div>
    </div>
  )
}
