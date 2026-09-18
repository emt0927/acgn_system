const mongoose = require('mongoose');
const recordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    date: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['midia', 'series']
    },
    add: {
        type: Number,
        default: 0
    },
    addedTitles: {
        type: [String],
        default: []
    },
    clear: {
        type: Number,
        default: 0
    },
    deletedTitles: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
})
recordSchema.index({ userId: 1, type: 1, date: 1 }, { unique: true })
module.exports = mongoose.model('record', recordSchema)
