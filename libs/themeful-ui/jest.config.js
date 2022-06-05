// Jest configuration file, see link for more information
// https://jestjs.io/docs/en/configuration

const { pathsToModuleNameMapper } = require('ts-jest/utils')
const { compilerOptions } = require('../../tsconfig.base')

module.exports = {
  displayName: 'themeful-ui',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: 'libs/themeful-ui/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
      useESM: true,
    },
  },
  moduleDirectories: ['node_modules', 'libs/themeful-ui/src', 'libs/property-types/src'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  testPathIgnorePatterns: ['dist', 'node_modules/'],
}
