function Imgur(factory, irc) {
    this.factory = factory;
    this.irc = irc;
}

Imgur.prototype.handle = function(request, response) {
    var body = '';
    request.setEncoding('utf8');

    request.on('data', function(chunk) {
        body += chunk;
    });

    request.on('end', function() {
        var event_type = request.headers['x-github-event'];
        try {
            var req = JSON.parse(body);
                e = this.factory.build(event_type, req);
            if(e != null) {
                //console.log(e.toString());
                this.irc.say('##imgur-office', e.toString());
            }
        } catch(e) {
            console.log(e);
        }
    }.bind(this));
};

module.exports = Imgur;
