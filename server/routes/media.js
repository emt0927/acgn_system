const express = require('express')
const router = express.Router()
const token = require('../middlewares/token')

router.post('/test', token, async (req, res) => {
    try {
        res.json({
            code: 200,
            message: '作品录入成功!'
        })
    } catch (error) {

    }
})  
module.exports = router