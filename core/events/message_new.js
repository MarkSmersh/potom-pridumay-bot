const getTikTok = require ('../functions/getTikTok')
const UrlRegex = /^http[s]?:\/\//gm

const message_new = async (e, client) => {
    const Text = e.message.text.toLowerCase()
    const TextArr = e.message.text.split(' ')
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
            if (Text.match(UrlRegex) === null && AttachmentUrl.match(UrlRegex) === null) break
            const res = await getTikTok(client, e, AttachmentUrl || e.message.text)
        }
    }
    if (TextArr[0].toLowerCase() === 'банан') {
        if (TextArr.length === 1) {
            await client.request('messages.send', {
                'peer_ids': e.message.peer_id, 
                'message': 'No users?', 
                'random_id': '0'
            })
            return 
        }
        const members = await client.request('messages.getConversationMembers', {
            "peer_id": e.message.peer_id,
        })
        const admins = (() => {
            var result = []
            let adminsInfo = members.items.filter(user => user.is_admin === true)
            for (let i = 0; i < adminsInfo.length; i++) {
                result.push(adminsInfo[i].member_id)
            }
            return result
        })()
        let isAdmin = admins.includes(e.message.from_id)
        if (!isAdmin) {
            await client.request('messages.send', {
                'peer_ids': e.message.peer_id, 
                'message': 'Не, тебе нельзя', 
                'random_id': '0'
            })
            return
        }
        let screenNames = (async () => {
            var result  = []
            let targets = TextArr
            targets.shift()
            targets.filter((target, i, arr) => {
                arr[i] = target.split('/').at(-1)
                return arr[i]
            })

            for (let i = 0; i < members.profiles.length; i++) {
                if (targets.includes(members.profiles[i].screen_name)) {
                    if (admins.includes(members.profiles[i].id)) {
                        await client.request('messages.send', {
                            'peer_ids': e.message.peer_id, 
                            'message': `Попытка забанить @${members.profiles[i].screen_name}(админа)`, 
                            'random_id': '0'
                        })
                    }
                    else {
                        result.push(members.profiles[i].id)
                    }
                }   
            }
            console.log(result)
            return result
        })()
        for (let i = 0; i < screenNames.length; i++) {
            userId = await client.request('utils.resolveScreenName', {
                "screen_name": screenNames[i]
            })
            userId = userId.object_id
            await client.request('messages.removeChatUser', {
                'chat_id': e.message.peer_id - 2000000000, 
                'user_id': userId
            })
        }
    }
}

module.exports = message_new