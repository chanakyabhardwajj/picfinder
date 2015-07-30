try {
    require('dotenv').load();
} catch (e) {
    console.log("No .env found!");
}
var express = require('express');
var bodyParser = require('body-parser');
var alchemy = require('./js/alchemy.js');
var flickr = require('./js/flickr.js');
var getty = require('./js/getty.js');
var shutterstock = require('./js/shutterstock.js');
var search500px = require('./js/500px.js');
var flickrInstance;

flickr.init().then(function(instance) {
    console.log("Flickr initialised");
    flickrInstance = instance;
    appBoot();
}, function(err) {
    console.log("Error initialising Flickr");
});

function appBoot() {
    var app = express();

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(express.static('public'));
    app.set('views', './views');
    app.set('view engine', 'jade');

    app.get('/', function(req, res) {
        res.send('index.html');
    });

    app.post("/sketch", function(req, res) {
        //console.log(req.query);
        alchemy(req.query.text).then(function(keywords) {
            //console.log("alchemy success", keywords);

            var renderableData = {};
            var photoPromises = [];
            keywords.map(function(keyword) {
                photoPromises.push(flickr.search(flickrInstance, keyword.text));
                photoPromises.push(search500px(keyword.text));
                //photoPromises.push(shutterstock(keyword.text));
                //photoPromises.push(getty(keyword.text));
            });

            Promise.all(photoPromises).then(function(responses) {
                //console.log("photoPromises success", responses);

                for(response of responses) {
                    if(response !== null) {
                        if(renderableData[response.keyword]) {
                            renderableData[response.keyword] = renderableData[response.keyword].concat(response.results)
                        } else {
                            renderableData[response.keyword] = response.results;
                        }
                    }
                }

                res.render('sketch', {
                    text: req.body.text,
                    renderableData: renderableData
                }, function(err, html) {
                    if (err) {
                        console.log("Sketch response failure", err);
                    }
                    //console.log("Sketch response success", html);
                    res.send(html);
                });
            }).catch(function(err) {
                console.log("photoPromises failure", err);
            });

        }).catch(function(error) {
            console.log("alchemy failure", error);
        })
    });

    var server = app.listen(process.env.PORT || 3000, function() {
        var host = server.address().address;
        var port = server.address().port;
        console.log("App listening on ", port);
    });
}

//appBoot();
