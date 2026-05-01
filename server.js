const http = require("http");
const WebSocket = require("ws");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    res.end("online");
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
    ws.on("message", (msg) => {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msg.toString());
            }
        });
    });
});

server.listen(PORT, "0.0.0.0");
