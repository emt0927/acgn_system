const express = require('express')
const router = express.Router()

// 登录注册
const authRouter = require('./auth')
// 作品相关
const mediaRouter = require('./media')
router.use('/auth', authRouter)
router.use('/media', mediaRouter)

module.exports = router