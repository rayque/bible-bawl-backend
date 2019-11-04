const {Respondedor} = require('./../../models')

module.exports = {
  async novoRespondedor(_, {nome}) {
    const respondedor = await Respondedor.create({nome: nome});
    return  respondedor;
  }
}

