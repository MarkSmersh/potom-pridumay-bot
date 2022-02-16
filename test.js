const random_id = [] 
    for (let i = 0; i < 32; i++) {
      random_id.push(Math.floor(Math.random() * 9))
    }
    const result = random_id.join('')
    console.log(result)