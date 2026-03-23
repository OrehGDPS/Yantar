const WebSocket = require("ws");

const server = new WebSocket.Server({ port: process.env.PORT || 12345 });

let clients = [];

server.on("connection", (ws) => {
    clients.push(ws);

    console.log("Подключился игрок");

    ws.on("message", (message) => {
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });

    ws.on("close", () => {
        clients = clients.filter(c => c !== ws);
    });
});
