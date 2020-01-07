/**
 * @typedef {Object} TsdxOptions
 * @property {string} input path to file
 * @property {string} name Safe name (for UMD)
 * @property {'node' | 'browser'} target JS target
 * @property {'cjs' | 'umd' | 'esm'} format Module format
 * @property {'development' | 'production'} env Environment
 * @property {string} tsconfig Path to tsconfig file
 * @property {boolean} extractErrors Is opt-in invariant error extraction active?
 * @property {boolean} minify Is minifying?
 * @property {boolean} writeMeta Is this the very first rollup config (and thus should one-off metadata be extracted)?
 */

module.exports = {
  /**
   * This function will run for each entry/format/env combination
   * @param {Object} config
   * @param {TsdxOptions} options
   */
  rollup(config) {
    return config;
  },
};
