// Example commands
Command.register('rm', (line, parsed) => {
    return new Promise((resolve) => {
        if(parsed.sudo) {
            line('removing /')

            setTimeout(() => {
                line('Just kidding!')
                resolve()
            }, 2000)
        } else {
            line('No.')
            resolve()
        }
    })
})
