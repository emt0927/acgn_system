const express = require('express')
const token = require('../middlewares/token')
const record = require('../models/record')
const router = express.Router()

// 记录
router.post('/', token, async (req, res) => {
    try {
        const { action, title, type } = req.body
        const userId = req.userId
        const today = new Date().toISOString().split('T')[0]
        const updateQuery = {}
        if (action === 'add') {
            updateQuery.$inc = { add: 1 }
            if (title) updateQuery.$push = { addedTitles: title }
        } else if (action === 'clear') {
            updateQuery.$inc = { clear: 1 }
            if (title) updateQuery.$push = { deletedTitles: title }
        }
        const msg = await record.updateOne({ userId, type, date: today }, updateQuery, { upsert: true })
        if (msg.matchedCount === 0) {
            return res.json({
                code: 200,
                message: '记录失败'
            })
        }
        res.json({
            code: 200,
            message: "记录成功"
        })
    } catch (error) {
        res.status(500).json({ code: 500, message: '服务器内部错误' })
    }
})
// 获取记录数据
router.get('/getList', token, async (req, res) => {
    try {
        const userId = req.userId
        const data = await record.find({ userId }).select().select('date add clear type addedTitles deletedTitles').sort({ createdAt: -1 }).lean()
        res.json({
            code: 200,
            message: '获取成功',
            data
        })
    } catch (error) {
        res.json({ code: 404, message: '获取失败' })
    }
})

module.exports = router