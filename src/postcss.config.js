const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = {
    plugins: [
        require('autoprefixer')({
            grid: 'autoplace'
        }),
        require('cssnano')({
            preset: 'default',
        }),
    ]
};
