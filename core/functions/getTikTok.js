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

    await uploadPost(uploadUrl.response.upload_url, FilePath).then(async function SendVideo(res, edit = false, c_message_id = null, peer_id = null) {
        if (!edit) {
            var message = await c.request('messages.send', {
                "peer_ids": e.message.peer_id,
                "message": '',
                "attachment": `video${res.owner_id}_${res.video_id}`,
                "random_id": video.response.name
            })
            message = message[0]
        }
        else if (edit) {
            var message = await c.request('messages.edit', {
                "peer_id": e.message.peer_id,
                "message": ``,
                "attachment": `video${res.owner_id}_${res.video_id}`,
                "conversation_message_id": c_message_id 
            })
        }
        const messageInfo = await c.request('messages.getByConversationMessageId', { "peer_id": peer_id || message['peer_id'], "conversation_message_ids": c_message_id || message['conversation_message_id']})
        if (messageInfo.items[0].attachments.length === 0) await SendVideo(res, true, c_message_id || messageInfo.items[0].conversation_message_id, peer_id || message['peer_id'])
        
        // setTimeout(() => { c.request('messages.send', {"peer_ids": e.message.peer_id,"reply_to": e.message.id,"message": video.response.name,"attachment": `video${res.owner_id}_${res.video_id}`,"random_id": video.response.name + 1})}, 10 * 1000)
    })
    return { "ok": true, "response": FilePath }
} 

module.exports = publishTikTok