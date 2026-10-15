const express = require('express')
const upload = require('../middlewares/upload')
const cloudinary = require('cloudinary').v2
const router = express.Router()
/**
 * 1. 单独的封面图片上传接口
 * 请求类型: POST /media/upload
 * FormData 字段名: file
 */
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.json({ code: 400, message: '未收到图片文件' })
        }
        const b64 = Buffer.from(req.file.buffer).toString('base64')
        const dataURI = `data:${req.file.mimetype};base64,${b64}`
        // 上传到你的 Cloudinary 云端
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'acgn_covers',
            resource_type: 'auto'
        })
        res.json({
            code: 200,
            message: '封面上传成功',
            data: { url: result.secure_url }
        })
    } catch (err) {
        res.status(500).json({ code: 500, message: '服务器错误', error: err.message })
    }
})

module.exports = router