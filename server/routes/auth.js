const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
//注册
const admin = require('../models/register')
router.post('/register', async (req, res) => {
    const { username, password } = req.body
    // 用户名查重
    const existingUser = await admin.findOne({ username })
    if (existingUser) {
        return res.status(400).json({ code: 400, message: '该用户名已被注册' })
    }
    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 10)
    // 写入数据库
    await admin.create({
        username,
        password: hashedPassword
    })
    // 返回前端
    res.send({ code: 200, message: '注册成功' })
})

// 登录
router.post('/login', async (req, res) => {
    const { username, password } = req.body
    // 比对用户名
    const user = await admin.findOne({ username })
    if (!user) {
        return res.status(400).json({ code: 400, message: '用户名或密码错误!' })
    }

    //比对密码
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return res.status(400).json({ code: 400, message: '用户名或密码错误!' })
    }
    // 短token 
    const accessToken = jwt.sign(
        { id: user._id, username: user.username },
        JWT_SECRET,
        { expiresIn: '2h' }
    )
    // 长期token 
    const refreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
    //返回前端
    res.send({
        code: 200, message: '登录成功', data: {
            accessToken,
            refreshToken
        }
    })
})
// 换取token
router.post('/refresh', (req, res) => {
    const { token } = req.body
    if (!token) {
        return res.status(401).json({ code: 401, message: '未提供refreshToken' })
    }
    try {
        const decoded = jwt.verify(token.trim(), REFRESH_TOKEN_SECRET)
        // 校验通过
        const newAccessToken = jwt.sign(
            { id: decoded.id, username: decoded.username },
            JWT_SECRET,
            { expiresIn: '2h' }
        )
        //返回给前端
        return res.json({
            code: 200,
            message: 'Token 刷新成功',
            data: {
                accessToken: newAccessToken
            }
        })
    } catch (error) {
        console.log('refreshToken 校验失败:', error.message)
        return res.status(401).json({
            code: 401,
            message: '长登录状态已过期，请重新登录'
        })
    }
})
module.exports = router