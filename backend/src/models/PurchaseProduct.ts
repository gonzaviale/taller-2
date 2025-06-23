import { Model, DataTypes, Sequelize } from "sequelize";

export class PurchaseProduct extends Model {
    public purchaseId!: number;
    public productId!: number;
    public quantity!: number;

    public static initialize(sequelize: Sequelize): void {
        PurchaseProduct.init(
            {
                purchaseId: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                },
                productId: {
                    type: DataTypes.INTEGER,
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
                tableName: "purchaseProducts",
                timestamps: false,
            }
        );
    }
}
