import env from '#start/env'

const API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'
const API_KEY = env.get('GEMINI_API_KEY')

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string
      }>
    }
  }>
}

async function generateText(prompt: string): Promise<string | null> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    })

    if (!response.ok) {
      console.error('[Gemini] request failed:', response.status, await response.text())
      return null
    }

    const data = (await response.json()) as GeminiResponse
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    return text?.trim() ?? null
  } catch (error) {
    console.error('[Gemini] error:', error)
    return null
  }
}

export async function generateLabel(
  title: string | null,
  description: string | null
): Promise<string | null> {
  const context = [title, description].filter(Boolean).join(' - ')
  if (!context) return null

  const prompt = `Return one short category label for this bookmark. Use 1 or 2 words only. No punctuation. No explanation.

${context}`

  const text = await generateText(prompt)
  if (!text) return null

  return (
    text
      .replace(/['".,\n]/g, '')
      .trim()
      .slice(0, 50) || null
  )
}

export async function generateTldr(
  title: string | null,
  description: string | null,
  url: string
): Promise<string | null> {
  const context = [
    title ? `Title: ${title}` : null,
    description ? `Description: ${description}` : null,
    `URL: ${url}`,
  ]
    .filter(Boolean)
    .join('\n')

  if (!context) return null

  const prompt = `Write a concise 2 to 3 sentence summary of this webpage in plain English. No markdown. No bullet points.

${context}`

  return generateText(prompt)
}
