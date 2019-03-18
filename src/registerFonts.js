import { Font } from '@react-pdf/renderer'

export default function registerFonts(fontMap) {
  for (const [family, path] of Object.entries(fontMap)) {
    Font.register(path, { family })
  }

  // Disable hyphenation: always return whole words.
  Font.registerHyphenationCallback(word => [word])
}
