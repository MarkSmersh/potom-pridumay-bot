const getTikTok = require ('../functions/getTikTok')
const fs = require ('fs')
const UrlRegex = /^http[s]?:\/\//gm

const message_new = async (e, client) => {
    const Text = e.message.text.toLowerCase()
    const Attachments = e.message.attachments

    switch (Text) {
        case 'пинг': {
            const lastData = Date.now()
            const oldMessage = await client.request('messages.send', 
                { 'peer_ids': e.message.peer_id, 
                'message': `Пинг...`, 
                'random_id': '0'}
            )
        
            await client.request('messages.edit', 
                {'peer_id': e.message.peer_id, 
                'message': `Понг: ${Date.now() - lastData} мс`, 
                'conversation_message_id': oldMessage[0]['conversation_message_id'], 
                'random_id': '0'}
            )
            break
        }
        default: {
            const AttachmentUrl = (() => {
                const link = Attachments.find(a => a.type === 'link')
                if (link !== undefined) return link.link.url
                return ''
            })()
            if (Text.match(UrlRegex) === null && AttachmentUrl.match(UrlRegex) === null) return
            const res = await getTikTok(client, e, AttachmentUrl || Text)
            console.log(res)
        }
    }
}

module.exports = message_new