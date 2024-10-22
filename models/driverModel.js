const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Relación con el usuario
  coordinates: {
    type: { type: String, default: 'Point' }, // Para GeoJSON
    coordinates: [Number], // Array de latitud, longitud
  },
  updatedAt: { type: Date, default: Date.now },
});

DriverSchema.index({ coordinates: '2dsphere' }); // Índice geoespacial

module.exports = mongoose.model('Driver', DriverSchema, 'drivers');
