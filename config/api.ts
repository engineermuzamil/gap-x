import env from '#start/env'

// All third-party API keys live here.
// Access them like: import apiConfig from '#config/api'
const apiConfig = {
  weatherApiKey: env.get('WEATHER_API_KEY'),
}

export default apiConfig
