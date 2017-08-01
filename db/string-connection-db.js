/**
 * Created by lzy on 2017/8/1.
 */
var conf = require('../conf/conf');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;




var conne_str = 'mongodb://' + conf.db.username
+ ':' + conf.db.password + '@' + conf.db.ip
+ ':' + conf.db.port + '/' + conf.db.name;

var opt = {
    db: {
        w:1,
        native_parser: false
    },
    server: {
        poolSize: 5,
        socketOptions: {connecTimeoutMS: 500},
        auto_reconnect: true
    },
    replSet: {},
    mongos: {}
};

var DB = null;
MongoClient.connect(
    conne_str,
    opt,
    function (err, db) {
        if (err){
            console.log('Connection Failed!');
        }else{
            console.log('Connection Success!');
            DB = db;
        }
    }
);

module.exports = DB;