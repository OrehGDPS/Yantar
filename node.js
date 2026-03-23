const WebSocket = require("ws");

const server = new WebSocket.Server({ port: process.env.PORT || 12345 });
let clients = [];

server.on("connection", (ws) => {
    clients.push(ws);

    ws.on("message", (msg) => {
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msg.toString());
            }
        });
    });

    ws.on("close", () => {
        clients = clients.filter(c => c !== ws);
    });
});

console.log("Сервер запущен!");
