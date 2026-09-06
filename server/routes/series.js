const express = require('express')
const router = express.Router()
const token = require('../middlewares/token')
const series = require('../models/series')

// 添加系列
router.post('/add', token, async (req, res) => {
    try {
        series.create({ ...req.body, userId: req.userId })
        res.json({
            code: 200,
            message: '系列添加成功!'
        })
    } catch (error) {
        res.json({
            code: 404,
            message: "添加失败"
        })
    }
})

// 获取系列
router.get('/get', token, async (req, res) => {
    try {
        const filter = { userId: req.userId }
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.pageSize) || 12
        const skip = (page - 1) * limit
        const rawList = await series.find(filter).select('title coverUrl type').sort({ createdAt: -1 }).skip(skip).limit(limit).lean()
        const total = await series.countDocuments(filter)
        // 数据清洗
        const list = rawList.map(({ _id, title, type, coverUrl }) => ({
            id: _id,
            title,
            type,
            coverUrl
        }))
        return res.json({
            code: 200,
            message: '成功获取系列列表',
            data: {
                list: list,
                total: total
            }
        })
    } catch (error) {
        return res.json({
            code: 404,
            message: '获取数据失败'
        })
    }
})
// 获取系列详情
router.get('/getDetail/:id', token, async (req, res) => {
    try {
        const { id } = req.params
        const detail = await series.findOne({ _id: id, userId: req.userId }).select('-userId -createdAt -__v').lean()
        const { _id, ...cleanDetail } = detail
        if (!detail) {
            return res.json({
                code: 404,
                message: '获取系列详情失败'
            })
        }
        res.json({
            code: 200,
            message: '获取成功',
            data: {
                id: _id,
                ...cleanDetail
            }
        })
    } catch (error) {
        res.json({
            code: 404,
            message: error.message
        })
    }

})
// 编辑系列详情
router.put('/updateSeries', token, async (req, res) => {
    try {
        const { id, ...newData } = req.body
        const msg = await series.updateOne({ _id: id, userId: req.userId }, { $set: { ...newData } })
        if (msg.matchedCount === 0) {
            return res.json({
                code: 404,
                message: '系列修改失败'
            })
        }
        return res.json({
            code: 200,
            message: '系列修改成功'
        })
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: error.message
        })
    }
})

// 删除系列
module.exports = router