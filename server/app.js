const express = require('express')
const cors = require('cors')
const { authMiddleware } = require('./middleware/auth')
const { publicLimiter, contactLimiter, authLimiter } = require('./middleware/rateLimit')

const app = express()
app.use(cors())
app.use(express.json())

// 公开路由 - 限流保护
app.use('/api/auth', authLimiter, require('./routes/auth'))
app.use('/api/site-config', publicLimiter, require('./routes/siteConfig'))
app.use('/api/contact-message', contactLimiter, require('./routes/contactMessage'))

// 以下路由需要鉴权
app.use('/api', authMiddleware)

// CMS 内容管理路由
app.use('/api/home-banner', require('./routes/homeBanner'))
app.use('/api/founder', require('./routes/founder'))
app.use('/api/core-tech', require('./routes/coreTech'))
app.use('/api/ai-capability', require('./routes/aiCapability'))
app.use('/api/ai-dashboard', require('./routes/aiDashboard'))
app.use('/api/metaphor', require('./routes/metaphor'))
app.use('/api/metaphor-design', require('./routes/metaphorDesign'))
app.use('/api/philosophy', require('./routes/philosophy'))
app.use('/api/milestone', require('./routes/milestone'))
app.use('/api/ecosystem', require('./routes/ecosystem'))
app.use('/api/contact-info', require('./routes/contactInfo'))
app.use('/api/ai-reply-template', require('./routes/aiReplyTemplate'))
app.use('/api/dashboard', require('./routes/dashboard'))

// 404
app.use((req, res) => {
  res.json({ code: 404, message: '接口不存在' })
})

const PORT = process.env.PORT || 1086
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})
