import { useState } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import markdownComponents from '../../lib/markdown-components'
import { normalizeMarkdown } from '../../lib/normalize-markdown'
import GiphyPicker from './giphy-picker'

interface Gif {
  id: string
  title: string
  previewUrl: string
  originalUrl: string
}

interface NoteContentEditorProps {
  value: string
  onChange: (value: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

const PLACEHOLDER = `Write your note here...

Type /giphy to search and insert a GIF!

Markdown supported: **bold**, *italic*, \`code\`, > blockquote`

// Owns all write/preview tab state and giphy detection logic
// Parent only needs to pass value + two callbacks — keeps note-form.tsx clean
export default function NoteContentEditor({ value, onChange, onKeyDown }: NoteContentEditorProps) {
  const [preview, setPreview] = useState(false)

  // null = picker hidden, string = picker open with this query
  const [giphyQuery, setGiphyQuery] = useState<string | null>(null)
  const [preloadedGifs, setPreloadedGifs] = useState<Gif[]>([])

  const normalizedContent = normalizeMarkdown(value)

  // Fetch GIFs in the background the moment /giphy is detected
  // so the picker shows results instantly without a loading wait
  const preloadGifs = async (q: string) => {
    try {
      const res = await fetch(`/giphy/search?q=${encodeURIComponent(q)}`)
      if (!res.ok) return
      const json = (await res.json()) as { gifs: Gif[] }
      setPreloadedGifs(json.gifs)
    } catch {
      // Silent fail — picker fetches on its own if preload didn't work
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    onChange(newValue)

    // Check last line for /giphy command
    const lastLine = newValue.split('\n').at(-1) ?? ''
    const match = lastLine.match(/^\/giphy(.*)/)

    if (match) {
      const query = match[1].trim() || 'trending'
      if (query !== giphyQuery) {
        setGiphyQuery(query)
        preloadGifs(query)
      }
    } else {
      setGiphyQuery(null)
      setPreloadedGifs([])
    }
  }

  const handleGifSelect = (gifUrl: string) => {
    // Remove the /giphy line and insert a markdown image in its place
    const lines = value.split('\n')
    lines.pop()
    const newContent = `${lines.join('\n').trimEnd()}\n\n![gif](${gifUrl})\n`
    onChange(newContent)
    setGiphyQuery(null)
    setPreloadedGifs([])
  }

  return (
    <div className="mb-4">
      {/* Write / Preview tab toggle */}
      <div className="flex items-center gap-2 mb-2">
        {(['Write', 'Preview'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setPreview(tab === 'Preview')}
            className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
              (tab === 'Preview') === preview
                ? 'bg-[#3A3A3C] text-white'
                : 'text-[#98989D] hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content area — either textarea or markdown preview */}
      {preview ? (
        <div className="w-full px-4 py-3 bg-[#3A3A3C] rounded-lg min-h-[120px] text-sm prose-note">
          {value ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {normalizedContent}
            </ReactMarkdown>
          ) : (
            <p className="text-[#98989D]">Nothing to preview yet.</p>
          )}
        </div>
      ) : (
        <div>
          <motion.textarea
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            value={value}
            onChange={handleChange}
            onKeyDown={onKeyDown}
            placeholder={PLACEHOLDER}
            required
            className="w-full px-4 py-3 bg-[#3A3A3C] text-white placeholder-[#98989D] rounded-lg border-none focus:ring-2 focus:ring-[#0A84FF] focus:outline-none min-h-[120px] transition-all duration-200 font-mono text-sm"
          />

          {/* Giphy picker — shown when user types /giphy */}
          {giphyQuery !== null && (
            <GiphyPicker
              query={giphyQuery}
              initialGifs={preloadedGifs}
              onSelect={handleGifSelect}
              onClose={() => {
                setGiphyQuery(null)
                setPreloadedGifs([])
              }}
            />
          )}

          <p className="mt-1.5 text-xs text-[#48484A]">
            Tip: type <span className="font-mono text-[#98989D]">/giphy</span> to insert a GIF
          </p>
        </div>
      )}
    </div>
  )
}
