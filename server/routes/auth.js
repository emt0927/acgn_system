const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
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
        res.status(400).json({ code: 400, message: '用户名和密码不能为空' })
    }

    //比对密码
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        res.status(400).json({ code: 400, message: '用户名和密码不能为空' })
    }
    // 生成token 
    const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '24h' }
    )
    //返回前端
    res.send({
        code: 200, message: '登录成功', data: {
            token
        }
    })
})
module.exports = router