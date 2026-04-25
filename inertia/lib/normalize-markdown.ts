export function normalizeMarkdown(content: string) {
  const trimmed = content.trim()
  const fencedMarkdown = trimmed.match(/^```(?:md|markdown)?\n([\s\S]*?)\n```$/i)

  if (fencedMarkdown) {
    return fencedMarkdown[1]
  }

  return content
}
