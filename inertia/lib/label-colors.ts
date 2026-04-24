// Maps each label name to a consistent color pair: [background, text]
const LABEL_COLORS: Record<string, { bg: string; text: string }> = {
  Work: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  Personal: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  Urgent: { bg: 'bg-red-500/20', text: 'text-red-400' },
  Learning: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
  Ideas: { bg: 'bg-green-500/20', text: 'text-green-400' },
  Health: { bg: 'bg-pink-500/20', text: 'text-pink-400' },
}

// Fallback color for any label not in the map above
const DEFAULT_COLOR = { bg: 'bg-[#3A3A3C]', text: 'text-[#98989D]' }

export function getLabelColor(name: string) {
  return LABEL_COLORS[name] ?? DEFAULT_COLOR
}
