const express = require('express')
const app = express()
const http = require('http')
const server = http.Server(app)
const socketio = require('socket.io')
const io = socketio(server)
const path = require('path');

app.use(express.static(path.join(__dirname, "client", "build")))

app.get("*", (req, res) => {
  res.send("hello")//res.sendFile(path.join(__dirname, "client", "build", "index.html"));
})

const PORT = process.env.PORT || 8080
server.listen(PORT, () => {
  console.log("Listening on port", PORT)
})

/* 
  Socket
*/

const randomDigit = () =>
  Math.floor(Math.random() * 10)

const currentRoomIds = socket =>
  Object.keys(io.sockets.adapter.sids[socket.id] || {}).filter((roomId) => roomId !== socket.id)

const startRoomHandler = socket => () => {
  /* TODO: prevent roomId collisions */
  const roomId = '' + randomDigit() + randomDigit() + randomDigit()
  socket.join(roomId)
  socket.emit('STARTED_ROOM', roomId)
}

const joinRoomHandler = socket => roomId => {
  io.of('/').in(roomId).clients((error, socketIds) => {
    if(error) 
      throw error

    if(socketIds.length === 1) {
      socket.join(roomId)
      socket.emit('JOINED_ROOM')
      socket.broadcast.to(roomId).emit('ROOM_JOINED')

    } else {
      const reason =
        socketIds.length === 0 ? "Couldn't find game" :
        socketIds.length > 1 ? "Game is full" :
        'Unkown reason'

      socket.emit('JOIN_ROOM_ERROR', { error, roomId, reason,})
    }
  })
}


const leaveRoomHandler = socket => () => {
  currentRoomIds(socket).forEach(roomId => {
    io.of('/').in(roomId).clients((error, socketIds) => {
      if(error) 
        throw error
  
      socketIds.forEach((socketId) => {
        const clientSocket = io.sockets.sockets[socketId]
        if(clientSocket) {
          if(socketId === socket.id) {
            clientSocket.emit('ENDED_ROOM')
          } else {
            clientSocket.emit('ROOM_ENDED')
          }
          clientSocket.leave(roomId)
        }
      })
    })
  })
}

const socketActionHandler = socket => clientReduxAction => {
  currentRoomIds(socket).forEach(roomId => {
    socket.broadcast.to(roomId).emit('SOCKET_ACTION', clientReduxAction)
  })
}

const connectionHandler = socket => {
  socket.on('startRoom', startRoomHandler(socket))
  socket.on('joinRoom', joinRoomHandler(socket))
  socket.on('leaveRoom', leaveRoomHandler(socket))
  socket.on('disconnecting', leaveRoomHandler(socket))
  socket.on('socketAction', socketActionHandler(socket))
}

io.on('connection', connectionHandler)
