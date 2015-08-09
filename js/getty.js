var ConnectSdk = require("connectsdk");

var connectSdk = new ConnectSdk(
    process.env.gettyKey,
    process.env.gettySecret,
    process.env.gettyUsername,
    process.env.gettyPassword
);

var search = connectSdk.search().images();

module.exports = function(tag) {
    return new Promise(function(resolve, reject) {
        search.withPhrase(tag).execute(function(error, results) {
            //console.log(results);

            var resolveObject = {
                keyword : tag,
                results : []
            };

            if (error) {
                resolveObject = null;
            }

            if(results && Array.isArray(results.images) && results.images.length > 0) {
                for(item of results.images) {
                    var responseObject = {
                        tag: tag,
                        link: null,
                        success: true,
                        imageLink: null,
                        source: "getty"
                    };

                    try {
                        responseObject.link = item.display_sizes[0].uri;
                        responseObject.imageLink = item.display_sizes[0].uri;
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
