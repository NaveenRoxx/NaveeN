import fetch from "node-fetch";

export async function handler(event) {
    try {
        const formData = await event.body;
        const boundary = event.headers["content-type"].split("boundary=")[1];
        const rawBody = Buffer.from(event.body, "base64").toString("utf-8");
        const match = /filename="([^"]+)"\r\nContent-Type:[^\r]+\r\n\r\n([\s\S]*)\r\n--/.exec(rawBody);
        if (!match) return { statusCode: 400, body: "Invalid upload" };

        const filename = match[1];
        const fileData = match[2];
        const base64 = Buffer.from(fileData, "binary").toString("base64");

        const USERNAME = "NaveenRoxx";
        const REPO = "NaveeN";
        const PATH = `ModelDashBoard/Models/${filename}`;
        const TOKEN = process.env.GITHUB_TOKEN;

        const res = await fetch(`https://api.github.com/repos/${USERNAME}/${REPO}/contents/${PATH}`, {
            method: "PUT",
            headers: {
                Authorization: `token ${TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: `Upload ${filename}`,
                content: base64
            })
        });

        if (!res.ok) {
            const err = await res.text();
            return { statusCode: 500, body: err };
        }

        return { statusCode: 200, body: "Uploaded" };
    } catch (e) {
        return { statusCode: 500, body: e.message };
    }
}
