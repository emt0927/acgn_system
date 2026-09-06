const mongoose = require('mongoose')
const seriesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    title: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        enum: ['anime', 'manga', 'game', 'novel']
    },
    originalTitle: {
        type: String,
        trim: true
    },
    coverUrl: {
        type: String,
        default: ''
    },
    comment: {
        type: String,
        default: ''
    },
    tags: {
        type: [String],
        default: []
    },
}, {
    timestamps: true // updatedAt 时间戳
})
module.exports = mongoose.model('series', seriesSchema)