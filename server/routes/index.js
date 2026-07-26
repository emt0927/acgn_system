const express = require('express')
const router = express.Router()

// 登录注册
const authRouter = require('./auth')
router.use('/auth', authRouter)

module.exports = router