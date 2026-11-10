const router = require('express').Router()
const pool = require('../db')
const TABLE = 'cms_metaphor_design'

router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM ${TABLE} LIMIT 1`)
    res.json({ code: 200, data: rows[0] || {} })
  } catch (err) { console.error(err); res.json({ code: 500, message: '查询失败' }) }
})

router.get('/detail', async (_req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM ${TABLE} LIMIT 1`)
    res.json({ code: 200, data: rows[0] || null })
  } catch (err) { console.error(err); res.json({ code: 500, message: '查询失败' }) }
})

router.put('/', async (req, res) => {
  try {
    const d = req.body
    const [existing] = await pool.query(`SELECT id FROM ${TABLE} LIMIT 1`)
    if (existing.length > 0) {
      await pool.query(
        `UPDATE ${TABLE} SET title=?, content=?, sort_order=?, status=? WHERE id=?`,
        [d.title, d.content || '', d.sort_order || 0, d.status ?? 1, existing[0].id]
      )
    } else {
      await pool.query(
        `INSERT INTO ${TABLE} (title, content, sort_order, status) VALUES (?, ?, ?, ?)`,
        [d.title, d.content || '', d.sort_order || 0, d.status ?? 1]
      )
    }
    res.json({ code: 200, message: '更新成功' })
  } catch (err) { console.error(err); res.json({ code: 500, message: '更新失败' }) }
})

module.exports = router
