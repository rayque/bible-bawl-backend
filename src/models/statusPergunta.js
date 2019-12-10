module.exports = (sequelize, DataTypes) => {
    const StatusPergunta = sequelize.define('StatusPergunta', {
            nome: DataTypes.STRING,
            descricao: DataTypes.STRING,
        },
        {
            freezeTableName: true,
            tableName: 'status_perguntas',
            underscored: true
        });



    return StatusPergunta;
};
