var Irc = require('irc'),
    Http = require('http'),
    util = require('util'),
    EventFactory = require('./eventfactory'),
    Imgur = require('./repos/imgur'),
    Imgit = require('./repos/imgit'),
    fs = require('fs');

try {
    var config_contents = fs.readFileSync(__dirname + '/config.json');
} catch(e) {
    console.log("missing config file 'config.json'. maybe copy from 'config.json.sample'?");
    process.exit(1);
}

try {
    var config = JSON.parse(config_contents);
} catch(e) {
    console.log("config.json: invalid json");
    process.exit(1);
}

var output = (function(str) {
    if(config.debug) {
        console.log(str);
    } else {
        irc.say(config.irc.broadcast_channel, '[imgit] ' + str);
    }
});

var irc = new Irc.Client(config.irc.server, config.irc.nick, {
    channels: [config.irc.broadcast_channel],
    userName: config.irc.nick,
    autoConnect: !config.debug
});

irc.addListener('error', function(msg) {
    console.error(msg);
}); 

var efactory = new EventFactory(config.github);
var imgur = new Imgur(efactory);

var server = Http.createServer(function(request, response) {
    if(request.url == "/imgur") {
        imgur.handle(request, output);
    } else {
        console.info('got unknown request for ' + request.url);
    }
});

server.listen(config.http.port);
console.log("imgit connected to " + config.irc.server + ", broadcasting to " + config.irc.broadcast_channel + " and listening on port " + config.http.port);
