import { Model, DataTypes, Sequelize } from "sequelize";
import { Product } from "./Product";
import { User } from "./User";

interface CartAttributes {
  id: number;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartCreationAttributes extends Omit<CartAttributes, "id"> {}

export class Cart
  extends Model<CartAttributes, CartCreationAttributes>
  implements CartAttributes
{
  public id!: number;
  public userId!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initialize(sequelize: Sequelize): void {
    Cart.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        tableName: "cart",
        timestamps: true,
      }
    );
  }

  public static associate(): void {
    // Relación n a n con Product
    Cart.belongsToMany(Product, {
      through: "CartProducts", // Tabla intermedia
      foreignKey: "cartId",
      otherKey: "productId",
    });

    // Relación 1 a n con User (un usuario tiene muchos carritos)
    Cart.belongsTo(User, {
      foreignKey: "userId",
      as: "user",
    });
  }
}