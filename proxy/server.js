// WebSocket Proxy for Starblast.io
// Accepts WebSocket connections from the game client and forwards them to
// starblast.io game servers with a spoofed Origin header.

const http = require("http");
const { WebSocketServer, WebSocket } = require("ws");

const PORT = process.env.PORT || 8080;
const ALLOWED_DOMAIN = ".starblast.io";

// HTTP server (health check)
const server = http.createServer((req, res) => {
	if (req.url === "/" || req.url === "/health") {
		res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
		res.end(JSON.stringify({ status: "ok", service: "starblast-ws-proxy" }));
	} else {
		res.writeHead(404);
		res.end("Not found");
	}
});

// WebSocket server
const wss = new WebSocketServer({ server });

wss.on("connection", (clientWs, req) => {
	const url = new URL(req.url, `http://localhost:${PORT}`);
	const target = url.searchParams.get("target");

	if (!target) {
		console.log("[proxy] Missing ?target= parameter");
		clientWs.close(400, "Missing target parameter");
		return;
	}

	// Validate target domain
	try {
		const targetUrl = new URL(target);
		if (!targetUrl.hostname.endsWith(ALLOWED_DOMAIN)) {
			console.log("[proxy] Rejected target:", targetUrl.hostname);
			clientWs.close(403, "Target must be a *.starblast.io domain");
			return;
		}
	} catch (e) {
		console.log("[proxy] Invalid target URL:", target, e.message);
		clientWs.close(400, "Invalid target URL");
		return;
	}

	console.log("[proxy] New connection →", target);

	// Connect to the starblast game server with spoofed Origin
	const serverWs = new WebSocket(target, {
		origin: "https://starblast.io",
		headers: {
			Origin: "https://starblast.io",
		},
	});

	serverWs.on("open", () => {
		console.log("[proxy] Target OPEN:", target);
	});

	// Forward: target → client
	serverWs.on("message", (data) => {
		try {
			clientWs.send(data);
		} catch (_) {}
	});

	// Forward: client → target
	clientWs.on("message", (data) => {
		try {
			serverWs.send(data);
		} catch (_) {}
	});

	// Close propagation
	serverWs.on("close", (code, reason) => {
		console.log("[proxy] Target CLOSE:", code, target);
		try {
			clientWs.close(code, reason);
		} catch (_) {}
	});

	clientWs.on("close", (code, reason) => {
		console.log("[proxy] Client CLOSE:", code);
		try {
			serverWs.close(code, reason);
		} catch (_) {}
	});

	// Error handling
	serverWs.on("error", (err) => {
		console.log("[proxy] Target ERROR:", err.message, target);
		try {
			clientWs.close(1011, "Target connection error");
		} catch (_) {}
	});

	clientWs.on("error", (err) => {
		console.log("[proxy] Client ERROR:", err.message);
		try {
			serverWs.close(1011, "Client error");
		} catch (_) {}
	});
});

server.listen(PORT, () => {
	console.log(`[proxy] Starblast WebSocket proxy listening on port ${PORT}`);
	console.log(`[proxy] Usage: ws://host:${PORT}/?target=wss://IP.starblast.io:PORT`);
});
