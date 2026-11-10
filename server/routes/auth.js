const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pool = require('../db')
const { SECRET, requireAuth } = require('../middleware/auth')
const { generateCaptcha } = require('../utils/captcha')

const captchaStore = new Map()
const CAPTCHA_TTL = 5 * 60 * 1000

router.get('/captcha', (_req, res) => {
  const { text, token, dataUrl } = generateCaptcha()
  captchaStore.set(token, { code: text.toLowerCase(), expires: Date.now() + CAPTCHA_TTL })
  for (const [key, val] of captchaStore) {
    if (val.expires < Date.now()) captchaStore.delete(key)
  }
  res.json({ code: 200, data: { image: dataUrl, token } })
})

router.post('/login', async (req, res) => {
  try {
    const { username, password, code, captchaToken } = req.body
    if (!username || !password) {
      return res.json({ code: 400, message: '请输入用户名和密码' })
    }
    if (!code || !captchaToken) {
      return res.json({ code: 400, message: '请输入验证码' })
    }
    const stored = captchaStore.get(captchaToken)
    captchaStore.delete(captchaToken)
    if (!stored || stored.expires < Date.now()) {
      return res.json({ code: 400, message: '验证码已过期，请刷新' })
    }
    if (stored.code !== code.toLowerCase()) {
      return res.json({ code: 400, message: '验证码错误' })
    }
    const [rows] = await pool.query('SELECT * FROM sys_user WHERE username = ?', [username])
    if (rows.length === 0) {
      return res.json({ code: 400, message: '用户名或密码错误' })
    }
    const user = rows[0]
    if (user.status !== 1) {
      return res.json({ code: 403, message: '账号已被禁用' })
    }
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.json({ code: 400, message: '用户名或密码错误' })
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, nickname: user.nickname },
      SECRET,
      { expiresIn: '24h' }
    )
    await pool.query('UPDATE sys_user SET last_login_time = NOW() WHERE id = ?', [user.id])
    res.json({
      code: 200,
      message: '登录成功',
      data: {
        token,
        userInfo: {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          avatar: user.avatar,
          email: user.email,
          role: user.role
        }
      }
    })
  } catch (err) {
    console.error(err)
    res.json({ code: 500, message: '服务器错误' })
  }
})

// GET /api/auth/userinfo
router.get('/userinfo', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, username, nickname, avatar, email, phone, role FROM sys_user WHERE id = ?',
      [req.user.id]
    )
    if (rows.length === 0) {
      return res.json({ code: 404, message: '用户不存在' })
    }
    res.json({ code: 200, data: rows[0] })
  } catch (err) {
    console.error(err)
    res.json({ code: 500, message: '服务器错误' })
  }
})

// POST /api/auth/logout
router.post('/logout', requireAuth, (_req, res) => {
  res.json({ code: 200, message: '退出成功' })
})

module.exports = router
