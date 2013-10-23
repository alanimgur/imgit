var emptyevent = require('../event/empty');

function Imgur(factory) {
    this.factory = factory;
}

Imgur.prototype.handle = function(request, output) {
    var body = '';
    request.setEncoding('utf8');

    request.on('data', function(chunk) {
        body += chunk;
    });

    request.on('end', function() {
        var event_type = request.headers['x-github-event'];

        try {
            var req = JSON.parse(body);
        } catch(e) {
            console.error('error: ' + e.toString());
            return;
        }

        var e = this.factory.build(event_type, req);

        if(!(e instanceof emptyevent)) {
            output(e.toString());
        }
    }.bind(this));
};

module.exports = Imgur;
