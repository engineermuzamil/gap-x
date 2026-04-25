import { useEffect, useState } from 'react'
import { Loader2Icon, SearchIcon, XIcon } from 'lucide-react'

interface Gif {
  id: string
  title: string
  previewUrl: string
  originalUrl: string
}

interface GiphyPickerProps {
  query: string
  onSelect: (gifUrl: string) => void
  onClose: () => void
}

export default function GiphyPicker({ query, onSelect, onClose }: GiphyPickerProps) {
  const [gifs, setGifs] = useState<Gif[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // searchTerm is what shows in the input inside the picker
  const [searchTerm, setSearchTerm] = useState(query)

  // When user keeps typing after /giphy, update the search term
  useEffect(() => {
    setSearchTerm(query)
  }, [query])

  // Fetch GIFs whenever searchTerm changes, debounced 400ms
  useEffect(() => {
    if (!searchTerm.trim()) return
    const timer = setTimeout(() => {
      fetchGifs(searchTerm)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const fetchGifs = async (q: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/giphy/search?q=${encodeURIComponent(q)}`)
      if (!res.ok) throw new Error('Bad response')
      const json = (await res.json()) as { gifs: Gif[] }
      setGifs(json.gifs)
    } catch (err) {
      setError('Could not load GIFs. Check your API key and route.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="mt-2 rounded-xl border border-[#3A3A3C] bg-[#1C1C1E] overflow-hidden"
      style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between border-b border-[#3A3A3C] px-4 py-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#98989D]">GIPHY</span>
        <button
          type="button"
          onClick={onClose}
          className="text-[#98989D] hover:text-white transition-colors p-1"
        >
          <XIcon size={15} />
        </button>
      </div>

      {/* ── Search input ── */}
      <div className="border-b border-[#3A3A3C] px-3 py-2">
        <div className="flex items-center gap-2 rounded-lg bg-[#2C2C2E] px-3 py-2">
          <SearchIcon size={13} className="shrink-0 text-[#98989D]" />
          <input
            autoFocus
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search GIFs..."
            className="flex-1 bg-transparent text-sm text-white placeholder-[#98989D] outline-none"
          />
        </div>
      </div>

      {/* ── Results ── */}
      <div className="max-h-60 overflow-y-auto p-3">
        {loading && (
          <div className="flex justify-center py-6">
            <Loader2Icon size={22} className="animate-spin text-[#0A84FF]" />
          </div>
        )}

        {!loading && error && <p className="py-6 text-center text-sm text-[#FF6B6B]">{error}</p>}

        {!loading && !error && gifs.length === 0 && searchTerm.trim() && (
          <p className="py-6 text-center text-sm text-[#98989D]">
            No GIFs found for "{searchTerm}"
          </p>
        )}

        {!loading && gifs.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {gifs.map((gif) => (
              <button
                key={gif.id}
                type="button"
                onClick={() => onSelect(gif.originalUrl)}
                title={gif.title}
                className="aspect-video overflow-hidden rounded-lg border border-[#3A3A3C] bg-[#2C2C2E] hover:border-[#0A84FF] transition-colors"
              >
                <img
                  src={gif.previewUrl}
                  alt={gif.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="border-t border-[#3A3A3C] px-4 py-1.5">
        <p className="text-center text-[10px] text-[#48484A]">Powered by GIPHY</p>
      </div>
    </div>
  )
}
