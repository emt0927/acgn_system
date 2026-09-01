const multer = require('multer')
const path = require('path')
const fs = require('fs')

// 创建文件夹
const uploadDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

// 1. 告诉你 Multer 把图片存哪里、改什么名
const storage = multer.diskStorage({
    // 决定存哪
    destination: (req, file, cb) => {
        // cb 是 callback（回调函数）。
        // 第一个参数 null 代表“没有报错”，第二个参数把路径给 Multer
        cb(null, uploadDir)
    },
    // 决定文件名
    filename: (req, file, cb) => {
        // path.extname('als.jpg') -> 拿到后缀名 '.jpg'
        const ext = path.extname(file.originalname)

        // 用 "当前毫秒时间戳 + 随机数" 拼接成新名字：1725100000000-847291048.jpg
        // 目的：防止两个用户都传了叫 cover.jpg 的图片导致覆盖
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`
        cb(null, uniqueName)
    }
})
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 限制 5MB
})
module.exports = upload