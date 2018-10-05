export default {
  input: 'dist/es6/typescript.js', // rollup requires ES input
  output: {
    format: 'umd',
    name: '@yellicode/typescript',
    file: 'dist/bundles/typescript.umd.js'
  },
  external: ['@yellicode/core', '@yellicode/elements', '@yellicode/templating'] // https://github.com/rollup/rollup/wiki/Troubleshooting#treating-module-as-external-dependency
}
