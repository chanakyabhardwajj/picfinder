var shutterstock = require('shutterstock');

var api = shutterstock.v2({
    clientId: process.env.shutterstockId,
    clientSecret: process.env.shutterstockSecret
});

api.image.search('cold steel rail', function(err, data) {
    if (err) throw err;

    console.log(data.data[0].assets);
});
