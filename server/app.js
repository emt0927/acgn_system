
if (!process.env.NETLIFY && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
    require('dotenv').config()
}
const { connectDB } = require('./mongoDB/db')
const cookieParser = require('cookie-parser')
const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()

// 开启跨域
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use(async (req, res, next) => {
    try {
        await connectDB()
        next()
    } catch (err) {
        console.error('数据库连接异常:', err.message)
        return res.status(500).json({
            code: 500,
            message: '数据库连接失败: ' + err.message
        })
    }
})
// 挂载路由
const mainRouter = require('./routes/index')
app.use('/', mainRouter)
const isServerless = process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production'
if (!isServerless) {
    const PORT = process.env.PORT || 3000
    connectDB().then(() => {
           app.listen(PORT, () => console.log(`🚀 服务启动于: http://localhost:${PORT}`))
    })
}
module.exports = app