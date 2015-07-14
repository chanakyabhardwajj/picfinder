var nconf = require('nconf');
nconf.file({
    file: 'config.json'
});

var ConnectSdk = require("ConnectSdk");
var connectSdk = new ConnectSdk(
    nconf.get("gettKey"),
    nconf.get("gettySecret"),
    nconf.get("gettyUsername"),
    nconf.get("gettyPassword"),
);

var search = connectSdk
    .search()
    .images()
    .withPhrase('dog');

search.execute(function(err, response) {
    if (err) throw err
    console.log(JSON.stringify(response.images[0].display_sizes[0].uri))
})
