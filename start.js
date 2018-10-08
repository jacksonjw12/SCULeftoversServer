require('babel-register')({
    presets: [ 'es2015' ]
});
if( process.argv.length > 2){

    module.exports = require(process.argv[2])
}
else{
    module.exports = require('./server.js');
}
