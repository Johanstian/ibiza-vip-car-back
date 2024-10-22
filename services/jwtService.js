const jwt = require('jwt-simple');
const moment = require('moment');
const dotenv = require('dotenv');

dotenv.config();

const secret = process.env.SECRET_TOKEN;

const createToken = (user) => {
    const payload = {
        userId: user._id,
        iat: moment().unix(),
        exp: moment().add(1, 'days').unix()
    }
    return jwt.encode(payload, secret);
};

module.exports = { secret, createToken }