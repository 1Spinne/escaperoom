const http = require("http").createServer()

const io = require("socket.io")(http, {
    cors: { origin: "*" }
})

let frontends = []
joined_frontends = 0
const pass = "es09aecr"
const coderegex = /^[a-zäöüß\d]{4}$/i
const timeregex = /^-?\d+$/

io.on('connection', function (socket) {

    let isFrontend = false
    let id = 0

    socket.on("join", (message) => {
        let mes = message.split(",")
        if (mes[0] === pass) {
            if (mes[1] === "frontend") {
                socket.join("frontend")
                isFrontend = true
                id = joined_frontends
                socket.join(id)
                joined_frontends++
                frontends.push({
                    id: id,
                    code: "9q6c", //schwert, auge, dreieck, stern 1: c, 2: 5
                    time: 0,
                    timeSetDate: 0,
                    timeGetDate: 0
                })
                io.to("admin").emit("new_frontend", frontends[frontends.length - 1])
                socket.emit("id", id)
                let frontend = frontends.filter(obj => {
                    return obj.id == id
                })
                socket.emit("code", frontend[0].code)
            } else if (mes[1] === "admin") {
                socket.join("admin")
                // console.log(getDate)
                // console.log(setDate)
                // console.log()
                frontends.forEach((frontend, index) => {
                    let calced_time = frontend.time - Math.round((Date.now() - frontends[index].timeSetDate) / 1000)
                    if (calced_time > 0) {
                        frontends[index].time = calced_time
                    }
                    // console.log(frontend)
                    // console.log(frontends[index])
                    // console.log()
                });
                socket.emit("frontends", frontends)
            }
        } else {
            socket.disconnect()
        }
        
    })

    socket.on("disconnect", () => {
        if (isFrontend) {
            let frontend = frontends.filter(obj => {
                return obj.id == id
            })
            io.emit("frontend_dc", id)
            let index = frontends.indexOf(frontend[0])
            frontends.splice(index, 1)
        }
    })

    socket.on('code', (message) => {
        let mes = message.split(",")
        if (coderegex.test(mes[1])) {
            io.to(parseInt(mes[0])).emit("code", mes[1])
            socket.emit("code", mes[0] + "," + mes[1])
            let frontend = frontends.filter(obj => {
                return obj.id == mes[0]
            })
            frontend[0].code = mes[1]
            
        } else {
            console.log("Invalid code")
        }
    })

    socket.on('time', (message) => {
        if (timeregex.test(message)) {
            io.to("admin").emit("time", id + "," + message)
            let frontend = frontends.filter(obj => {
                return obj.id == id
            })
            frontend[0].time = parseInt(message)
            frontend[0].timeSetDate = Date.now()
        } else {
            console.log("Invalid time")
        }
    })
})

http.listen(9000, () => {console.log("Server started on port 9000")})