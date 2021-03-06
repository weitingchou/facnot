var db = require('../database'),
    log = require('logule').init(module, 'API Middleware');

exports.authenticate = function(req, res, next) {
    if (req.method === 'OPTIONS') {
        return next();
    }

    var userId = req.params.userId;
    db.getUser(userId, function(err) {
        if (err) {
            if (err.name === 'IDError') {
                var errmsg = 'Authentication failed with error: Unknown user id: '+userId;
                log.error(errmsg);
                return res.status(401).send({error: errmsg});
            } else {
                return res.status(500).send({error: 'Internal error'});
            }
        } else {
            return next();
        }
    });
};

exports.addTo = function(router) {
    router.use('/:userId/*', exports.authenticate);
};
