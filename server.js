const WebSocket = require("ws");

const PORT = process.env.PORT || 25565;
const wss = new WebSocket.Server({ port: PORT });

let clients = new Map(); // клиент -> id

console.log("Сервер запущен на порту " + PORT);

// 📡 Отправка онлайна всем
function sendOnline() {
    const players = Array.from(clients.values());

    const data = JSON.stringify({
        type: "online",
        players: players
    });

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

// 🔌 Подключение
wss.on("connection", (ws) => {
    const id = Math.floor(Math.random() * 100000).toString();
    clients.set(ws, id);

    console.log("Игрок подключился:", id);

    sendOnline(); // обновить онлайн

    // 📩 Сообщения
    ws.on("message", (message) => {
        const text = message.toString();

        console.log("Сообщение:", text);

        const data = JSON.stringify({
            type: "message",
            text: text
        });

        // отправить всем
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });

    // ❌ Отключение
    ws.on("close", () => {
        console.log("Игрок вышел:", id);
        clients.delete(ws);
        sendOnline(); // обновить онлайн
    });
});
