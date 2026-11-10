const crypto = require('crypto')

function randomColor(min = 50, max = 200) {
  const r = () => Math.floor(Math.random() * (max - min) + min)
  return { r: r(), g: r(), b: r() }
}

function generateCaptcha() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let text = ''
  for (let i = 0; i < 4; i++) {
    text += chars[Math.floor(Math.random() * chars.length)]
  }

  const width = 150
  const height = 50
  const fontSize = 32

  const charSvgs = []
  for (let i = 0; i < text.length; i++) {
    const color = randomColor(60, 180)
    const x = 20 + i * 32
    const y = height / 2 + fontSize / 3
    const rotate = (Math.random() - 0.5) * 40
    charSvgs.push(
      `<text x="${x}" y="${y}" font-size="${fontSize}" font-family="Arial,sans-serif" font-weight="bold" fill="rgb(${color.r},${color.g},${color.b})" transform="rotate(${rotate},${x},${y})">${text[i]}</text>`
    )
  }

  const lines = []
  for (let i = 0; i < 5; i++) {
    const color = randomColor(100, 200)
    const x1 = Math.random() * width
    const y1 = Math.random() * height
    const x2 = Math.random() * width
    const y2 = Math.random() * height
    lines.push(
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgb(${color.r},${color.g},${color.b})" stroke-width="1" />`
    )
  }

  const dots = []
  for (let i = 0; i < 30; i++) {
    const color = randomColor(100, 220)
    const cx = Math.random() * width
    const cy = Math.random() * height
    dots.push(
      `<circle cx="${cx}" cy="${cy}" r="1.5" fill="rgb(${color.r},${color.g},${color.b})" />`
    )
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="#1a1a2e" rx="4" />
    ${dots.join('')}
    ${lines.join('')}
    ${charSvgs.join('')}
  </svg>`

  const token = crypto.randomBytes(16).toString('hex')
  const base64 = Buffer.from(svg).toString('base64')
  const dataUrl = `data:image/svg+xml;base64,${base64}`

  return { text, token, dataUrl }
}

module.exports = { generateCaptcha }
