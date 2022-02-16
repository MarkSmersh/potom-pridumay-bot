const checkClient = require ('../utils/checkClient')
const awaitedGet = require ('../utils/awaitedGet')
const EventEmitter = require('events');

class Client extends EventEmitter{

    accessToken
    version

    constructor (token, v) {
        super()
        this.accessToken = token
        this.version = v
    }

    async start () {
        if (!checkClient) return
    
        const currentGroup = await this.request('groups.getById')
        // console.log(currentGroup)
        let LongPollServer = await this.request('groups.getLongPollServer', {'group_id': currentGroup[0]['id']})
        this.ts     = LongPollServer.ts
        this.key    = LongPollServer.key
        this.server = LongPollServer.server
        this.longpoll ()
        this.emit('start', currentGroup[0])
    }

    async request (method, params = {}) {
        const url  = `https://api.vk.com/method/${method}?${new URLSearchParams(params)}&access_token=${this.accessToken}&v=${this.version}`
        const answer = await awaitedGet(url)
        if (answer.error) console.log (`[${answer.error.error_code}] ${answer.error.error_msg}`)
        return answer['response']
    }

    async longpoll () {
        const url    = `${this.server}?act=a_check&key=${this.key}&ts=${this.ts}&wait=25`
        const answer = await awaitedGet(url)
        if (answer.updates.length !== 0) {
            for (let i = 0; i < answer.updates.length; i++) {
                console.log(answer['updates'][i]['type'])
                this.emit(answer['updates'][i]['type'], answer['updates'][i])
            }
        }
        this.ts = answer.ts
        await this.longpoll()
    }
}

module.exports = Client