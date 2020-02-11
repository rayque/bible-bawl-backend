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

            // console.clear()
            // console.log()
            // console.log("------------------- CONTEXT -------------------");
            // console.log()
            // console.table(payloadToken);





        if (new Date(payloadToken.exp * 1000) > new Date()) {
            auxiliar = !!payloadToken.respondedorId || auxiliar;
            admin = !!payloadToken.userId || admin;
        } else {
            // throw new Error("Sessão Expirou");
        }
    }

    // console.log(auxiliar, admin);

    const err = new Error('Acesso negado!');

    return {
        pubsub,
        validarAdmin() {
            // console.log()
            // console.log("==================== validarAdmin ====================");
            // console.table({admin: admin});
            // console.log()
            if (!admin) throw err;
        },
        validarIsLogged() {
            // console.log();
            // console.log("==================== validarIsLogged ====================");
            // console.log()
            // console.table({admin: admin,auxiliar: auxiliar});
            // console.log();

            if (admin) return;
            if (auxiliar) return;
            throw err;
        }
    };
};