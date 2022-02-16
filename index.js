const { token, version } = require('./config.json')
const Client = require('./core/client')

const client = new Client (token, version)
client.start()

client.once('start', info => {
  console.log(`${info.name} - запущен`)
})

client.on('message_new', async e => {
  if (e.object.message.text.toLowerCase() === 'пинг' && e.type === 'message_new' && e.object.message.text) {

    const lastData = Date.now()
    const oldMessage = await client.request('messages.send', 
    { 'peer_ids': e.object.message.peer_id, 'message': `Пинг...`, 'random_id': '0'})

    await client.request('messages.edit', 
    {'peer_id': e.object.message.peer_id, 'message': `Понг: ${Date.now() - lastData} мс`, 'conversation_message_id': oldMessage[0]['conversation_message_id'], 'random_id': '0'})
  } 
})

client.on ('error', error => {
  console.log(error)
})

console.log(client.eventNames())