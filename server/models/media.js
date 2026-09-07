const mongoose = require('mongoose')
// 作品相关
const mediaSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    title: {
        type: String,
        trim: true,
    },
    originalTitle: {
        type: String,
        trim: true,
    },
    series: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'series'
    },
    type: {
        type: String,
        enum: ['anime', 'manga', 'game', 'novel']
    },
    subType: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['wish', 'doing', 'done', 'dropped']
    },
    rating: {
        type: Number,
        default: 0
    },
    progress: {
        current: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
        text: { type: String, trim: true, default: '' },
    },
    coverUrl: {
        type: String,
        default: ''
    },
    comment: {
        type: String,
        default: ''
    },
    author: {
        type: String,
        default: ''
    },
    director: {
        type: String,
        default: ''
    },
    studio: {
        type: String,
        default: ''
    },
    startDate: {
        type: String,
        default: ''
    },
    finishDate: {
        type: String,
        default: ''
    }
}, {
    timestamps: true // updatedAt 时间戳
})
module.exports = mongoose.model('Media', mediaSchema)
