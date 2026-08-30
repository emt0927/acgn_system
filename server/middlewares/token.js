const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

const auth = (req, res, next) => {
    const rawToken = req.headers.authorization
    if (!rawToken) {
        return res.status(401).json({ code: 401, message: '未提供Token 请先登录!' })
    }
    const token = rawToken.replace(/^Bearer\s+/, '').trim()
    // 用 JSON.stringify 包包裹起来，如果有空格或换行，双引号内部会无所遁形
    try {
        // 解密token
        const decoded = jwt.verify(token, JWT_SECRET)
        console.log(decoded, 'decoedeeed');
        req.userId = decoded.id
        next()
    } catch (error) {
        console.log(error, 'ERRR');
        return res.status(401).json({ code: 401, message: 'Token无效或已过期 请重新登录' })
    }
}
module.exports = auth