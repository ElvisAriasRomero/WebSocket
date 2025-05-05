// socket-server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // o especifica tu frontend: http://localhost:5173
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

  socket.on('element-delete', ({ designId, elementId }) => {
    socket.to(designId).emit('element-delete', elementId);
  });

  // 👇 Nuevo evento para sincronizar el orden (adelante/atrás)
  socket.on('element-zindex', ({ designId, elementId, direction }) => {
    socket.to(designId).emit('element-zindex', { elementId, direction });
  });

  socket.on('disconnect', () => {
    console.log('❌ Usuario desconectado:', socket.id);
  });
});

server.listen(3001, () => {
  console.log('✅ Servidor WebSocket corriendo en http://localhost:3001');
});
