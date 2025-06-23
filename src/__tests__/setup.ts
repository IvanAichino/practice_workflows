// Jest setup file for common test configuration
import { logger } from '../config/logger';

// Silence logger during tests
logger.silent = true;

// Global test setup
beforeEach(() => {
  // Reset any mocks or test state
  jest.clearAllMocks();
});

// Global test teardown
afterEach(() => {
  // Clean up after each test
});