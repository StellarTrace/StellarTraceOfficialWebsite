const router = require('express').Router()
const pool = require('../db')

router.get('/all', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT config_key, config_value FROM cms_site_config')
    const config = {}
    rows.forEach((row) => {
      config[row.config_key] = row.config_value
    })
    res.json({ code: 200, data: config })
  } catch (err) {
    console.error(err)
    res.json({ code: 500, message: '查询失败' })
  }
})

module.exports = router
