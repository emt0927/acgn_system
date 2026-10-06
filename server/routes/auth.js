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
        { id: user._id },
        JWT_SECRET,
        { expiresIn: '5s' }
    )
    console.log(accessToken, 'accessToken');
    // 长期token 
    const refreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
    // 长 Token 种到客户端浏览器的 Cookie 里
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    //返回前端
    res.send({
        code: 200, message: '登录成功', data: {
            accessToken
        }
    })
})
// 换取token
router.post('/refresh', (req, res) => {
    const token = req.cookies?.refreshToken
    console.log('触发', token);
    if (!token) {
        return res.json({ code: 401, message: '未提供refreshToken' })
    }
    try {
        const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET)
        // 校验通过
        const newAccessToken = jwt.sign(
            { id: decoded.id },
            JWT_SECRET,
            { expiresIn: '5s' }
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
        res.clearCookie('refreshToken', { httpOnly: true })
        return res.json({
            code: 401,
            message: '长登录状态已过期，请重新登录'
        })
    }
})

// 退出登录
router.post('/logout', async (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true
    })
    res.json({ code: 200, message: '退出成功' })
})
module.exports = router