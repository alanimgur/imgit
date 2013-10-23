var http = require('http'),
    util = require('util'),
    querystring = require('querystring');

function GitIO() {
    
}

GitIO.prototype.template = function(tpl, output) {
    var urls = Object.keys(tpl.urls);

    if(urls.length == 0) {
        output(tpl.template);
    } else {
        var key = urls[0], url = tpl.urls[key];

        var data = querystring.stringify({
            'url': url
        });
        var req = http.request({
                'hostname': 'git.io', 
                'method': 'POST',
                'headers': {
                    'Content-Length': data.length,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }, function(response) {
            delete tpl.urls[key];
            tpl.template = tpl.template.replace('{' + key + '}', response.headers.location);
            this.template(tpl, output);
        }.bind(this));

        req.on('error', function(e) {
            // gitio fail, just ignore
            delete tpl.urls[key];
            this.template(tpl, output);
        }.bind(this));

        req.write(data);
        req.end();
    }
};

module.exports = GitIO;
