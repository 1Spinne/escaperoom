// Socket.io
const socket = io("ws://localhost:5000")

socket.emit("join", "es09aecr,frontend")

const flregexchar = /^[a-zäöüß\d]$/i
const flregexstr = /^[a-zäöüß\d]{4}$/i

function enterFullscreen(element) {
    if(element.requestFullscreen) {
        element.requestFullscreen();
    } else if(element.msRequestFullscreen) {      // for IE11 (remove June 15, 2022)
        element.msRequestFullscreen();
    }   else if(element.webkitRequestFullscreen) {  // iOS Safari
        element.webkitRequestFullscreen();
    }
}

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'j') {
        enterFullscreen(document.documentElement);               // ganze Seite
    }
})

const form = document.getElementById("code")
const w = document.getElementById("w")
const submitButton = document.getElementById("semiSubmit")

let code = "...."
let id = "-1"
let last = ""

socket.on("code", text => {
    if (flregexstr.test(text)) {
        code = text
    }
    console.log(text)
})

socket.on("id", id => {
    id = id
    document.getElementById("id").innerHTML = id
})

form.elements[0].focus()

form.addEventListener('submit', (e) => {
    submit()
    e.preventDefault()
});

function submit(e) {
    if ((form.elements["a"].value + form.elements["b"].value + form.elements["c"].value + form.elements["d"].value).toLowerCase() === code) {
        form.reset()
        window.location.replace("win.html")
    } else {
        submitButton.classList.add("wrong")
        submitButton.innerHTML = "Falsch"

        setTimeout(() => {
            submitButton.classList.remove("wrong")
            submitButton.innerHTML = "Überprüfen"
        }, 2000);
    }
    form.elements[0].focus()
    form.elements[0].select()
}

for (var i = 0; i < form.elements.length; i++) {
    (function(index) {
        form.elements[index].addEventListener("keyup", (e) => {
            if (flregexchar.test(e.key)) {
                if (index != 3) {
                    form.elements[index + 1].focus()
                    form.elements[index + 1].select()
                }

                last = e.key
            } else if (index != 0 && e.key === "Backspace") {
                if (last === "") {
                    form.elements[index-1].focus()
                    form.elements[index-1].select()
                } else {
                    last = ""
                }
                
            }
        })
    })(i);
}

for (var i = 0; i < form.elements.length; i++) {
    (function(index) {
        form.elements[index].addEventListener("focus", (e) => {
            last = form.elements[index].value
            form.elements[index].select()
        })
    })(i);
}
