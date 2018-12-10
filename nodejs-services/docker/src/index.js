var http = require('http')
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var lodash = require('lodash');
var HttpDispatcher = require('httpdispatcher');
var dispatcher = new HttpDispatcher();
var d = require('domain').create()
var infoGen = require('./infoGen.js');

var lightTrafficMS = 50;
var moderateTrafficMS = 100;
var heavyTrafficMS = 500;
var normalSpeedMS = 100;
var slowSpeedMS = 1000;
var verySlowSpeedMS = 5000;
var lightTrafficErrorRate = 4;
var moderateTrafficErrorRate = 8;
var heavyTrafficErrorRate = 40;

function handleRequest(request, response) {
    try {
        console.log(request.url);
        dispatcher.dispatch(request, response);
    }
    catch (err) {
        console.log(err);
    }
}

function getResponseProperties(request) {

    var sleepMS = lightTrafficMS;
    var errorRate = lightTrafficErrorRate;
    var speed = "normal";
    var traffic = "light";

    if (traffic == "moderate") {
        sleepMS = moderateTrafficMS;
        errorRate = moderateTrafficErrorRate;
    }
    else if (traffic == "heavy") {
        sleepMS = heavyTrafficMS;
        errorRate = heavyTrafficErrorRate;
    }

    if (speed == "slow") {
        sleepMS += lodash.random(1, slowSpeedMS);
    }
    else if (speed == "veryslow") {
        sleepMS += lodash.random(1, verySlowSpeedMS);
    }
    else {
        sleepMS += lodash.random(1, normalSpeedMS);
    }

    return {
        "sleepMS": sleepMS,
        "errorRate": errorRate,
        "speed": speed,
        "traffic": traffic
    };
}

dispatcher.onGet("/", function(request, response) {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    response.end('<h1>Hey, this is the homepage of your server</h1>');
});

dispatcher.onGet("/actionResponseServices/updateAction", function(request, response) {

    var responseProperties = getResponseProperties(request);

    if (responseProperties.errorRate > lodash.random(0, 100)) {
        response.status = 500;
        response.end("Error in " + request.url);
    }
    else {

        makeWebRequest("player-action-services", "8080", "/PlayerActionServices/updateAction", lodash.random(50, 400), function(err) {
            var url = "http://player-action-services:8080/PlayerActionServices/updateAction";

            if (err) {
                console.log('error: ' + url);
                response.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                response.end(err.errno);
            }
            else {
                console.log('finishing: ' + url);

                makeWebRequest("ai-services", "8080", "/AIServices/updateAction", lodash.random(50, 400), function(err) {

                    var url = "http://ai-services:8080/AIServices/updateAction";

                    if (err) {
                        console.log('error: ' + url);
                        response.writeHead(500, {
                            'Content-Type': 'text/plain'
                        });
                        response.end(err.errno);
                    }
                    else {
                        console.log('finishing: ' + url);
                        response.writeHead(200, {
                            'Content-Type': 'text/plain'
                        });
                        response.end(url);
                    }
                });
            }
        });
    }
});

dispatcher.onGet("/actionResponseServices/chat", function(request, response) {

    var responseProperties = getResponseProperties(request);

    if (responseProperties.errorRate > lodash.random(0, 100)) {
        response.status = 500;
        response.end("Error in " + request.url);
    }
    else {
        makeWebRequest("chat-services", "8001", "/chatServices/chat", lodash.random(50, 400), function(err) {

            var url = "http://chat-services:8001/chatServices/chat";

            if (err) {
                console.log('error: ' + url);
                response.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                response.end(err.errno);
            }
            else {
                console.log('finishing: ' + url);
                response.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                response.end(url);
            }
        });
    }
});

dispatcher.onGet("/chatServices/chat", function(request, response) {

    var responseProperties = getResponseProperties(request);

    if (responseProperties.errorRate > lodash.random(0, 100)) {
        response.status = 500;
        response.end("Error in " + request.url);
    }
    else {
        // var delayMS = lodash.random(50, 400);
        // var waitTill = new Date(new Date().getTime() + waitMS);
        // while (waitTill > new Date()) {}

        response.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        response.end('<html><body><h1>Hello from /chatServices/chat</h1></body></html>');
    }
});

var makeWebRequest = function(hostName, port, path, waitMS, parentCallback) {

    d.on('error', function(err) {
        parentCallback(err);
    })

    d.run(function() {

        if (waitMS > 0) {
            var waitTill = new Date(new Date().getTime() + waitMS);
            while (waitTill > new Date()) {
                const doSomethingInJavaScript = 1 + 2 + 3;
            }
        }

        var options = {
            host: hostName,
            path: path,
            port: port
        };

        var callback = function(response) {
            var str = ''
            response.on('data', function(chunk) {
                str += chunk;
            });
            response.on('error', function(err) {
                console.log(err)
                parentCallback(err);
            });
            response.on('end', function() {
                console.log("response.on(end): " + str);
                parentCallback(null);
            });
        }

        var req = http.request(options, callback).end();
    });
}

dispatcher.onError(function(request, response) {
    response.writeHead(404);
    response.end("Error, the URL doesn't exist");
});

var mongoQuery = function(mongoDBURL, dbName, parentCallback) {

    d.on('error', function(err) {
        console.log('error: ' + err);
        parentCallback(err);
    })

    d.run(function() {

        MongoClient.connect(mongoDBURL, function(err, db) {
            if (err) throw err;

            var query = {
                "firstName": "James"
            };

            db.collection(dbName).find(query).toArray(function(err1, result) {

                if (err1) {
                    console.log("Error calling: " + mongoDBURL + ", ");
                    console.log(err);
                }
                db.close();
                console.log("Found " + result.length + " records");
                parentCallback(err1, result);
            });
        });
    });
}

var mongoInsert = function(mongoDBURL, dbName, dbRecord, parentCallback) {

    d.on('error', function(err) {
        console.log('error: ' + err);
        parentCallback(err);
    })

    d.run(function() {

        MongoClient.connect(mongoDBURL, function(err, db) {
            if (err) throw err;

            db.collection(dbName).insertOne(dbRecord, function(err1, res) {

                if (err1) {
                    console.log("Error calling: " + mongoDBURL + ", ");
                    console.log(err);
                }
                db.close();
                console.log("1 record inserted");
                parentCallback(err1, res);
            });
        });
    });
}

var server = http.createServer(handleRequest)

server.listen(8001, (err) => {
    if (err) {
        return console.log('error: ' + err)
    }
    console.log('process.pid: ' + process.pid);
    console.log(`server is listening on 8001`)
})