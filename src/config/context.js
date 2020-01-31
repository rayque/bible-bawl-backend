const {PubSub} = require('apollo-server');
const pubsub = new PubSub();
const jwt = require('jsonwebtoken');

module.exports = async ({req, connection}) => {

    let auth = null;

    if (connection) {
        auth = connection.context.headers.authorization
    }
    auth = auth || req.headers.authorization
    const token = auth && auth.substring(7);

    let auxiliar = false;
    let admin = false;

    if (token) {
        let payloadToken = jwt.decode(token, process.env.APP_JWT_AUTH_SECRET);
        if (new Date(payloadToken.exp * 1000) > new Date()) {
            auxiliar = !!payloadToken.respondedorId || auxiliar;
            admin = !!payloadToken.userId || admin;
        } else {
            // throw new Error("Sessão Expirou");
        }
    }

    const err = new Error('Acesso negado!');

    return {
        pubsub,
        validarAdmin() {
            if(!admin) throw err;
        },
        validarIsLogged() {
            if (admin) return;
            if (!auxiliar) throw err;
        }
    };
};