const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const port = process.env.PORT || 4001;
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));

function getIdAndJoinCodeForSimulator(socket) {
  const id = socket.id;
  const joinCode = `${id}-simulator`;
  return { id, joinCode };
}

io.on("connection", (socket) => {
  socket.on("simulation-connect", (data) => {
    const { id, joinCode } = getIdAndJoinCodeForSimulator(socket);
    socket.join(joinCode);
    io.to(joinCode).emit("simulation-id", { id: id });
  });
  socket.on("device-connect", (data) => {
    const id = data.id;
    console.log("DEVICE_CONNECTED id - " + id);
    socket.on("device-data", (deviceData) => {
      const joinCode = `${id}-simulator`;
      io.to(joinCode).emit("simulator-data", deviceData);
    });
    socket.on("device-caliberate", (deviceData) => {
      const joinCode = `${id}-simulator`;
      io.to(joinCode).emit("simulator-caliberate", deviceData);
    });
  });
});
server.listen(port, () => console.log(`Listening on port ${port}`));
