const scrapTikTokPage = require ('../utils/scrapTikTokPage')
const awaitedGet = require('../utils/awaitedGet')
const downloadStream = require ('../utils/downloadStream.js')
const { user_token } = require ('../../config.json')
const uploadPost = require ('../utils/uploadVkVideo')
const fs = require('fs')

const publishTikTok = async (c, e, url) => {
    const scrapped = await scrapTikTokPage(url)
    if (scrapped === null) return
    const video = await downloadStream(scrapped, './tmp/', 'mp4')
    if (!video.ok) return { "ok": false, "error": video.error }
    const FilePath =`${video.response.path}${video.response.name}.${video.response.type}`

    const videoInfoParams = {
        "name": video.response.name,
        "description": "Uploaded with @potom_pridumay_bot",
        "is_private": 0,
        "wallpost": 0,
        "no_comments": 1,
        "compression": 1
    }
    const uploadUrl = await awaitedGet(
        `https://api.vk.com/method/video.save?${new URLSearchParams(videoInfoParams)}&access_token=${process.env.USERTOKEN || user_token}&v=${c.version}`
    )

    await uploadPost(uploadUrl.response.upload_url, FilePath).then(res => {
        c.request('messages.send', {
            "peer_ids": e.message.peer_id,
            "reply_to": e.message.id,
            "message": "",
            "attachment": `video${res.owner_id}_${res.video_id}`,
            "random_id": video.response.name
        })
    })
    return { "ok": true, "response": FilePath }
} 

module.exports = publishTikTok