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
            tags: tag
        }, function(err, result) {
            var responseObject = {
                tag: tag,
                link: null,
                success: true
            };

            if (err) {
                responseObject.success = false;
            }

            try {
                var photoObj = result.photos.photo[0];
                var link = "https://farm" + photoObj.farm + ".staticflickr.com/" + photoObj.server + "/" + photoObj.id + "_" + photoObj.secret + ".jpg";
                responseObject.link = link;
            } catch (e) {
                responseObject.success = false;
            }

            resolve(responseObject);
        });
    });
}
