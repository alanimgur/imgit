var util = require('util'),
    Push = require('../push');

function PushEmpty(names, data) {
    Push.call(this, names, data);
}

util.inherits(PushEmpty, Push);

PushEmpty.prototype.toString = function() {
    var pusher = this.getName(this.pusher),
        ref = this.ref,
        msg = this.trimMessage(this.unescapeMessage(this.message));

    if(ref.indexOf('refs/heads/') === 0) {
        ref = ref.replace(/refs\/heads\/(.*)/, "[$1]");
    }
    
    return pusher + " updated " + ref + ": " + msg;
};

module.exports = PushEmpty;
