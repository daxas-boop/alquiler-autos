const { DataTypes, Model } = require('sequelize');

module.exports = class RentModel extends Model {
  /**
   * @param {import('sequelize').Sequelize} sequelizeInstance
   * @retuns {typeof ClubModel}
   */
  static setup(sequelizeInstance) {
    RentModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          unique: true,
          autoIncrement: true,
          allowNull: true,
          primaryKey: true,
        },
        carId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: {
              tableName: 'Car',
            },
            key: 'id',
          },
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: {
              tableName: 'User',
            },
            key: 'id',
          },
        },
        pricePerDay: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        startDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        finishDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        totalPrice: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        paymentMethod: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        isPaid: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
      },
      {
        sequelize: sequelizeInstance,
        modelName: 'Rent',
        underscored: true,
        tableName: 'rents',
        paranoid: true,
      },
    );
  }

  /**
   * @param {import('../../car/model/carModel')} CarModel
   * @param {import('../../user/model/userModel')} UserModel
   */
  static setupAssociations(CarModel, UserModel) {
    RentModel.belongsTo(CarModel, { foreignKey: 'carId' });
    RentModel.belongsTo(UserModel, { foreignKey: 'userId' });
  }
};
