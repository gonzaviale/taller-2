import type { Config } from 'jest';
import dotenv from 'dotenv';

dotenv.config();

// configurar NODE_ENV para test
process.env.NODE_ENV = 'test';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
};

export default config;
  