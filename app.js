try {
    require('dotenv').load();
} catch (e) {
    console.log("No .env found!");
}

var flickrInstance;
var express = require('express');
var bodyParser = require('body-parser');
var alchemy = require('./js/alchemy.js');
var flickr = require('./js/flickr.js');
var search500px = require('./js/500px.js');

var getty = require('./js/getty.js');
//var shutterstock = require('./js/shutterstock.js');


// flickr.init().then(function(instance) {
//     console.log("Flickr initialised");
//     flickrInstance = instance;
//     appBoot();
// }, function(err) {
//     console.log("Error initialising Flickr");
// });

function appBoot() {
    var app = express();

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(express.static('public'));

    app.get('/', function(req, res) {
        res.send('index.html');
    });

    app.post("/picfinder", function(req, res) {
        alchemy(req.query.text).then(function(keywords) {
            var renderableData = {};
            var photoPromises = [];
            var finalResponse = [];

            keywords.map(function(keyword) {
                //photoPromises.push(flickr.search(flickrInstance, keyword));
                photoPromises.push(search500px(keyword));
                //photoPromises.push(shutterstock(keyword));
                photoPromises.push(getty(keyword));
            });

            Promise.all(photoPromises).then(function(responses) {
                for (response of responses) {
                    if (response !== null) {
                        if (renderableData[response.keyword]) {
                            renderableData[response.keyword] = renderableData[response.keyword].concat(response.results);
                        } else {
                            renderableData[response.keyword] = response.results;
                        }
                    }
                }

                for (var prop in renderableData) {
                    //send a keyword iff more than 5 images are found for it
                    if(renderableData[prop].length > 5) {
                        var obj = {
                            keyword: prop,
                            pictures: renderableData[prop]
                        };

                        finalResponse.push(obj);
                    }
                }

                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({
                    data: finalResponse
                }));

            }).catch(function(error) {
                console.log("photoPromises failure", error);
                res.status(400).send('Error in fetching the pictures : ' + error);
            });

        }).catch(function(error) {
            console.log("alchemy failure", error);
            res.status(400).send('Oops. ' + error);
        })
    });

    var server = app.listen(process.env.PORT || 3000, function() {
        var host = server.address().address;
        var port = server.address().port;
        console.log("App listening on ", port);
    });
}
appBoot();
