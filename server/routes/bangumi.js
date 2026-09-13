const express = require("express");
const router = express.Router()
const axios = require('axios')

// 快速搜索
router.get('/searchList', async (req, res) => {
    try {
        const { keyword, type } = req.query
        console.log(keyword, type);
        const typeMap = {
            anime: [2],
            novel: [1],
            manga: [1],
            game: [4]
        }
        const targetType = typeMap[type] || [2]
        // 请求
        const response = await axios.post('https://api.bgm.tv/v0/search/subjects', {
            keyword: keyword.trim(),
            filter: {
                type: targetType
            }
        }, {
            headers: {
                'User-Agent': 'acgn_system/1.0 (https://github.com/emt0927/acgn_system)'
            },
            timeout: 15000
        })
        // 数据清洗
        const rawList = response.data.data || []
        const getInfoboxValue = (infobox, keyName) => {
            if (!Array.isArray(infobox)) return ''
            const target = infobox.find(item => item.key === keyName)
            if (!target) return ''
            if (typeof target.value === 'string') {
                return target.value
            } else if (Array.isArray(target.value)) {
                return target.value.map(v => (typeof v === 'object' ? v.v || v.k || '' : v)).json('/')
            }
            return String(target.value)
        }
        if (rawList.value === 0) {
            return res.json({
                code: 200,
                message: "暂无数据",
                data: []
            })
        }
        const formattedList = rawList.map(item => ({
            id: item.id,
            date: item.date,
            title: item.name_cn || item.name,
            originalTitle:item.name,
            coverUrl:item.image,
            director: getInfoboxValue(item.infobox, '导演'),
            characterDesign: getInfoboxValue(item.infobox, '人物设定'),
            originalWork: getInfoboxValue(item.infobox, '原作')

        }))
        res.json({
            code: 200,
            message: '搜索成功',
            data: formattedList
        })
    } catch (error) {
        res.status(500).json({ code: 500, message: '服务器内部错误', data: [] })
    }
})
module.exports = router
