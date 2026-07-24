require('dotenv').config()
require('./mongoDB/db')

const express = require('express')
const cors = require('cors')
const app = express()

// 开启跨域
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 3000
app.listen(PORT, () =>console.log(`🚀 服务启动于: http://localhost:${PORT}`))