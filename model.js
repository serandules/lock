var log = require('logger')('lock');
var utils = require('utils');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var lock = Schema({
    name: {type: String, required: true, unique: true},
    created: {type: Date, expires: 60}
});

lock.statics.acquire = function (name, done) {
    var Lock = this;
    Lock.create({
        name: name
    }, function (err) {
        if (err) {
            return done(err);
        }
        done(null, function (unlocked) {
            Lock.remove({
                name: name
            }, unlocked || utils.none);
        });
    });
};

module.exports = mongoose.model('Lock', lock);