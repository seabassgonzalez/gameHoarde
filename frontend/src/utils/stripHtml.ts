export function stripHtml(html: string): string {
  if (!html) return '';
  
  // Create a temporary div element
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  
  // Extract text content
  return tmp.textContent || tmp.innerText || '';
}

export function parseHtmlDescription(description: string): string {
  if (!description) return '';
  
  // First strip any HTML tags
  let cleaned = stripHtml(description);
  
  // Clean up common HTML entities
  cleaned = cleaned
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
  
  return cleaned;
}