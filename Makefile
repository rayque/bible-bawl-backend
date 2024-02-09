drop-database-seed:
	sequelize db:drop && sequelize db:create && sequelize db:migrate && sequelize db:seed:all

deletar-respostas:
	sequelize db:seed --seed deletar-respostas.js
