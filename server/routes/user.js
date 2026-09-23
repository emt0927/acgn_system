const express = require('express')
const router = express.Router()
const token = require('../middlewares/token')
const user = require('../models/user')
const register = require('../models/register')
const bcrypt = require('bcryptjs')
// 获取用户信息
router.get('/profile', token, async (req, res) => {
    try {
        const profile = await user.findOne({ userId: req.userId }).populate('userId', 'username')
        res.json({
            code: 200,
            message: '获取成功',
            data: {
                username: profile ? profile.userId.username : '',
                nickname: profile ? profile.nickname : '',
                coverurl: profile ? profile.coverurl : ''
            }
        })
    } catch (error) {
        res.json({ code: 500, message: '服务器错误' })
    }

})
// 修改/存入个人信息
router.post('/profile', token, async (req, res) => {
    try {
        const { nickname, coverurl, allpassword } = req.body
        const updateData = {}
        // 修改新密码
        if (allpassword && typeof allpassword === 'string' && allpassword.trim() !== '') {
            const cleanPassword = allpassword.trim()
            const currentAuth = await register.findById(req.userId)
            if (!currentAuth) {
                return res.json({ code: 400, message: '账号不存在' })
            }
            const isSame = await bcrypt.compare(cleanPassword, currentAuth.password)
            if (isSame) {
                return  res.json({ code: 400, message: '新密码不能与原密码相同' })
            }
            const newHashedPassword = await bcrypt.hash(allpassword.trim(), 10)
            await register.findByIdAndUpdate(req.userId, { password: newHashedPassword })
        }

        if (nickname !== undefined && nickname.trim() !== '') updateData.nickname = nickname.trim()
        if (coverurl !== undefined && coverurl.trim() !== '') updateData.coverurl = coverurl.trim()
        if (Object.keys(updateData).length > 0) {
            await user.findOneAndUpdate(
                { userId: req.userId },
                updateData,
                { upsert: true, new: true } // upsert 表示不存在时就新建
            )
        }
        res.json({ code: 200, message: '更新成功' })
    } catch (error) {
        res.json({ code: 500, message: '服务器错误' })
    }
})
module.exports = router