const express = require('express')
const path = require('path')

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.use('/', (req, res) => {
    res.render('index.html')
})

var xClient
var oClient
var isPlaying = false
var turn = "X"
var positions = [" "," "," ",
                " "," "," ",
                " "," "," "]

io.on('connection', socket =>{
    console.log("> Socket conectado " + socket.id)

    socket.on('xselected', function(){
        if(xClient == null || xClient == undefined){
            xClient = socket
            socket.emit('confirm')
            if(oClient == null || oClient == undefined){

            }else{
                xClient.emit('start')
                oClient.emit('start')
                isPlaying = true
            }
        }
    })

    socket.on('oselected', function(){
        if(oClient == null || oClient == undefined){
            oClient = socket
            socket.emit('confirm')
            if(oClient == null || oClient == undefined){

            }else{
                xClient.emit('start')
                oClient.emit('start')
                isPlaying = true
            }
        }
    })


    socket.on('move',loc =>{
        var location = loc
        console.log(location)
        if(positions[location] == "X" || positions[location] == "O") return
        if(xClient == socket){
            if(turn != "X") return
            positions[location] = "X"
            console.log(positions)
            turn = "O"
            xClient.emit('render',positions)
            oClient.emit('render',positions)
        }else if(oClient == socket){
            if(turn != "O") return
            positions[location] = "O"
            console.log(positions)
            turn = "X"
            xClient.emit('render',positions)
            oClient.emit('render',positions)
        }
    })
})

server.listen(3000)