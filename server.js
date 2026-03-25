// server.js
const WebSocket = require("ws");
const http = require("http");

// Лог запуска, чтобы сразу видеть в логах Railway
console.log("Server.js загружен и стартует...");

// Создаем HTTP сервер (Railway требует обертку для WebSocket)
const server = http.createServer();
const wss = new WebSocket.Server({ server });

let clients = [];

wss.on("connection", (ws) => {
    console.log("Игрок подключился");
    clients.push(ws);

    ws.on("message", (message) => {
        console.log("Сообщение:", message.toString());
        // Отправляем всем клиентам (включая отправителя)
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });

    ws.on("close", () => {
        clients = clients.filter(c => c !== ws);
        console.log("Игрок отключился");
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("Сервер запущен на порту " + PORT);
});
