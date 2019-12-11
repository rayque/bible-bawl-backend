module.exports = (sequelize, DataTypes) => {
    const Usuario = sequelize.define('Usuario', {
            nome: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
        },
        {
            freezeTableName: true,
            tableName: 'usuarios',
        });

    return Usuario;
};
