const {PubSub} = require('apollo-server');
const pubsub = new PubSub();
const jwt = require('jsonwebtoken');

module.exports = async ({req, connection}) => {
    let token = "";

    if (typeof connection === "object") {
        // console.log(connection);

        // token =  connection.context.headers && connection.context.headers.authorization;
    }
    if (req) {
        token = req.headers.authorization;
    }
    if (token.length > 0) {
        token = token && token.substring(7);
    }

    let auxiliar = false;
    let admin = false;

    if (token) {
        let payloadToken = jwt.decode(token, process.env.APP_JWT_AUTH_SECRET);

        auxiliar = !!payloadToken.respondedorId || auxiliar;
        admin = !!payloadToken.userId || admin;
    }

    const err = new Error('Acesso negado!');

    return {
        pubsub,
        validarAdmin() {
            return;
            // if (!admin) throw err;
        },
        validarIsLogged() {
            return;
            // if (admin) return;
            // if (auxiliar) return;
            // throw err;
        }
    };
};