import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'], // ✅ Only test files from src
  moduleFileExtensions: ['ts', 'js', 'json'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: ['**/__tests__/**/*.test.ts'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.{ts,js}', '!src/**/*.d.ts'],
  clearMocks: true,
};

export default config;