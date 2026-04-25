import { useEffect, useState } from 'react'
import { Wind, Droplets, Thermometer, MapPin, RefreshCw } from 'lucide-react'

interface WeatherData {
  city: string
  temp: number
  feelsLike: number
  humidity: number
  condition: string
  icon: string
  windSpeed: number
}

// ── localStorage cache helpers ────────────────────────────────────────────────
// We cache the last weather response in localStorage with a timestamp.
// If the cached data is less than 30 minutes old, we use it directly
// and skip the /weather API call entirely.

const CACHE_KEY = 'weather_cache'
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes in ms

interface LocalCache {
  data: WeatherData
  savedAt: number
}

function getLocalCache(): WeatherData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null

    const parsed: LocalCache = JSON.parse(raw)
    const age = Date.now() - parsed.savedAt

    if (age < CACHE_TTL) {
      console.log(`[WeatherCard] Using localStorage cache (${Math.floor(age / 60000)}m old)`)
      return parsed.data
    }

    // Cache is too old — remove it
    localStorage.removeItem(CACHE_KEY)
    return null
  } catch {
    return null
  }
}

function saveLocalCache(data: WeatherData) {
  try {
    const entry: LocalCache = { data, savedAt: Date.now() }
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry))
  } catch {
    // localStorage might be blocked in some browsers — safe to ignore
  }
}

export default function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ── Fetch from /weather endpoint ─────────────────────────────────────────
  const fetchWeather = async (lat?: number, lon?: number) => {
    setLoading(true)
    setError(null)

    try {
      const url =
        lat !== undefined && lon !== undefined ? `/weather?lat=${lat}&lon=${lon}` : '/weather'

      const res = await fetch(url)

      if (!res.ok) throw new Error('Weather fetch failed')

      const data = (await res.json()) as WeatherData

      // Save to localStorage so next load within 30 mins skips the API call
      saveLocalCache(data)
      setWeather(data)
    } catch {
      setError('Weather data unavailable, try again later.')
    } finally {
      setLoading(false)
    }
  }

  // ── Smart location handler ────────────────────────────────────────────────
  // Pro tip: check permission BEFORE asking for GPS
  // - "granted"  → use GPS directly, no popup
  // - "denied"   → skip GPS entirely, go straight to IP fallback
  // - "prompt"   → ask the user normally
  const initWeather = async () => {
    // Step 1: Check localStorage cache first — skip everything if fresh
    const cached = getLocalCache()
    if (cached) {
      setWeather(cached)
      setLoading(false)
      return
    }

    // Step 2: Check geolocation permission state before doing anything
    if (!navigator.geolocation) {
      // Browser doesn't support geolocation at all
      fetchWeather()
      return
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' })

      if (permission.state === 'denied') {
        // User already denied — don't bother asking, go straight to IP fallback
        console.log('[WeatherCard] Geolocation denied — using IP fallback')
        fetchWeather()
        return
      }

      // "granted" or "prompt" — attempt GPS
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // GPS success
          fetchWeather(pos.coords.latitude, pos.coords.longitude)
        },
        () => {
          // GPS failed or user denied the popup — fall back to IP
          fetchWeather()
        }
      )
    } catch {
      // permissions.query not supported in some browsers — fall back gracefully
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather()
      )
    }
  }

  useEffect(() => {
    initWeather()
  }, [])

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-[#2C2C2E] p-6 rounded-xl animate-pulse">
        <div className="h-4 w-24 bg-[#3A3A3C] rounded mb-4" />
        <div className="h-10 w-20 bg-[#3A3A3C] rounded mb-2" />
        <div className="h-4 w-32 bg-[#3A3A3C] rounded mb-6" />
        <div className="h-3 w-full bg-[#3A3A3C] rounded" />
      </div>
    )
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error || !weather) {
    return (
      <div className="bg-[#2C2C2E] p-6 rounded-xl">
        <p className="text-gray-400 text-sm">{error ?? 'No weather data'}</p>
        <button
          type="button"
          onClick={() => {
            // Clear cache so force-refresh actually hits the API
            localStorage.removeItem(CACHE_KEY)
            initWeather()
          }}
          className="mt-2 text-[#0A84FF] text-sm flex items-center gap-1 hover:underline"
        >
          <RefreshCw size={13} /> Try again
        </button>
      </div>
    )
  }

  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`
  const conditionLabel = weather.condition.charAt(0).toUpperCase() + weather.condition.slice(1)

  return (
    <div className="bg-[#2C2C2E] p-6 rounded-xl hover:bg-[#3C3C3E] transition-colors duration-200">
      {/* City */}
      <div className="flex items-center gap-1.5 text-gray-400 mb-3">
        <MapPin size={14} />
        <span className="text-sm">{weather.city}</span>
      </div>

      {/* Temp + icon */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-5xl font-bold">{weather.temp}°C</span>
        <img src={iconUrl} alt={conditionLabel} className="w-16 h-16" />
      </div>

      {/* Condition */}
      <p className="text-gray-300 text-sm mb-4 capitalize">{conditionLabel}</p>

      {/* Stats */}
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
