const express = require('express');
const http = require('http');
const WebSocket = require('ws');
require('dotenv').config();
const connection = require('./database/connection');
const cors = require('cors');


//DATABASE
connection();
const app = express();
const port = process.env.PORT || 3001;
const server = http.createServer(app);
app.use(cors({
    origin: '*',
    methods: 'POST, GET, PATCH, PUT, DELETE, HEAD',
    preflightContinue: false,
    optionsSuccessStatus: 200
}));

//JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ROUTES
const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);

//WS
const wss = new WebSocket.Server({ server });
// let drivers = {};
wss.on('connection', (ws) => {
    console.log('Nuevo cliente conectado');
  
    ws.on('message', (message) => {
      const data = JSON.parse(message);
      
      if (data.type === 'updateLocation') {
        // Envía la ubicación a todos los clientes conectados (administradores)
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'locationUpdate',
              driverId: data.driverId,
              lat: data.lat,
              lng: data.lng,
            }));
          }
        });
      }
    });
  
    ws.on('close', () => {
      console.log('Cliente desconectado');
    });
  });

// Configurar ruta básica para el servidor Express
app.get('/', (req, res) => {
    res.send('Servidor WebSocket con Node.js y Express está funcionando');
});

//LISTEN PORT
server.listen(port, () => {
    console.log('Server listen with WS Connected to port:' + port)
});

module.exports = app;