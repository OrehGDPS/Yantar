const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: process.env.PORT || 3000 });

const FIRESTORE_URL =
"https://firestore.googleapis.com/v1/projects/yantar-b1d5c/databases/(default)/documents/messages";

// 💾 сохранение (через встроенный fetch Node 18+)
async function saveMessage(text, user) {
    try {
        await fetch(FIRESTORE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fields: {
                    text: { stringValue: text || "" },
                    user: { stringValue: user || "unknown" },
                    time: { integerValue: Date.now().toString() }
                }
            })
        });
    } catch (e) {
        console.log("Firestore error:", e);
    }
}

wss.on("connection", (ws) => {

    console.log("Client connected");

    ws.on("message", async (msg) => {
        try {
            const data = JSON.parse(msg.toString());

            if (!data.text) return;

            await saveMessage(data.text, data.user);

            // 📡 broadcast всем
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: "message",
                        user: data.user,
                        text: data.text
                    }));
                }
            });

        } catch (err) {
            console.log("Message error:", err);
        }
    });

});
