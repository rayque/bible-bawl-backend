const { Usuario, Respondedor } = require('../../../models');
const {JWT_SECRET} = require('../../../utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


function getExpirationTime() {
    /* 360 dias */
    return 360 * 24 * 60 * 60;
}

module.exports = {
    async login(_, {dados}) {

        const data = dados;
        if (data.cod_acesso) {
            const respondedor = await Respondedor.findOne({
                where: {cod_acesso: data.cod_acesso}
            });

            if (!respondedor) {
                throw new Error('Código incorreto');
            }

            const agora = Math.floor(Date.now() / 1000);
            const expirationTime = getExpirationTime();

            const token = jwt.sign(
                {
                    respondedorId: respondedor.id,
                    permissao: 'auxiliar',
                    nome: respondedor.nome,
                    iat: agora,
                    exp: agora + expirationTime
                },
                JWT_SECRET
            );
            return { token, tokenExpiration: 3 };

        } else if(data.email && data.password) {

            const user = await Usuario.findAll({
                where: {email: data.email}
            });

            if (!user.length) {
                throw new Error('Usuário ou senha está incorreto');
            }

            const isEqual = await bcrypt.compare(data.password, user[0].password);
            if (!isEqual) {
                throw new Error('Usuário ou senha está incorreto');
            }

            const agora = Math.floor(Date.now() / 1000);
            const expirationTime = getExpirationTime();

            const token = jwt.sign(
                {
                    userId: user[0].id,
                    nome: user[0].nome,
                    permissao: 'admin',
                    iat: agora,
                    exp: agora + expirationTime
                },
                JWT_SECRET
            );
            return { token, tokenExpiration: 3 };

        } else {
            throw new Error('Dados insuficientes para fazer o login.');
        }


    },
};
