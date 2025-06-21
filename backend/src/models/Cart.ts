import { Model, DataTypes, Sequelize } from "sequelize";
import { Product } from "./Product";
import { User } from "./User";
import { StatusCart } from "../types/types";

interface CartAttributes {
    id: number;
    userId: number;
    status: StatusCart;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CartCreationAttributes extends Omit<CartAttributes, "id"> { }

export class Cart
    extends Model<CartAttributes, CartCreationAttributes>
    implements CartAttributes {
    public id!: number;
    public userId!: number;
    public status!: StatusCart;

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
                status: {
                    type: DataTypes.ENUM("buying", "purchased", "cancelled"),
                    allowNull: false,
                    defaultValue: "buying",
                }
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