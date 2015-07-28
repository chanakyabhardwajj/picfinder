var API500px = require('500px'),
    api500px = new API500px(process.env.key500px);

module.exports = function(tag) {
    return new Promise(function(resolve, reject) {
        api500px.photos.searchByTag(tag, {
            image_size: 3
        }, function(error, results) {
            //console.log(results);

            var resolveObject = {
                keyword : tag,
                results : []
            };

            if (error) {
                resolveObject = null;
            }

            if(results && Array.isArray(results.photos) && results.photos.length > 0) {
                for(item of results.photos) {
                    var responseObject = {
                        tag: tag,
                        link: null,
                        success: true,
                        imageLink: null,
                        source: "500px"
                    };

                    try {
                        responseObject.link = "http://500px.com" + item.url;
                        responseObject.imageLink = item.image_url;
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
