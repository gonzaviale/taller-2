import { Sequelize } from 'sequelize';
import { User } from '../models/User';
import dotenv from 'dotenv';

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

// Establecer asociaciones entre modelos
User.associate();

// Función para sincronizar la base de datos
export const syncDatabase = async (force: boolean = false): Promise<void> => {
  try {
    await sequelize.sync({ force });
    console.log('Base de datos sincronizada correctamente');
  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
    throw error;
  }
};

export { sequelize, User };