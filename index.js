const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // o usa http://localhost:5173 si React está allí
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('🔌 Usuario conectado:', socket.id);

  socket.on('join-room', (designId) => {
    socket.join(designId);
    console.log(`📁 Usuario ${socket.id} se unió a la sala: ${designId}`);
  });

  socket.on('element-change', ({ designId, element }) => {
    socket.to(designId).emit('element-change', element);
  });

  socket.on('disconnect', () => {
    console.log('❌ Usuario desconectado:', socket.id);
  });
  
  socket.on('element-delete', ({ designId, elementId }) => {
    socket.to(designId).emit('element-delete', elementId);
  });
});

server.listen(3001, () => {
  console.log('✅ Servidor WebSocket corriendo en http://localhost:3001');
});
