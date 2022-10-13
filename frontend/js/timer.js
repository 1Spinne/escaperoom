String.prototype.toMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return minutes+':'+seconds;
}


var timerField = document.getElementById("timer")
var timerButtons = document.getElementById("buttons")

// buttons
var startButton5 = document.getElementById('5')
var startButton10 = document.getElementById('10')
var startButton15 = document.getElementById('15')

var explorers = new Audio("assets/klingelton.mp3")

function start(seconds) {
    const intervalId = window.setInterval(() => {}, Number.MAX_SAFE_INTEGER);

    timerButtons.style.display = "none"
    
    explorers.pause()
    explorers.currentTime = 0

    for (let i = 1; i < intervalId; i++) {
      window.clearInterval(i);
    }

    var timer = seconds
    var date = new Date(0)

    socket.emit("time", seconds)

    timerField.innerHTML = timer.toString().toMMSS()
    var timerInterval = setInterval(function() {
        timer--
        date.setSeconds(timer)
        timerField.innerHTML = timer.toString().toMMSS()
        if (timer <= 0) {
            clearInterval(timerInterval)
            explorers.play()
            timerField.innerHTML = "ZEIT ABGELAUFEN"
        }
    }, 1000)
}


function reset() {
    const intervalId = window.setInterval(() => {}, Number.MAX_SAFE_INTEGER);

    timerButtons.style.display = "block"
    
    explorers.pause()
    explorers.currentTime = 0

    socket.emit("time", -1)

    for (let i = 1; i < intervalId; i++) {
      window.clearInterval(i);
    }
    timerField.innerHTML = ""
}

//add short cut ctrl+g
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'y') {
        reset()
    }
})