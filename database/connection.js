const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const dbConnect = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB: ' + connect.connection.host);
    } catch (error) {
        console.log('MongoDB failed');
        process.exit(1);
    }
}

module.exports = dbConnect;