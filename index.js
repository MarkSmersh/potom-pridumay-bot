const { token, version } = require('./config.json')
const Client = require('./core/client')

const message_new = require('./core/events/message_new')

const client = new Client (process.env.TOKEN || token, version)
client.start()

client.once('start', info => {
  console.log(`${info.name} - запущен`)
})

client.on('message_new', async e => {
  message_new(e, client)
})

client.on ('error', error => {
  console.log(error)
})
