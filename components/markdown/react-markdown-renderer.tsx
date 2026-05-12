import ReactMarkdown from 'react-markdown'

import remarkGfm from 'remark-gfm'

interface ReactMarkdownRendererProps {
  content: string
}

export function ReactMarkdownRenderer({ content }: ReactMarkdownRendererProps) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
}
