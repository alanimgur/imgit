var util = require('util'),
    Push = require('./push');

function PullRequest(names, data) {
    this.names = names;
    this.repo = data.repository.name;
    this.number = data.pull_request.number;
    this.title = data.pull_request.title;
    this.author = data.pull_request.user;
    this.sender = data.sender;
    this.action = data.action;
    this.url = data.pull_request.html_url;
}

util.inherits(PullRequest, Push);

PullRequest.prototype.getTemplate = function() {
    var author = this.getName(this.author),
        sender = this.getName(this.sender),
        title = this.unescapeMessage(this.title);

    var author_posessive = author + (author.substring(-1) == 's' ? "'" : "'s");

    if(author == sender) {
        author_posessive = "his own";
    }

    return {
        'urls': {
            'PRQURL': this.url
        },
        'template': sender + " " + this.action + " " + author_posessive + " pull request #" + this.number + " ( {PRQURL} ) on " + this.repo + ": " + title + ""
    };
};


module.exports = PullRequest;
