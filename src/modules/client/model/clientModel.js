const { Model, DataTypes } = require('sequelize');

module.exports = class ClientModel extends Model {
  static setup(sequelizeInstance) {
    ClientModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          unique: true,
        },
        name: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        surname: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        documentType: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        documentNumber: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        nationality: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        address: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        phone: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        email: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        birthdate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        sequelize: sequelizeInstance,
        modelName: 'Client',
      },
    );
  }
};
