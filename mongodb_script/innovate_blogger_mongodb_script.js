/**
 * Created by lzy on 2017/8/1.
 */
var dbConfig = require('../config/sys-config').DB;
var userAmin = require('../config/sys-config').UA;
var mongoClient = require('mongodb').MongoClient;

var mongoUri = "mongodb://" + userAmin.username + ':' + userAmin.password + '@' + dbConfig.ip + ':' + dbConfig.port + '/admin';
mongoClient.connect(
    mongoUri,
    connectDbCallback
);

function connectDbCallback(err, db){
    if (err){
        console.log('Connection Failed!');
    }else {
        console.log('Connection Success!');
        dropDb(db);
        showDbs(db);
        var bloggerDB = db.db(dbConfig.database);
        bloggerDB.createCollection('example', function(err, col){
            createColCallback(err, col);
            isCreateSuccess(db);
            showDbs(db);
            closeDB(db);
        })
    }
}

function addUser(db){
    db.addUser();
}

function isCreateSuccess(db){
    var admin = db.admin();
    admin.listDatabases(function(err, results){
        var found = false;
        for (var i = 0; i < results.databases.length; i++){
            if (results.databases[i].name == dbConfig.database){
                found = true;
            }
        }
        if (found){
            console.log('Create Database ' + dbConfig.database + 'Success!');
            return true;
        }else {
            console.log('Create Database ' + dbConfig.database + 'Failed!');
            return false;
        }
    })
}

function dropDb(db){
    db.db('example').dropDatabase(function(err, results){
        if (!err){
            console.log('Drop example Database Success');
        }else {
            console.log('Drop example Database Failed; result: ' + results);
        }
    })
}

function showDbs(db){
    var admin = db.admin();
    admin.listDatabases(function(err, databases){
        console.log("Current Database List: ");
        console.log(databases);
    })
}

function createColCallback(err, col){
    if (err){
        console.log('Create example Col Failed!');
    }else {
        console.log('Create example Col Success!');
    }
}

function closeDB(db){
    db.close(true, function(err, results){
        if (!err){
            console.log('Close DB Success!');
        }else {
            console.log('Close DB Failed! Msg:' + results);
        }
    });
}
