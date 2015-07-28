var AlchemyAPI = require('alchemy-api');
var alchemy = new AlchemyAPI(process.env.alchemyKey);

module.exports = function(text) {
    return new Promise(function(resolve, reject) {
        alchemy.entities(text, {}, function(err, response) {
            if (err) {
                reject(err);
            }
            console.log("Alchemy api response ENTITIES", response.entities);

            // if (response.status === 'ERROR') {
            //     reject(response.statusInfo);
            // } else {
            //     resolve(response.keywords);
            // }
        });

        alchemy.keywords(text, {}, function(err, response) {
            if (err) {
                reject(err);
            }
            console.log("Alchemy api response", response);

            if (response.status === 'ERROR') {
                reject(response.statusInfo);
            } else {
                resolve(response.keywords);
            }
        });
    });
}
