var WebSocketServer = require("websocketserver");
var server = new WebSocketServer("all", 7000);

var chars = "abcd"

server.on("connection", function(id) {
   server.sendMessage("one", chars, id);
})

server.on("message", function(data, id) {
   let rawData = server.unmaskMessage(data)
   let mes = server.convertToString(rawData.message).split(",")
   if (mes[0] === "es09aecr") {
      chars = mes[1]
      server.sendMessage("all", mes[1]);
   }
})