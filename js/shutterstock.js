var nconf = require('nconf');
nconf.file({
    file: 'config.json'
});
var shutterstock = require('shutterstock');

var api = shutterstock.v2({
    clientId: nconf.get("shutterstockId"),
    clientSecret: nconf.get("shutterstockSecret")
});

api.image.search('cold steel rail', function(err, data) {
    if (err) throw err;

    console.log(data.data[0].assets);
});
