var util = require('util'),
    Push = require('./push');

function PullRequest(names, data) {
    this.names = names;
    this.number = data.pull_request.number;
    this.title = data.pull_request.title;
    this.author = data.pull_request.user;
    this.sender = data.sender;
    this.action = data.action;
}

PullRequest.prototype.toString = function() {
    var author = this.getName(this.author),
        sender = this.getName(this.sender),
        title = this.unescapeMessage(this.title);

    var author_posessive = author + (author.substring(-1) == 's' ? "'" : "'s");

    return sender + " " + this.action + " " + author_posessive + " pull request #" + this.number + " (" + title + ")";
};

PullRequest.prototype.getName = Push.prototype.getName;
PullRequest.prototype.unescapeMessage = Push.prototype.unescapeMessage;

module.exports = PullRequest;
