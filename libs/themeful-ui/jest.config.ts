import { pathsToModuleNameMapper } from 'ts-jest/utils'
import { compilerOptions } from '../../tsconfig.base.json'

export default {
  displayName: 'themeful-ui',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: 'libs/themeful-ui/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
      useESM: true,
    },
  },
  moduleDirectories: [
    'node_modules',
    'libs/themeful-ui/src',
    'libs/property-types/src',
    'libs/utils/src',
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  testPathIgnorePatterns: ['dist', 'node_modules/'],
}
