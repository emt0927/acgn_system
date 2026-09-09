const express = require('express')
const router = express.Router()
const token = require('../middlewares/token')
const series = require('../models/series')
const path = require('path')
const fs = require('fs/promises')
const media = require('../models/media')
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
router.delete('/delete/:id', token, async (req, res) => {
    try {
        const { id } = req.params
        const deletedSeries = await series.findOneAndDelete({
            _id: id,
            userId: req.userId
        })
        if (!deletedSeries) {
            return res.json({
                code: 404,
                message: '系列删除失败'
            })
        }
        if (deletedSeries.coverUrl) {
            const absolutePath = path.join(process.cwd(), deletedSeries.coverUrl)
            try {
                await fs.unlink(absolutePath)
                console.log(`[成功删除系列封面]: ${absolutePath}`)
            } catch (error) {
                console.warn(`[系列封面删除跳过/失败]: ${error.message}`)
            }
        }
        res.json({
            code: 200,
            message: '系列删除成功'
        })
    } catch (error) {
        return res.status(500).json({ code: 500, message: error.message })
    }
})
// 获取系列关联的作品
router.get('/addSeriresandMedia/:id', token, async (req, res) => {
    try {
        const { id } = req.params
        const [seriesInfo, mediaList] = await Promise.all([
            series.findOne({ _id: id, userId: req.userId }).lean(), media.find({
                series: id, userId: req.userId
            }).select('-userId -createdAt -__v').lean()
        ])
        //数据清洗
        const formattedMediaList = mediaList.map(item => {
            const { _id, ...test } = item
            return {
                id: _id,
                ...test
            }
        })
        if (!seriesInfo) {
            return res.json({ code: 404, message: '该系列不存在' })
        }
        res.json({
            code: 200,
            message: '系列相关联的作品获取成功',
            data: {
                seriesInfo,
                mediaList: formattedMediaList
            }
        })
    } catch (error) {
        res.json({
            code: 404,
            message: '获取失败',
        })
    }

})
module.exports = router