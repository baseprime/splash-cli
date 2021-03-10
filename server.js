const express = require('express')
const path = require('path')
const { config } = require('./config')
const app = new express()

app.use(express.static('public'))
app.engine('.html', require('ejs').__express)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'html')

app.get('/', (req, res) => {
    res.render('index', config)
})

app.listen(config.PORT, () => {
    console.log('CLI Emulator listening on port %s', config.PORT)
})
