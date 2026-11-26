// Heuristics used to decide whether pasted plain text is Markdown.
// Only text matching one of these patterns is parsed as Markdown on paste;
// everything else keeps Tiptap's default plain-text paste behavior.
const MARKDOWN_PATTERNS: RegExp[] = [
  /^#{1,6}\s+\S/m, // headings: # Title
  /^\s*[-*+]\s+\S/m, // bullet lists: - item
  /^\s*\d+[.)]\s+\S/m, // ordered lists: 1. item
  /^\s*>\s?\S/m, // blockquotes: > quote
  /^\s*(```|~~~)/m, // fenced code blocks
  /\*\*[^*\n]+\*\*|__[^_\n]+__/, // bold: **text** / __text__
  /(^|[^*\w])\*[^*\s][^*\n]*\*(?!\*)/, // italic: *text*
  /(^|[^_\w])_[^_\s][^_\n]*_(?![_\w])/, // italic: _text_
  /~~[^~\n]+~~/, // strikethrough: ~~text~~
  /`[^`\n]+`/, // inline code: `code`
  /\[[^\]\n]+\]\([^)\s]+\)/, // links: [label](url)
];

export function looksLikeMarkdown(text: string): boolean {
  return MARKDOWN_PATTERNS.some((pattern) => pattern.test(text));
}
