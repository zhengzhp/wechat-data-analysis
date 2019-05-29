const postcssGlobalImport = require('postcss-global-import') // @global-import 可以将引入css中样式变为全局css
const postcssImport = require('postcss-import') // 可以直接引入npm安装在node_modules中的css
const postcssPresetEnv = require('postcss-preset-env') // 允许使用浏览器未支持标准
const postcssMediaMinmax = require('postcss-media-minmax') // 允许媒体查询时使用 >=和<=
const postcssCalc = require('postcss-calc') // 减少非必要的calc
const postcssNesting = require('postcss-nesting') // 提供& div的嵌套方式
const postcssNested = require('postcss-nested') // 提供sass嵌套方式
const rucksack = require('rucksack-css') // 提供别名、clear: fix、响应式的字体排版、伪选择器、缓动函数
const postcssFlexbugsFixes = require('postcss-flexbugs-fixes') // 尝试修改css中出现的问题
const autoprefixer = require('autoprefixer')

const pkg = require('./package.json')

module.exports = () => ({
  loader: 'postcss-loader',
  plugins: [
    postcssGlobalImport(),
    postcssImport(),
    postcssMediaMinmax(),
    postcssCalc({ preserve: true }),
    postcssNesting(),
    postcssNested(),
    postcssPresetEnv({ stage: 2 }),
    rucksack(),
    postcssFlexbugsFixes(),
    autoprefixer(pkg.browserslist),
  ],
})
