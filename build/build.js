const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const babelrc = require('babelrc-rollup').default;

rollup.rollup({
    entry: './src/index.js',
    external: [
        'rollup-pluginutils'
    ],
    plugins: [
        babel(babelrc())
    ]
}).then((bundle) => {
    bundle.write({
        dest: 'dest/rollup-plugin-if.js',
        format: 'es'
    });
}).catch(console.error);
