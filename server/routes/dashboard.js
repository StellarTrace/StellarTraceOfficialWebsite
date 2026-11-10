const router = require('express').Router()
const pool = require('../db')

router.get('/stats', async (_req, res) => {
  try {
    const tables = {
      banners: 'cms_home_banner',
      founders: 'cms_founder',
      coreTechs: 'cms_core_tech',
      aiCapabilities: 'cms_ai_capability',
      metaphors: 'cms_metaphor',
      philosophies: 'cms_philosophy',
      milestones: 'cms_milestone',
      ecosystems: 'cms_ecosystem',
      contactInfos: 'cms_contact_info',
      messages: 'cms_contact_message',
      unreadMessages: 'cms_contact_message'
    }

    const stats = {}
    for (const [key, table] of Object.entries(tables)) {
      let query = `SELECT COUNT(*) as count FROM ${table}`
      if (key === 'unreadMessages') {
        query += ' WHERE status = 0'
      }
      const [rows] = await pool.query(query)
      stats[key] = rows[0].count
    }

    stats.contentModules = 9
    stats.techItems = stats.coreTechs
    stats.milestones = stats.milestones
    stats.totalMessages = stats.messages
    stats.unreadMessages = stats.unreadMessages

    res.json({ code: 200, data: stats })
  } catch (err) {
    console.error(err)
    res.json({ code: 500, message: '查询失败' })
  }
})

module.exports = router
