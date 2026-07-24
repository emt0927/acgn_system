const mongoose = require('mongoose')
const dbUrl = process.env.DB_HOST || 'mongodb://127.0.0.1:27017/acgn_list'
mongoose.connect(dbUrl).then(() => { console.log('数据库连接成功'); }).catch((err) => { console.error(`数据库连接失败`, err); })
module.exports = mongoose.connection