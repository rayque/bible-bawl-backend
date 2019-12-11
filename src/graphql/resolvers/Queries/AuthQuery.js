const { Usuario, Respondedor } = require('../../../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


module.exports = {
    async login(_, {dados}) {

        const data = dados;
        if (data.cod_acesso) {
            const respondedor = await Respondedor.findAll({
                where: {cod_acesso: data.cod_acesso}
            });

            if (!respondedor.length) {
                throw new Error('Código incorreto');
            }

            const token = jwt.sign(
                {respondedorId: respondedor[0].id, permissao: 'respondedor'},
                'somesupersecretkey',
                {
                    expiresIn: '3h'
                }
            );
            return { respondedorId: respondedor[0].id, token, tokenExpiration: 3 };
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

            const token = jwt.sign(
                {userId: user[0].id, permissao: 'admin'},
                'somesupersecretkey',
                {
                    expiresIn: '3h'
                }
            );
            return { userId: user[0].id, token, tokenExpiration: 3 };

        } else {
            throw new Error('Dados insuficientes para fazer o login.');
        }


    },
};
