const express = require('express');
const http = require('http');
require('dotenv').config();
const connection = require('./database/connection');
const cors = require('cors');
const socketio = require('socket.io');


//DATABASE
connection();
const app = express();
const port = process.env.PORT || 3001;
const server = http.createServer(app);
app.use(cors({
  origin: '*',
  methods: 'POST, GET, PATCH, PUT, DELETE, HEAD',
  preflightContinue: false,
  optionsSuccessStatus: 200.
}));

//JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ROUTES
const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
  res.send('Servidor WebSocket con Node.js y Express está funcionando');
});

//LISTEN PORT
server.listen(port, () => {
  console.log('Server listen with WS Connected to port:' + port)
});

const io = socketio(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
  transports: ['websocket', 'polling']
});


io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('updateLocation', (data) => {
    console.log('Location update received:', data);

    io.emit('locationUpdate', data)
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

});

module.exports = app;