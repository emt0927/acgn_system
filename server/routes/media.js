const express = require('express')
const router = express.Router()
const token = require('../middlewares/token')
const media = require('../models/media')
const fs = require('fs/promises')
const path = require('path')

// 添加作品
router.post('/addDetail', token, async (req, res) => {
    try {
        // 存入数据
        await media.create({ ...req.body, userId: req.userId })
        res.json({
            code: 200,
            message: '作品录入成功!'
        })
    } catch (error) {
        res.json({
            code: 404,
            message: error.message
        })
    }
})
// 修改作品
router.put('/updateMedia', token, async (req, res) => {
    try {
        const { id, ...newData } = req.body

        const msg = await media.updateOne({
            _id: id,
            userId: req.userId
        }, { $set: { ...newData } })
        if (msg.matchedCount === 0) {
            return res.json({
                code: 404,
                message: '作品详情修改失败'
            })
        }
        res.json({
            code: 200,
            message: '作品详情修改成功'
        })

    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: error.message
        })
    }
})
// 删除作品
router.delete('/delete/:id', token, async (req, res) => {
    try {
        const { id } = req.params
        console.log(id);
        const deletedMedia = await media.findOneAndDelete({
            _id: id,
            userId: req.userId
        })
        if (!deletedMedia) {
            return res.json({
                code: 404,
                message: '作品不存在或无权删除'
            })
        }
        if (deletedMedia.coverUrl) {
            const absolutePath = path.join(process.cwd(), deletedMedia.coverUrl)
            console.log(absolutePath);
            try {
                await fs.unlink(absolutePath)
                console.log(`[成功删除图片]: ${absolutePath}`)
            } catch (error) {
                console.warn(`[图片删除跳过/失败]: ${error.message}`)
            }
        }
        res.json({
            code: 200,
            message: '作品删除成功'
        })
    } catch (error) {
        return res.status(500).json({ code: 500, message: error.message })
    }
})
// 获取作品列表
router.get('/getList', token, async (req, res) => {
    try {
        const filter = { userId: req.userId }
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.pageSize) || 12
        const skip = (page - 1) * limit
        const rawList = await media.find(filter).select('title coverUrl type subType status rating progress seriesId updatedAt').sort({ createdAt: -1 }).skip(skip).limit(limit).lean()
        const total = await media.countDocuments(filter)
        // 数据清洗
        const list = rawList.map(item => ({
            id: item._id,
            title: item.title,
            coverUrl: item.coverUrl,
            type: item.type,
            subType: item.subType || '',
            status: item.status,
            rating: item.rating,
            progress: item.progress,
            seriesId: item.series || null,
            updatedAt:item.updatedAt
        }))
        return res.json({
            code: 200,
            message: '获取作品列表成功!',
            data: {
                list: list,
                total: total
            }
        })
    } catch (error) {
        return res.json({
            code: 200,
            message: error.message
        })
    }
})
// 获取作品详情
router.get('/getDetail/:id', token, async (req, res) => {
    try {
        const { id } = req.params
        const detail = await media.findOne({
            _id: id,
            userId: req.userId
        }).populate('series', 'title').select('-userId -createdAt -__v').lean()
        const { _id, ...cleanDetail } = detail
        if (!detail) {
            return res.json({
                code: 404,
                message: '作品不存在或无权查看'
            })
        }
        res.json({
            code: 200,
            message: '获取作品详情成功',
            data: {
                id: _id,
                ...cleanDetail
            }
        })
    } catch (error) {
        return res.status(500).json({ code: 500, message: error.message })
    }
})
module.exports = router