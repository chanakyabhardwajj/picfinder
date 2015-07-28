var Flickr = require("flickrapi"),
    flickrOptions = {
        api_key: process.env.flickrKey,
        secret: process.env.flickrSecret
    };

exports.init = function() {
    return new Promise(function(resolve, reject) {
        Flickr.tokenOnly(flickrOptions, function(error, flickr) {
            if (error) {
                reject(error);
            }
            resolve(flickr);
        });
    });
}

exports.search = function(flickrInstance, tag) {
    return new Promise(function(resolve, reject) {
        flickrInstance.photos.search({
            text: tag,
            page: 1,
            per_page: 20,
            sort : "relevance"
        }, function(error, results) {
            //console.log(results);

            var resolveObject = {
                keyword: tag,
                results: []
            };

            if (error) {
                resolveObject = null;
            }

            if (results && Array.isArray(results.photos.photo) && results.photos.photo.length > 0) {
                for (item of results.photos.photo) {
                    var responseObject = {
                        tag: tag,
                        link: null,
                        success: true,
                        imageLink: null,
                        source: "Flickr"
                    };

                    try {
                        responseObject.link = "https://farm" + item.farm + ".staticflickr.com/" + item.server + "/" + item.id + "_" + item.secret + ".jpg";
                        responseObject.imageLink = "https://farm" + item.farm + ".staticflickr.com/" + item.server + "/" + item.id + "_" + item.secret + ".jpg";
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
}
