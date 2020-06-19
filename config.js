const { JWT_SECRET, NODE_ENV } = process.env;

module.exports.PrivateKey = NODE_ENV === 'production' ? JWT_SECRET : 'secret';
