import { Model, DataTypes, Sequelize } from "sequelize";

interface ProductAttributes {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  ratingRate: number;
  ratingCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductCreationAttributes
  extends Omit<ProductAttributes, "id"> {}

export class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: number;
  public title!: string;
  public price!: number;
  public description!: string;
  public category!: string;
  public image!: string;
  public ratingRate!: number;
  public ratingCount!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initialize(sequelize: Sequelize): void {
    Product.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        price: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        category: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        image: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        ratingRate: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        ratingCount: {
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
        tableName: "product",
        timestamps: true,
      }
    );
  }

  public static associate(): void {
    /**
     * @TODO definir asociaciones cuando se cree la tabla de compras
     * Por ahora no hay asociaciones definidas
     */

  }
}
