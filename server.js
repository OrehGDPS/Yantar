const http = require("http");
const WebSocket = require("ws");

const PORT = process.env.PORT || 3000;

console.log("🔥 SERVER BOOTING...");

const server = http.createServer((req, res) => {
    res.end("online");
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
    console.log("🟢 Client connected");

    ws.on("message", (msg) => {
        console.log("📩 Message:", msg.toString());

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msg.toString());
            }
        });
    });
});

server.listen(PORT, "0.0.0.0", () => {
    console.log("🚀 Server running on port:", PORT);
});
