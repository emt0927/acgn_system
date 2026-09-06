const express = require('express')
const upload = require('../middlewares/upload')
const router = express.Router()
/**
 * 1. 单独的封面图片上传接口
 * 请求类型: POST /media/upload
 * FormData 字段名: file
 */
router.post('/', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.json({ code: 400, message: '未收到图片文件' })
        }
        const coverUrl = `/uploads/${req.file.filename}`
        res.json({
            code: 200,
            message: '封面上传成功',
            data: { url: coverUrl }
        })
    } catch (err) {
        res.status(500).json({ code: 500, message: '服务器错误', error: err.message })
    }
})

module.exports = router