const awaitedGet = require('../utils/awaitedGet')

async function checkClient(token, v) {

    const data = await awaitedGet (`https://api.vk.com/method/utils.getServerTime?access_token=${token}&v=${v}`)

    console.log(data)

    if (data['response']) {
        return true
    }
    else if (data['error']) {
        throw new Error (`[${data['error']['error_code']}] ${data['error']['error_msg']}`)
    }
    else {
        throw new Error ('Unknown error.')
    }

}

module.exports = checkClient