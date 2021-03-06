var log = require('logule').init(module, 'DB'),
    config = require('./config'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    db = mongoose.createConnection(config.dbUrl);

var UserSchema = new Schema({
    name: String,
    birth: String,
    age: Number,
    id: {type: String, unique: true}
});
var User = db.model('User', UserSchema, 'UserC');

exports.createUser = function(name, birth, age, id, callback) {
    var newuser = new User({
        name: name,
        birth: birth,
        age: age,
        id: id
    });
    newuser.save(function(err) {
        if (err) {
            log.error('user error: '+err);
            if (err.code === 11000) {
                var error = new Error('This id is already existing!');
                error.name = 'DupKeyError';
                return callback(error, null);
            }
            return callback(err, null);
        }
        callback(null, 'Success');
    });
};

exports.getUser = function(id, callback) {
    User.findOne({id: id}, function(err, user) {
        if (err) { return callback(err, null); }
        else if (user === null) {
            var error = new Error('User with the specified id address was not found');
            error.name = 'IDError';
            return callback(error, null);
        }
        callback(null, user);
    });
};

exports.getAllUsers = function(callback) {
    User.find({}, callback);
}

exports.deleteUser = function(id, callback) {
    User.remove({id: id}, callback);
};

exports.deleteAllUsers = function(callback) {
    User.remove({}, function(err) {
        if (err) {
            log.error('Failed to delete all users, err: '+err);
            return callback(err, null);
        }
        callback(null, null);
    });
};

exports.dropUserCollection = function(callback) {
    db.db.dropCollection('User', function(err) {
        if (err) { return callback(err, null); }
        callback(null, null);
    });
};

