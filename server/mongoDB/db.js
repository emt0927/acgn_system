const mongoose = require('mongoose')

let isConnected = false

const connectDB = async () => {
    // 1 代表 connected（已连接），直接复用
    if (isConnected && mongoose.connection.readyState === 1) {
        return
    }
    const dbUrl = process.env.DB_HOST || 'mongodb://127.0.0.1:27017/acgn_list'
    try {
        await mongoose.connect(dbUrl, {
            serverSelectionTimeoutMS: 5000 // 5秒连不上立刻抛出真实原因，不傻等10秒buffering
        })
        isConnected = true
        console.log('数据库连接成功')
    } catch (err) {
        // 把当前读到的 DB_HOST 类型也附带在错误里，方便一眼排查是不是没读到环境变量
        const hostType = process.env.DB_HOST 
            ? (process.env.DB_HOST.includes('mongodb+srv') ? '云数据库(Atlas)' : `自定义地址(${process.env.DB_HOST})`) 
            : '未读到process.env.DB_HOST，回退到了本地127.0.0.1'
        err.message = `[当前数据源: ${hostType}] ${err.message}`
        throw err
    }
}

module.exports = mongoose.connection
module.exports.connectDB = connectDB