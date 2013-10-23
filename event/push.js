function Push(names, data) {
    this.ref = data.ref;
    this.head = data.head_commit;
    this.message = data.head_commit.message;
    this.pusher = data.pusher;
    this.commits = data.commits;

    this.names = names;
}

Push.prototype._getUsername = function(author) {
    var gh_username;
    if('login' in author) {
        gh_username = author.login;
    } else if('username' in author) {
        gh_username = author.username;
    } else {
        gh_username = author.name;
    }   
    return gh_username;
};

Push.prototype.getName = function(author) {
    var username = this._getUsername(author);
    return (username in this.names ? this.names[username].name : username);
};

Push.prototype.getNick = function(author) {
    var username = this._getUsername(author);
    return (username in this.names ? this.names[username].irc : username);
};

Push.prototype.unescapeMessage = function(msg) {
    return msg.replace(new RegExp('\\\\', 'g'), '').replace(new RegExp('\\+', 'g'), ' ');
};


Push.prototype.TRIM_MESSAGE_LENGTH = 200;
Push.prototype.trimMessage = function(msg) {
    var trimmed = msg.replace(new RegExp('\n', 'g'), ' / ').substr(0, this.TRIM_MESSAGE_LENGTH);

    if(msg.length > this.TRIM_MESSAGE_LENGTH) {
        trimmed += " [...]";
    }

    return trimmed;
};

module.exports = Push;
