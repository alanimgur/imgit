var irc = require('irc'),
    http = require('http'),
    util = require('util'),
    Factory = require('./eventfactory'),
    Imgur = require('./repos/imgur'),
    Imgit = require('./repos/imgit');

var imgit_irc = new irc.Client('irc.freenode.net', 'imgit', {
    channels: ['##imgur-office'],
    userName: 'imgit',
    autoConnect: !!true
});
imgit_irc.addListener('error', function(msg) {});

var factory = new Factory();

factory.addName('jacobgreenleaf', 'Jacob', 'jacobimgur');
factory.addName('briankassouf', 'Brian', 'briango');
factory.addName('lospro7', 'Carlos', 'imgurlos');
factory.addName('Timgur', 'Tony', 'timgur');
factory.addName('jimgur', 'Jim', 'jimgur');
factory.addName('alanimgur', 'Alan', 'alanimgur');
factory.addName('talklittle', 'Andrew', 'talklittle');

var imgur = new Imgur(factory, imgit_irc);

var imgit_http = http.createServer(function(request, response) {
    if(request.url == "/imgur") {
        return imgur.handle(request, response);
    } else {
        console.log('got request for ' + request.url);
    }
});

imgit_http.listen(10050);
