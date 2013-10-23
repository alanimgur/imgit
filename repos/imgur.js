var emptyevent = require('../event/empty'),
    pullreq = require('../event/pullrequest');

function Imgur(factory, gitio) {
    this.factory = factory;
    this.gitio = gitio;
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
            if(e instanceof pullreq) {
                var tpl = e.getTemplate();
                this.gitio.template(tpl, output);
            } else {
                output(e.toString());
            }
        }
    }.bind(this));
};

module.exports = Imgur;
