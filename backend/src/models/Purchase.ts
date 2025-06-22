import { Model, DataTypes, Sequelize } from "sequelize";
import { Product } from "./Product";
import { User } from "./User";
import { StatusPurchase } from "../types/types";

interface PurchaseAttributes {
    id: number;
    userId: number;
    status: StatusPurchase;
    total: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface PurchaseCreationAttributes extends Omit<PurchaseAttributes, "id"> { }

export class Purchase
    extends Model<PurchaseAttributes, PurchaseCreationAttributes>
    implements PurchaseAttributes {
    public id!: number;
    public userId!: number;
    public status!: StatusPurchase;
    public total!: number;

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public static initialize(sequelize: Sequelize): void {
        Purchase.init(
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
                },
                total: {
                    type: DataTypes.FLOAT,
                    allowNull: true,
                    defaultValue: 0.0,
                },
            },
            {
                sequelize,
                tableName: "purchase",
                timestamps: true,
            }
        );
    }

    public static associate(): void {
        // Relación n a n con Product
        Purchase.belongsToMany(Product, {
            through: "purchaseProducts", // Tabla intermedia
            foreignKey: "purchaseId",
            otherKey: "productId",
        });

        // Relación 1 a n con User (un usuario tiene muchos carritos)
        Purchase.belongsTo(User, {
            foreignKey: "userId",
            as: "user",
        });
    }
}