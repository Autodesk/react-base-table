const path = require('path')
const cp = require('child_process')

/**
 * Assuming being executed from somewhere inside the website folder, the function returns all files in
 * react-base-table/src directory with the `ext` file-extension.
 * @param {string} ext The file extension, e.g, 'tsx', 'jsx' etc.
 * @returns {Array} Array of files found.
 */
const findFileWithExtension = ext => {
  const pathWebsite_pwd = cp.execSync('pwd', { encoding: 'utf-8' })
  const pathToReactBaseTableSrc_pwd =
    pathWebsite_pwd.split('website')[0] + 'src'
  var command = `find ${pathToReactBaseTableSrc_pwd} -name *.${ext}`
  const filesWithExt = cp.execSync(command, { encoding: 'utf-8' })
  const filesWithExtArr = filesWithExt.split('\n')

  const outArr = []
  for (let i = 0; i < filesWithExtArr.length - 1; i++) {
    const filesWithExtArr_dirString = path.resolve(
      __dirname,
      '../',
      'src',
      filesWithExtArr[i].split('src/')[1]
    )
    outArr.push(filesWithExtArr_dirString)
  }
  return outArr
}

module.exports = {
  findFileWithExtension,
}
