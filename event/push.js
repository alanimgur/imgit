function Push(names, data) {
    this.ref = data.ref;
    this.head = data.head_commit;
    this.message = data.head_commit.message;
    this.pusher = data.pusher;
    this.commits = data.commits;

    this.names = names;
}

Push.prototype.getName = function(author) {
    var gh_username;
    if('login' in author) {
        gh_username = author.login;
    } else if('username' in author) {
        gh_username = author.username;
    } else {
        gh_username = author.name;
    }

    if(gh_username in this.names) {
        return this.names[gh_username].realname + " (" + this.names[gh_username].nick + ")";
    }
    return gh_username;
};

Push.prototype.unescapeMessage = function(msg) {
    return msg.replace(new RegExp('\\\\', 'g'), '').replace(new RegExp('\\+', 'g'), ' ');
};

module.exports = Push;
