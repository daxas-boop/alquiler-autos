const { Model, DataTypes } = require('sequelize');

module.exports = class CarModel extends Model {
  static setup(sequelizeInstance) {
    CarModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          unique: true,
        },
        marca: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        modelo: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        año: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        kilometros: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        color: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        aire: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        pasajeros: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        transmision: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        precio: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        imagen: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize: sequelizeInstance,
        modelName: 'Car',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      },
    );
    return CarModel;
  }
};
