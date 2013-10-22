var irc = require('irc'),
    http = require('http'),
    util = require('util'),
    factory = require('./eventfactory');

var imgit_irc = new irc.Client('irc.freenode.net', 'imgit', {
    channels: ['##imgur-office'],
    userName: 'imgit',
    autoConnect: !!true
});

imgit_irc.addListener('message', function(from, to, message) {
    //console.log('msg: ' + from + ' => ' + to + ': ' + message);
});

imgit_irc.addListener('error', function(msg) {
    //console.log('error: ' + msg);
});

imgit_irc.once('registered', function(msg) {
    //console.log('registered');
});

var imgit_http = http.createServer(function(request, response) {
    var fact = new factory();

    fact.addName('jacobgreenleaf', 'Jacob', 'jacobimgur');
    fact.addName('briankassouf', 'Brian', 'briango');
    fact.addName('lospro7', 'Carlos', 'imgurlos');
    fact.addName('Timgur', 'Tony', 'timgur');
    fact.addName('jimgur', 'Jim', 'jimgur');
    fact.addName('alanimgur', 'Alan', 'alanimgur');
    fact.addName('talklittle', 'Andrew', 'talklittle');

    var body = '';
    request.setEncoding('utf8');

    request.on('data', function(chunk) {
        body += chunk;
    });

    request.on('end', function() {
        var event_type = request.headers['x-github-event'];
        try {
            var req = JSON.parse(body);
                e = fact.build(event_type, req);
            imgit_irc.say('##imgur-office', e.toString());
        } catch(e) {
            console.log(e);
        }
    });
});

imgit_http.listen(10050);
