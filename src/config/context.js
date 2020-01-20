const { PubSub } = require('apollo-server');
const pubsub = new PubSub();
const jwt = require('jsonwebtoken');

module.exports = async ({req, res}) => {

    const auth = req.headers.authorization;
    const token = auth && auth.substring(7);

    let auxiliar = null;
    let admin = null;

    if (token) {
        let payloadToken = jwt.decode(token, process.env.APP_JWT_AUTH_SECRET);

        if (new Date(payloadToken.exp * 1000) > new Date()) {
            auxiliar = payloadToken;

            if (payloadToken.userId) {
                admin = payloadToken;
            }

        } else  {
            throw new Error("Sessão Expirou");
        }
    }

    const err = new Error('Acesso negado!')

    return {
        pubsub,
        validarAdmin() {
            if(!admin) throw err
        },
        validarIsLogged() {
            if(!admin || !auxiliar) throw err
        },

    };
};