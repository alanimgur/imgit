var util = require('util'),
    Push = require('../push');

function PushCommits(names, data) {
    Push.call(this, names, data);
}

util.inherits(PushCommits, Push);

PushCommits.prototype.getContributors = function(commits) {
    var commit_stats = {};

    for(var i = 0, commit = commits[i]; i < commits.length; i++, commit = commits[i]) {
        var author = this.getName(commit.author);
        if(author in commit_stats) {
            commit_stats[author]++;
        } else {
            commit_stats[author] = 1;
        }
    }

    var commit_stats_list = [];
    for(var name in commit_stats) {
        commit_stats_list.push({'name': name, 'count': commit_stats[name]});
    }

    // descending commits
    commit_stats_list.sort(function(alpha, beta) {
        if(alpha.count < beta.count) { return 1; }
        else if(alpha.count > beta.count) { return -1; }

        return 0;
    });
    
    return commit_stats_list;
};

PushCommits.prototype.toString = function() {
    var pusher = this.getName(this.pusher),
        commits = this.getContributors(this.commits),
        ref = this.ref,
        msg = this.trimMessage(this.unescapeMessage(this.message));

    if(ref.indexOf('refs/heads/') === 0) {
        ref = ref.replace(/refs\/heads\/(.*)/, "[$1]");
    }
    
    if(commits.length == 1) {
        commits_total = commits[0].count;
        if(commits[0].name == pusher) {
            commits_str = "himself";
        } else {
            commits_str = commits[0].name;
        }
    } else {
        var commits_str = "",
            commits_total = 0;
        for(var i = 0, commit = commits[i]; i < commits.length; i++, commit = commits[i]) {
            commits_total += commit.count;

            var name = (commit.name == pusher ? "himself" : commit.name);
            commits_str += name + " (" + commit.count + ")";

            if(i != commits.length - 1) {
                commits_str += (i != commits.length - 2) ? ', ' : ', and ';
            }
        }
    }

    return pusher + " pushed " + commits_total + " commits from " + commits_str + " to " + ref + ": " + msg;
};

module.exports = PushCommits;
