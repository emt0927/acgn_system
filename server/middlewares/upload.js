const multer = require('multer')

// 1. 告诉你 Multer 把图片存哪里、改什么名
const storage = multer.memoryStorage()
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 限制 5MB
})
module.exports = upload