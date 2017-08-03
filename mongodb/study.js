/**
 * Created by lzy on 2017/8/1.
 */
var dbConf = require('./config').DB;
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var Server = mongo.Server;

/*---------------------------Server Connect Start----------------------------*/
/*var serverOps = {
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
        dbConf.ip,
        dbConf.port,
        serverOps
    ),
    mongoOps
);

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
});*/
/*---------------------------Server Connect End----------------------------*/

/*---------------------------String Connect Start----------------------------*/
/*var connectUri = 'mongodb://' + dbConfig.username
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

MongoClient.connect(
    'mongodb://localhost/demoDB',
    function (err, db) {
        if (!err){
            db.dropDatabase(function (err, results) {
                if (!err){
                    console.log('Delete Database demoDB Success!');
                }
            })
        }
    }
);

MongoClient.connect(
    'mongodb://localhost/',
    function (err, db) {
        var demoDB = db.db('demoDB');
        demoDB.createCollection('demoCol',function (err, col) {
            if (!err){
                console.log('demoDB database and demoCol collection Created');
            }
        })
    }
);
MongoClient.connect(
    'mongodb://localhost/admin',
    function (err, db) {
        DB = db;
        var adminDB = db.admin();
        adminDB.listDatabases(function (err, databases) {
            console.log('Database list:');
            console.log(databases);
        })
    }
);*/
/*---------------------------Server Connect End----------------------------*/
