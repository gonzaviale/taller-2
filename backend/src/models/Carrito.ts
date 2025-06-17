import { Model, DataTypes, Sequelize } from "sequelize";

export class Carrito extends Model
{

    public userId!: number;
  public productId!: number;
  public quantity!: number;

   public static initialize(sequelize: Sequelize) {
    Carrito.init(
      {
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
      },
      {
        sequelize,
        tableName: 'cart_items',
        timestamps: true,
      }
    );
  }

    static associate(_models: any) {
    // Carrito.belongsTo(models.User, { foreignKey: 'userId' });
    // Carrito.belongsTo(models.Product, { foreignKey: 'productId' });
  }

}