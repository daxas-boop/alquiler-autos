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
    return RentModel;
  }

  /**
   * @param {import('../../car/model/carModel')} CarModel
   * @param {import('../../user/model/userModel')} UserModel
   */
  static setupAssociations(CarModel, UserModel) {
    RentModel.belongsTo(CarModel, { as: 'car', foreignKey: 'car_id' });
    RentModel.belongsTo(UserModel, { as: 'user', foreignKey: 'user_id' });
  }
};
