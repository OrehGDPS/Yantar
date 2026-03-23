const WebSocket = require("ws");
const http = require("http");

const server = http.createServer();
const wss = new WebSocket.Server({ server });

let clients = [];

wss.on("connection", (ws) => {
    console.log("Игрок подключился");

    clients.push(ws);

    ws.on("message", (message) => {
        console.log("Сообщение:", message.toString());

        // отправляем ВСЕМ (включая себя)
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

const PORT = process.env.PORT || 25565;

server.listen(PORT, () => {
    console.log("Сервер запущен на порту " + PORT);
});
