fetch("components/frontend_controls/frontend_controls.component.html")
    .then(stream => stream.text())
    .then(text => define(text));

function define(html) {
    String.prototype.toMMSS = function () {
        var sec_num = parseInt(this, 10); // don't forget the second param
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);
    
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return minutes+':'+seconds;
    }

    class FrontendControls extends HTMLElement {
        shadow = this.attachShadow({mode: 'open'})
        id = 4
        flregex = /^[a-zäöüß\d]{4}$/i

        code = "abcd"
        time = 0
        explorers = new Audio("assets/explorers_hinkik.mp3")

        timerInterval

        constructor() {
            super();
            this.shadow.innerHTML = html;
    
            this.shadowRoot.addEventListener("onload", this.lwOnInit())
        }

        lwOnInit() {
            this.timerField = this.shadowRoot.getElementById("timer")
            this.confirmElement = this.shadowRoot.getElementById("confirm")
            this.message = this.shadowRoot.getElementById('message')
            this.form = this.shadowRoot.getElementById("inputs")

            this.id = this.getAttribute("id")
            this.code = this.getAttribute("code")
            this.message.setAttribute("placeholder", this.code)
            this.time = this.getAttribute("time")
            if (this.time > 0) {
                this.startTimer(this.time)
            }
            this.shadowRoot.getElementById("id").innerHTML = this.id
            
            this.events()
        }

        events() {
            self = this

            this.form.addEventListener('submit', (e) => {
                e.preventDefault()
                this.sendCode()
            });

            socket.on("code", (code) => {
                let code_split = code.split(",")
                if (code_split[0] == this.id) {
                    this.message.setAttribute("placeholder", code_split[1])
                }
            })

            socket.on("time", (time) => {
                let time_split = time.split(",")
                if (time_split[0] == this.id) {
                    if (time_split[1] == -1) {
                        this.resetTimer()
                    } else {
                        this.startTimer(time_split[1])
                    }
                }
            })

            this.timerField.addEventListener('click', function(event) {
                if (self.timerField.innerHTML === "Ende") {
                    self.resetTimer()
                }
            })
        }

        startTimer(seconds) {
            this.resetTimer()
            
            let timer = seconds
            var self = this;
            this.timerField.innerHTML = timer.toString().toMMSS()
            this.timerInterval = setInterval(function() {
                timer--
                self.timerField.innerHTML = timer.toString().toMMSS()

                
                if (timer === 0) {
                    clearInterval(self.timerInterval)
                    self.timerField.innerHTML = "ENDE"
                }
            }, 1000)
        }

        resetTimer() {
            clearInterval(this.timerInterval)
            this.explorers.pause()
            this.explorers.currentTime = 0
            this.timerField.innerHTML = ""
        }

        sendCode() {
            this.confirmElement.innerHTML = ""
            if (this.flregex.test(this.message.value)) {
                socket.emit("code", this.id + "," + this.message.value)
                this.message.value = ''
            }
        }
    }



    customElements.define('frontend-controls', FrontendControls);
}
