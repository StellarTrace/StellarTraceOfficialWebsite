const router = require('express').Router()
const pool = require('../db')
const TABLE = 'cms_ai_capability'

router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM ${TABLE} WHERE status = 1 ORDER BY sort_order ASC`)
    res.json({ code: 200, data: rows })
  } catch (err) { console.error(err); res.json({ code: 500, message: '查询失败' }) }
})

router.get('/list', async (_req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM ${TABLE} ORDER BY sort_order ASC`)
    res.json({ code: 200, data: rows })
  } catch (err) { console.error(err); res.json({ code: 500, message: '查询失败' }) }
})

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM ${TABLE} WHERE id = ?`, [req.params.id])
    res.json({ code: 200, data: rows[0] || null })
  } catch (err) { console.error(err); res.json({ code: 500, message: '查询失败' }) }
})

router.post('/', async (req, res) => {
  try {
    const d = req.body
    await pool.query(
      `INSERT INTO ${TABLE} (name, description, icon, color_from, color_to, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [d.name, d.description || '', d.icon || '', d.color_from || '', d.color_to || '', d.sort_order || 0, d.status ?? 1]
    )
    res.json({ code: 200, message: '添加成功' })
  } catch (err) { console.error(err); res.json({ code: 500, message: '添加失败' }) }
})

router.put('/:id', async (req, res) => {
  try {
    const d = req.body
    await pool.query(
      `UPDATE ${TABLE} SET name=?, description=?, icon=?, color_from=?, color_to=?, sort_order=?, status=? WHERE id=?`,
      [d.name, d.description, d.icon, d.color_from, d.color_to, d.sort_order, d.status, req.params.id]
    )
    res.json({ code: 200, message: '更新成功' })
  } catch (err) { console.error(err); res.json({ code: 500, message: '更新失败' }) }
})

router.delete('/:id', async (req, res) => {
  try {
    await pool.query(`DELETE FROM ${TABLE} WHERE id = ?`, [req.params.id])
    res.json({ code: 200, message: '删除成功' })
  } catch (err) { console.error(err); res.json({ code: 500, message: '删除失败' }) }
})

module.exports = router
