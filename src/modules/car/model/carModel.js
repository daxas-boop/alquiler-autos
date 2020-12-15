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
        brand: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        model: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        year: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        mileage: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        color: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        airConditioning: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        passengers: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        transmission: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        priceDay: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        image: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize: sequelizeInstance,
        modelName: 'Car',
      },
    );
    return CarModel;
  }
};
