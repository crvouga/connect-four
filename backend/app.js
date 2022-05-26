const express = require("express");
// const path = require("path");

const PORT = process.env.PORT || 9000;
const NODE_ENV = process.env.NODE_ENV || "development";
// const CLIENT_BUILD_PATH = path.join(
//   __dirname,
//   "..",
//   "client",
//   "build"
// );

const app = express();

/**
 *
 *
 *
 * Client
 *
 *
 *
 * */

// app.use(express.static(CLIENT_BUILD_PATH, {
//   maxAge: "30d"
// }));

// app.get("*", (_req, res) => {
//   res.sendFile(path.join(CLIENT_BUILD_PATH, "index.html"));
// });

app.get("*", (_req, res) => {
  res.json({ message: "Welcome to backend." });
});

/**
 *
 *
 *
 * Server
 *
 *
 *
 * */

const server = app.listen(PORT, () => {
  console.log(`server listening at http://localhost:${PORT}`);
});

/**
 *
 *
 *
 * CORS
 *
 *
 *
 * */

const socketOrigins = "*:*";
// NODE_ENV === "development" ? "*:*" : undefined;

const io = require("socket.io")(server, {
  origins: socketOrigins,
});

const sockets = {};

/**
 *
 *
 *
 * Socket
 *
 *
 *
 * */

const randomDigit = () => Math.floor(Math.random() * 10);

const currentRoomIds = (socket) =>
  Object.keys(io.sockets.adapter.sids[socket.id] || {}).filter(
    (roomId) => roomId !== socket.id
  );

const startRoomHandler = (socket) => () => {
  /* TODO: prevent roomId collisions */
  const roomId = "" + randomDigit() + randomDigit() + randomDigit();
  socket.join(roomId);
  socket.emit("STARTED_ROOM", roomId);
};

const joinRoomHandler = (socket) => (roomId) => {
  io.of("/")
    .in(roomId)
    .clients((error, socketIds) => {
      if (error) throw error;

      if (socketIds.length === 1) {
        socket.join(roomId);
        socket.emit("JOINED_ROOM");
        socket.broadcast.to(roomId).emit("ROOM_JOINED");
      } else {
        const reason =
          socketIds.length === 0
            ? "Couldn't find game"
            : socketIds.length > 1
            ? "Game is full"
            : "Unkown reason";

        socket.emit("JOIN_ROOM_ERROR", {
          error,
          roomId,
          reason,
        });
      }
    });
};

const leaveRoomHandler = (socket) => () => {
  currentRoomIds(socket).forEach((roomId) => {
    io.of("/")
      .in(roomId)
      .clients((error, socketIds) => {
        if (error) throw error;

        socketIds.forEach((socketId) => {
          const clientSocket = io.sockets.sockets[socketId];
          if (clientSocket) {
            if (socketId === socket.id) {
              clientSocket.emit("ENDED_ROOM");
            } else {
              clientSocket.emit("ROOM_ENDED");
            }
            clientSocket.leave(roomId);
          }
        });
      });
  });
};

const socketActionHandler = (socket) => (clientReduxAction) => {
  currentRoomIds(socket).forEach((roomId) => {
    socket.broadcast.to(roomId).emit("SOCKET_ACTION", clientReduxAction);
  });
};

const socketStateHandler = (socket) => (clientReduxState) => {
  currentRoomIds(socket).forEach((roomId) => {
    socket.broadcast.to(roomId).emit("SOCKET_STATE", clientReduxState);
  });
};

const connectionHandler = (socket) => {
  sockets[socket.id] = socket.id;
  socket.on("disconnect", () => {
    delete sockets[socket.id];
  });

  socket.on("startRoom", startRoomHandler(socket));
  socket.on("joinRoom", joinRoomHandler(socket));
  socket.on("leaveRoom", leaveRoomHandler(socket));
  socket.on("disconnecting", leaveRoomHandler(socket));
  socket.on("socketAction", socketActionHandler(socket));
  socket.on("socketState", socketStateHandler(socket));
};

io.on("connection", connectionHandler);
