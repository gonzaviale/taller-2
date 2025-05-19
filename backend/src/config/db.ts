import { Sequelize } from 'sequelize';
import { User } from '../models/User';
import dotenv from 'dotenv';
import { Product } from '../models/Product';
import axios from 'axios';

dotenv.config();

const DB_NAME = process.env.DB_NAME || 'taller2';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '';
const DB_HOST = process.env.DB_HOST || 'localhost';

// Configuración de la conexión a la base de datos
const sequelize = new Sequelize(
  DB_NAME,
  DB_USER,
  DB_PASS,
  {
    host: DB_HOST || 'localhost',
    dialect: 'mysql', 
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Inicializar modelos
User.initialize(sequelize);
Product.initialize(sequelize);

// Establecer asociaciones entre modelos
User.associate();
Product.associate();

// Función para sincronizar la base de datos
export const syncDatabase = async (force: boolean = false): Promise<void> => {
  try {
    await sequelize.sync({ force });
    console.log('Base de datos sincronizada correctamente');
    // Cargar la base de datos con productos por defecto
    await loadDatabase();
  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
    throw error;
  }
};

// Función para cargar la base de datos con productos en caso de que no existan
export const loadDatabase = async (): Promise<void> => {
  try {
    const count = await Product.count();
    if (count === 0) {
      // Cargar productos por defecto
      const products = await axios.get('https://fakestoreapi.com/products').then(response => response.data);
      // Mapear los productos a la estructura del modelo Product
      const productsToInsert = products.map((product: any) => ({
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.image,
        ratingRate: product.rating.rate,
        ratingCount: product.rating.count,
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      // Insertar los productos en la base de datos
      await Product.bulkCreate(productsToInsert);
      console.log('Base de datos cargada con productos por defecto');
    } else {
      console.log('La base de datos ya contiene productos, no se cargaron nuevos productos');
    }
  } catch (error) {
    console.error('Error al cargar la base de datos:', error);
    throw error;
  }
}

export { sequelize, User, Product };