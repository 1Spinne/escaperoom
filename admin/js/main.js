const socket = io("ws://localhost:5000")

socket.emit("join", "es09aecr,admin")

let frontends = 0

socket.addEventListener("frontends", fes => {
    frontends++
    fes.forEach(fe => {
        const html = `<div id=` + fe.id + ` class='fe-ctrl'><frontend-controls id=` + fe.id + ` code=` + fe.code + ` time=` + fe.time + `></frontend-controls></div>`
        document.getElementsByClassName("fe-ctrls")[0].insertAdjacentHTML("beforeend" , html)
    })
})

socket.addEventListener("new_frontend", fe => {
    console.log(fe)
    const html = `<div id=` + fe.id + ` class='fe-ctrl'><frontend-controls id=` + fe.id + ` code=` + fe.code + ` time=` + fe.time + `></frontend-controls></div>`
    document.getElementsByClassName("fe-ctrls")[0].insertAdjacentHTML("beforeend" , html)
})

socket.addEventListener("frontend_dc", (id) => {
    let fe_ctrl = document.getElementById(id)
    fe_ctrl.remove()
    frontends--
})
