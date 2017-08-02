/**
 * Created by lzy on 2017/8/1.
 */
var dbConfig = require('../config/conf').DB;
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;




var connectUri = 'mongodb://' + dbConfig.username
+ ':' + dbConfig.password + '@' + dbConfig.ip
+ ':' + dbConfig.port + '/' + dbConfig.database;

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
    connectUri,
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