import { Sequelize } from 'sequelize';
import { User } from '../models/User';
import { Product } from '../models/Product';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const isTest = process.env.NODE_ENV === 'test';

const DB_NAME = isTest ? process.env.TEST_DB_NAME || 'taller2_test' : process.env.DB_NAME || 'taller2';
const DB_USER = isTest ? process.env.TEST_DB_USER || 'root' : process.env.DB_USER || 'root';
const DB_PASS = isTest ? process.env.TEST_DB_PASS || '' : process.env.DB_PASS || '';
const DB_HOST = isTest ? process.env.TEST_DB_HOST || 'localhost' : process.env.DB_HOST || 'localhost';
const DB_DIALECT = isTest ? 'sqlite' : 'mysql';
const DB_STORAGE = isTest ? ':memory:' : undefined;

// Configuración de la conexión a la base de datos
const sequelize = new Sequelize(
  DB_NAME,
  DB_USER,
  DB_PASS,
  {
    host: DB_HOST,
    dialect: DB_DIALECT as any,
    storage: DB_STORAGE,
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
    if (!isTest) {
      await loadDatabase();
    }
  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
    throw error;
  }
};

// Función para cargar productos por defecto (solo para desarrollo/producción)
export const loadDatabase = async (): Promise<void> => {
  try {
    const count = await Product.count();
    if (count === 0) {
      const products = await axios.get('https://fakestoreapi.com/products').then(response => response.data);
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
      await Product.bulkCreate(productsToInsert);
      console.log('Base de datos cargada con productos por defecto');
    } else {
      console.log('La base de datos ya contiene productos, no se cargaron nuevos productos');
    }
  } catch (error) {
    console.error('Error al cargar la base de datos:', error);
    throw error;
  }
};

export { sequelize, User, Product };