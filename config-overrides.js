const {override, fixBabelImports, addBabelPlugin, addLessLoader} = require('customize-cra');

module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'css',
    }),
    addLessLoader(),
    addBabelPlugin(['@babel/plugin-proposal-decorators', {"legacy": true}])
);