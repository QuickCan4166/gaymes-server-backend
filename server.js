const { createBareServer } = require("@tomphttp/bare-server-node");
const express = require("express");
const http = require("http");

const app = express();
const bareServer = createBareServer("/bare/");

// Health check route
app.get("/", (req, res) => res.send("Bare server running!"));

const server = http.createServer((req, res) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.destroy();
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Bare server on port ${PORT}`));