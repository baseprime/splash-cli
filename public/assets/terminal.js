var term = new Terminal()
var currentLine = ''

term.open(document.getElementById('terminal'))

if ('undefined' === typeof DOMAIN) {
    var DOMAIN = window.location.host
}

if ('undefined' === typeof BASH_PROMPT) {
    var BASH_PROMPT = '[guest@' + DOMAIN + ']$ '
}

term.write('Welcome to \x1B[1;3;31m' + DOMAIN + '\x1B[0m\r\n\n')

term.prompt = () => {
    term.write(BASH_PROMPT)
    currentLine = ''
}

function Command(value, handler) {
    this.value = value
    this.handler = handler || new Promise((r) => r(undefined))
    Command.commands.push(this)
}

Command.commands = []

Command.find = function (key) {
    return Command.commands.find((command) => {
        return String(command.value).toLowerCase() === String(key).toLowerCase()
    })
}

Command.parse = function (string) {
    let sudo = false
    let sudoRegexp = /^sudo /

    if (string.match(sudoRegexp)) {
        sudo = true
        string = string.replace(sudoRegexp, '')
    }

    let args = string.split(' ')
    let value = args.shift()

    return {
        sudo,
        value,
        args,
    }
}

Command.register = function (value, handler) {
    if (Array.isArray(value)) {
        value.forEach((cmdString) => new Command(cmdString, handler))
    } else {
        new Command(value, handler)
    }
}

Command.prototype.run = function (context) {
    return new Promise((resolve, reject) => {
        resolve(this.handler.call(this, term.writeln.bind(term), context))
    })
}

// Bootstrap Terminal
term.prompt()
term.focus()
term.resize(100, 100)

term.onKey((event) => {
    if (event.domEvent.keyCode === 13) {
        term.write('\r\n')
        let parsed = Command.parse(currentLine)
        let cmd = Command.find(parsed.value)

        if (cmd) {
            cmd.run(parsed).then(() => {
                term.write('\r\n')
                term.prompt()
                if('undefined' !== typeof mixpanel) {
                    mixpanel.track('command', parsed.value, parsed);
                }
            })
        } else if (parsed.value.length > 0) {
            term.write('-bash: ' + parsed.value + ': command not found')
            term.writeln('')
            term.prompt()
        } else {
            term.prompt()
        }
    } else if (event.domEvent.keyCode === 8) {
        if(!currentLine.length) {
            return false
        }

        currentLine = currentLine.slice(0, currentLine.length - 1)
        term.write('\b \b')
    } else {
        term.write(event.key)
        currentLine += event.key
    }
})
