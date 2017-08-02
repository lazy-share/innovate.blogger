/**
 * Created by lzy on 2017/8/1.
 */
var dbConf = require('../config/sys-config').DB;
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var Server = mongo.Server;

/*Server 参数*/
var serverOps = {
    socketOptions: {connectTimeoutMS: 500},
    poolSize: 5,
    auto_reconnect: true
};

/*Mongodb 参数*/
var mongoOps = {
    retryMilliSeconds: 500,
    numberOfRetries: 5
};

var client = new MongoClient(
    new Server(
        dbConf.ip,
        dbConf.port,
        serverOps
    ),
    mongoOps
);

var DB = null;
client.open(function(err, client){
    if (err){
        console.log('Connection Failed!');
    }else {
        DB = client.db(dbConf.database);
        if (DB){
            console.log('Connection Success!');
        }
        DB.authenticate(dbConf.username, dbConf.password, function (err, results) {
            if (err){
                console.log('Authentication Failed!');
                client.close();
                console.log('Connection close!');
            }else{
                console.log('Authentication Success!');
            }
        })
    }
});
module.exports = DB;
