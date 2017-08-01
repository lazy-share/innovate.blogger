/**
 * Created by lzy on 2017/8/1.
 */
var conf = require('../conf/conf');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var Server = mongo.Server;

var serverOps = {
    socketOptions: {connectTimeoutMS: 500},
    poolSize: 5,
    auto_reconnect: true
};

var mongoOps = {
    retryMilliSeconds: 500,
    numberOfRetries: 5
};

var client = new MongoClient(
    new Server(
        conf.db.ip,
        conf.db.port,
        serverOps
    ),
    mongoOps
);

var DB = null;
client.open(function(err, client){
    if (err){
        console.log('Connection Failed!');
    }else {
        DB = client.db(conf.db.name);
        if (DB){
            console.log('Connection Success!');
        }
        db.authenticate(conf.db.username, conf.db.password, function (err, results) {
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
