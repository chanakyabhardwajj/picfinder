var ConnectSdk = require("ConnectSdk");
var connectSdk = new ConnectSdk(
    process.env.gettKey,
    process.env.gettySecret,
    process.env.gettyUsername,
    process.env.gettyPassword,
);

var search = connectSdk
    .search()
    .images()
    .withPhrase('dog');

search.execute(function(err, response) {
    if (err) throw err
    console.log(JSON.stringify(response.images[0].display_sizes[0].uri))
})
