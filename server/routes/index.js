const express = require('express')
const router = express.Router()

// 登录注册
const authRouter = require('./auth')
// 作品相关
const mediaRouter = require('./media')
// 系列相关
const seriesRouter = require('./series')
// 上传图片
const uploadRouter = require('./upload')
router.use('/auth', authRouter)
router.use('/media', mediaRouter)
router.use('/series', seriesRouter)
router.use('/upload', uploadRouter)

module.exports = router