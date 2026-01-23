export function extractJSON(text: string, target = '{') {
  if (target === '[') {
    return text.slice(text.indexOf('['), text.lastIndexOf(']') + 1);
  }
  return text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
}
