const jwt = require('jsonwebtoken')

const SECRET = process.env.JWT_SECRET || 'stellar_trace_secret_2024'

function authMiddleware(req, res, next) {
  if (req.method === 'GET') {
    return next()
  }
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.json({ code: 401, message: '未登录或token已过期' })
  }
  try {
    const token = header.slice(7)
    req.user = jwt.verify(token, SECRET)
    next()
  } catch {
    return res.json({ code: 401, message: '未登录或token已过期' })
  }
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.json({ code: 401, message: '未登录或token已过期' })
  }
  try {
    const token = header.slice(7)
    req.user = jwt.verify(token, SECRET)
    next()
  } catch {
    return res.json({ code: 401, message: '未登录或token已过期' })
  }
}

module.exports = { authMiddleware, requireAuth, SECRET }
