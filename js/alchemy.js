var AlchemyAPI = require('alchemy-api');
var alchemy = new AlchemyAPI(process.env.alchemyKey);

module.exports = function(text) {
    return new Promise(function(resolve, reject) {
        alchemy.entities(text, {}, function(err, response) {
            if (err) {
                reject(err);
            }
        });

        alchemy.keywords(text, {}, function(err, response) {
            if (err) {
                reject(err);
            }

            if (response.status === 'ERROR') {
                reject(response.statusInfo);
            } else {
                resolve(response.keywords);
            }
        });
    });
}
