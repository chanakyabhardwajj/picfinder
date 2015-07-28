var shutterstock = require('shutterstock');

var shutterstockApi = shutterstock.v2({
    clientId: process.env.shutterstockId,
    clientSecret: process.env.shutterstockSecret
});

module.exports = function(tag) {
    return new Promise(function(resolve, reject) {
        shutterstockApi.image.search(tag, function(error, results) {
            //console.log(results);
            var resolveObject = {
                keyword : tag,
                results : []
            };

            if (error) {
                resolveObject = null;
            }

            if(results && Array.isArray(results.data) && results.data.length > 0) {
                for(item of results.data) {
                    var responseObject = {
                        tag: tag,
                        link: null,
                        success: true,
                        imageLink: null,
                        source: "shutterstock"
                    };

                    try {
                        responseObject.link = item.assets.preview.url;
                        responseObject.imageLink = item.assets.preview.url;
                    } catch (e) {
                        responseObject.success = false;
                    }

                    resolveObject.results.push(responseObject);
                }
            } else {
                resolveObject = null;
            }

            resolve(resolveObject);
        });
    });
};
