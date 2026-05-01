const http = require("http");
const WebSocket = require("ws");

const PORT = process.env.PORT || 3000;

const app = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("online");
});

const wss = new WebSocket.Server({ server: app });

wss.on("connection", (ws) => {
  console.log("client connected");

  ws.on("message", (msg) => {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg.toString());
      }
    });
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Started on " + PORT);
});
