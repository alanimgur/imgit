var push_empty = require('./event/push/empty'),
    push_commits = require('./event/push/commits'),
    emptyevent = require('./event/empty'),
    pullreq = require('./event/pullrequest');

function EventFactory(names, gitio) {
    this.names = names;
    this.gitio = gitio;
}

EventFactory.prototype.addName = function(gitname, realname, nick) {
    this.names[gitname] = {
        'name': realname,
        'irc': nick
    };
};

EventFactory.prototype.build = function(event_type, data) {
    switch(event_type) {
        case 'push':
            if(0 != data.commits.length) {
                return new push_commits(this.names, data);
            } else {
                return new push_empty(this.names, data);
            }

        case 'pull_request':
            if(data.action == 'synchronize') 
                return new emptyevent();

            return new pullreq(this.names, data, this.gitio);

        default:
            console.log("got unknown event " + event_type);
            return new emptyevent();
    }
};

module.exports = EventFactory;
