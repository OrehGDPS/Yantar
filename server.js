const WebSocket = require("ws");
const fetch = require("node-fetch");

const wss = new WebSocket.Server({ port: process.env.PORT || 3000 });

const FIRESTORE_URL =
"https://firestore.googleapis.com/v1/projects/yantar-b1d5c/databases/(default)/documents/messages";

// 💾 сохранить сообщение
async function saveMessage(text, user) {
    await fetch(FIRESTORE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fields: {
                text: { stringValue: text },
                user: { stringValue: user },
                time: { integerValue: Date.now().toString() }
            }
        })
    });
}

// 📡 WebSocket чат
wss.on("connection", (ws) => {

    ws.on("message", async (msg) => {
        const data = JSON.parse(msg);

        await saveMessage(data.text, data.user);

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: "message",
                    user: data.user,
                    text: data.text
                }));
            }
        });
    });
});
