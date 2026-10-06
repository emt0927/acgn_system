require('dotenv').config()
require('./mongoDB/db')
const cookieParser = require('cookie-parser')
const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()

// 开启跨域
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
// 挂载路由
const mainRouter = require('./routes/index')
app.use('/', mainRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`🚀 服务启动于: http://localhost:${PORT}`))