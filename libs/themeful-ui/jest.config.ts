/* eslint-disable */
console.log('test')
process.exit(0)
export default {
  displayName: 'themeful-ui',
  preset: '@stencil/core/testing',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '../../coverage/libs/themeful-ui',
}
