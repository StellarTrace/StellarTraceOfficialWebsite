const router = require('express').Router()
const pool = require('../db')
const { authMiddleware } = require('../middleware/auth')
const TABLE = 'cms_contact_message'

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body
    if (!name || !message) {
      return res.json({ code: 400, message: '姓名和留言内容不能为空' })
    }
    await pool.query(
      `INSERT INTO ${TABLE} (name, email, phone, subject, message, status) VALUES (?, ?, ?, ?, ?, 0)`,
      [name, email || '', phone || '', subject || '', message]
    )
    res.json({ code: 200, message: '留言已提交' })
  } catch (err) { console.error(err); res.json({ code: 500, message: '提交失败' }) }
})

router.get('/list', authMiddleware, async (req, res) => {
  try {
    let sql = `SELECT * FROM ${TABLE}`
    const params = []
    if (req.query.status !== undefined && req.query.status !== '') {
      sql += ' WHERE status = ?'
      params.push(Number(req.query.status))
    }
    sql += ' ORDER BY create_time DESC'
    const [rows] = await pool.query(sql, params)
    res.json({ code: 200, data: rows })
  } catch (err) { console.error(err); res.json({ code: 500, message: '查询失败' }) }
})

router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    await pool.query(`UPDATE ${TABLE} SET status = 1 WHERE id = ? AND status = 0`, [req.params.id])
    res.json({ code: 200, message: '已标记为已读' })
  } catch (err) { console.error(err); res.json({ code: 500, message: '操作失败' }) }
})

router.put('/:id/reply', authMiddleware, async (req, res) => {
  try {
    const { replyContent } = req.body
    await pool.query(
      `UPDATE ${TABLE} SET status = 2, reply_content = ? WHERE id = ?`,
      [replyContent, req.params.id]
    )
    res.json({ code: 200, message: '回复成功' })
  } catch (err) { console.error(err); res.json({ code: 500, message: '回复失败' }) }
})

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query(`DELETE FROM ${TABLE} WHERE id = ?`, [req.params.id])
    res.json({ code: 200, message: '删除成功' })
  } catch (err) { console.error(err); res.json({ code: 500, message: '删除失败' }) }
})

module.exports = router
