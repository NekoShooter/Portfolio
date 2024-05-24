const ruta = require('path');

module.exports = {
        entry:'./main.js',
        output:{
            filename: 'app.js',
            path: ruta.resolve(__dirname, 'Web')
        },
        devServer:{
            static: {
                directory: ruta.join(__dirname, 'Web'),
            }
        }
    }