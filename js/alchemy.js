var AlchemyAPI = require('alchemy-api');
var alchemy = new AlchemyAPI(process.env.alchemyKey);

module.exports = function(text) {

    return new Promise(function(resolve, reject) {
        var allTags = [];
        var state = 0;
        var relevance = 0.5;

        alchemy.entities(text, {}, function(err, response) {
            try{
                response.entities.forEach(function(obj) {
                    if(obj.relevance > relevance) {
                        allTags.push(obj.text);
                    }
                })
            } catch(e) {
                console.log("No entities detected");
            }

            state++;
            if(state === 3) {
                resolve(allTags);
            }
        });

        alchemy.concepts(text, {}, function(err, response) {
            try{
                response.concepts.forEach(function(obj) {
                    if(obj.relevance > relevance) {
                        allTags.push(obj.text);
                    }
                })
            } catch(e) {
                console.log("No concepts detected");
            }

            state++;
            if(state === 3) {
                resolve(allTags);
            }
        });

        alchemy.keywords(text, {}, function(err, response) {
            try{
                response.keywords.forEach(function(obj) {
                    if(obj.relevance > relevance) {
                        allTags.push(obj.text);
                    }
                })
            } catch(e) {
                console.log("No keywords detected");
            }

            state++;
            if(state === 3) {
                resolve(allTags);
            }
        });
    });
}
