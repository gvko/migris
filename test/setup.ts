import { jest } from '@jest/globals'
import { config } from 'dotenv'

// Load environment variables from .env file
config()

// Set default environment variables for testing
process.env.POSTGRES_URL = process.env.POSTGRES_URL || 'postgres://test:test@localhost:5432/test'
process.env.MYSQL_URL = process.env.MYSQL_URL || 'mysql://test:test@localhost:3306/test'
process.env.MONGO_URL = process.env.MONGO_URL || 'mongodb://test:test@localhost:27017/test'

// Set test timeout
jest.setTimeout(30000)

// Mock logger to prevent console output during tests
jest.mock('../logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}))
