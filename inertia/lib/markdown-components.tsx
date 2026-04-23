import type { Components } from 'react-markdown'

const markdownComponents: Components = {
  // --- Text blocks ---
  p: ({ children }) => <p className="text-[#98989D] leading-relaxed mb-2 last:mb-0">{children}</p>,

  // --- Inline formatting ---
  strong: ({ children }) => <strong className="text-[#D1D1D6] font-semibold">{children}</strong>,
  em: ({ children }) => <em className="text-[#98989D] italic">{children}</em>,

  // --- Code: inline vs block ---
  code: ({ children }) => {
    const isInline = !String(children).includes('\n')
    return isInline ? (
      <code className="text-[#0A84FF] bg-[#0A84FF]/10 px-1.5 py-0.5 rounded text-xs font-mono">
        {children}
      </code>
    ) : (
      <pre className="bg-[#1C1C1E] border border-[#3A3A3C] rounded-lg p-3 overflow-x-auto my-2">
        <code className="text-[#0A84FF] text-xs font-mono">{children}</code>
      </pre>
    )
  },

  // --- Lists ---
  ul: ({ children }) => (
    <ul className="text-[#98989D] list-disc list-inside space-y-1 mb-2">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="text-[#98989D] list-decimal list-inside space-y-1 mb-2">{children}</ol>
  ),
  li: ({ children }) => <li className="text-[#98989D]">{children}</li>,

  // --- Headings ---
  h1: ({ children }) => <h1 className="text-white font-bold text-base mb-2 mt-1">{children}</h1>,
  h2: ({ children }) => <h2 className="text-white font-semibold text-sm mb-2 mt-1">{children}</h2>,
  h3: ({ children }) => (
    <h3 className="text-[#D1D1D6] font-semibold text-sm mb-1 mt-1">{children}</h3>
  ),

  // --- Blockquote ---
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-[#0A84FF]/50 pl-3 text-[#98989D] italic my-2">
      {children}
    </blockquote>
  ),

  // --- Links ---
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-[#0A84FF] hover:text-[#3B9BFF] underline"
    >
      {children}
    </a>
  ),

  // --- Divider ---
  hr: () => <hr className="border-[#3A3A3C] my-3" />,

  // --- Tables (remark-gfm) ---
  table: ({ children }) => (
    <div className="overflow-x-auto my-2">
      <table className="text-sm text-[#98989D] border-collapse w-full">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-[#3A3A3C] px-3 py-1.5 text-[#D1D1D6] font-medium text-left bg-[#1C1C1E]">
      {children}
    </th>
  ),
  td: ({ children }) => <td className="border border-[#3A3A3C] px-3 py-1.5">{children}</td>,
}

export default markdownComponents
