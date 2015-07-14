var nconf = require('nconf');
nconf.file({
    file: 'config.json'
});

var API500px = require('500px'),
    api500px = new API500px(nconf.get("500pxKey"));

module.exports = function(tag) {
    return new Promise(function(resolve, reject) {
        api500px.photos.searchByTag(tag, {
            image_size: 5
        }, function(error, results) {
            var responseObject = {
                tag: tag,
                link: null,
                success: true
            };

            if (error) {
                responseObject.success = false;
            }

            try {
                responseObject.link = results.photos[0].image_url;
            } catch (e) {
                responseObject.success = false;
            }

            resolve(responseObject);
        });
    });
};
