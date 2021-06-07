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
var positions = ["","","",
                "","","",
                "","",""]

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
        if(positions[location] == "X" || positions[location] == "O") return
        if(xClient == socket){
            if(turn != "X") return
            positions[location] = "X"
            turn = "O"
        }else if(oClient == socket){
            if(turn != "O") return
            positions[location] = "O"
            turn = "X"
        }
        xClient.emit('render',positions)
        oClient.emit('render',positions)
        checkWin()
    })

    function win(who){
        xClient.emit('win',who)
        oClient.emit('win',who)
        xClient = null
        oClient = null
        isPlaying = false
        turn = "X"
        positions = ["","","",
                    "","","",
                    "","",""]
    }

    function checkWin(){
        if((positions[0] == positions[1] && positions[1] == positions[2]) && positions[0] != "") win(positions[0])
        else if((positions[3] == positions[4] && positions[4] == positions[5]) && positions[3] != "") win(positions[3])
        else if((positions[6] == positions[7] && positions[7] == positions[8]) && positions[6] != "") win(positions[6])

        else if((positions[0] == positions[3] && positions[3] == positions[6]) && positions[0] != "") win(positions[0])
        else if((positions[1] == positions[4] && positions[4] == positions[7]) && positions[1] != "") win(positions[1])
        else if((positions[2] == positions[5] && positions[5] == positions[8]) && positions[2] != "") win(positions[2])

        else if((positions[0] == positions[4] && positions[4] == positions[8]) && positions[0] != "") win(positions[0])
        else if((positions[2] == positions[4] && positions[4] == positions[6]) && positions[2] != "") win(positions[2])
    }
})

server.listen(3000)