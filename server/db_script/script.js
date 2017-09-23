/**
 * Created by lzy on 2017/8/1.
 *
 * 创建数据库、用户、以及集合脚本
 *
 * version info:
 * npm 3.10.10
 * node v6.11.1
 * mongodb v3.4.6
 */
var dbConfig = require('./config').DB;
var userAdmin = require('./config').UA;
var dbAdmin = require('./config').DA;
var mongoClient = require('mongodb').MongoClient;

var mongoUri = "mongodb://" + dbAdmin.username + ':' + dbAdmin.password + '@' + dbConfig.ip + ':' + dbConfig.port + '/admin';

mongoClient.connect(
    mongoUri,
    connectDbCallback
);

/*连接后回调*/
function connectDbCallback(err, db){
    if (err){
        console.log('Connection Failed!');
    }else {
        console.log('Connection Success!');
        try{
            connectSuccessCallback(db);
        }catch (e){
            console.log('Oper Database Error:' + e);
            db.close();
            return;
        }
    }
}

/*连接成功调用*/
function connectSuccessCallback(db){
    /*删除数据库*/
    dropDb(db);
}

/*添加用户*/
function addUser(db){
    var bloggerDB = db.db(dbConfig.database);
    db.authenticate(userAdmin.username, userAdmin.password, function(err, results){
        if (err){
            console.log('Authenticate userAdmin Failed! result:' + err);
        }else {
            console.log('Authenticate userAdmin Success!');
            bloggerDB.removeUser(dbConfig.username, function(err, results){
                if (err){
                    console.log('Delete user Failed! result:' + err);
                }else{
                    console.log('Delete user Success!');
                }
                bloggerDB.addUser(dbConfig.username, dbConfig.password, function(err, results){
                    if (err){
                        console.log('Add user Failed! result:' + err);
                        closeDB(db);
                        return;
                    }else {
                        console.log('Add user Success!');
                        bloggerDB.authenticate(dbConfig.username, dbConfig.password, function(err, results){
                            if (err){
                                console.log('Auth user Failed! result:' + err);
                                closeDB(db);
                                return;
                            }else {
                                console.log('Auth user Success!');
                                closeDB(db);
                            }
                        })
                    }
                })
            });
        }
    })
}

/*是否创建成功*/
function isCreateSuccess(db){
    var admin = db.admin();
    admin.listDatabases(function(err, results){
        if (err){
            console.log('show dbs error');
            closeDB(db);
            return;
        }
        var found = false;
        try{
            console.log('Current Databases:' + results.databases);
            results.databases.forEach(function(element, index) {
                if (element.name == dbConfig.database){
                    found = true;
                }
            })
        }catch (e) {
            console.log('show dbs error: errMsg:' + e);
            closeDB(db);
            return;
        }

        if (found){
            console.log('Create Database ' + dbConfig.database + ' Success!');
            addUser(db);
        }else {
            console.log('Create Database ' + dbConfig.database + ' Failed!');
            closeDB(db);
            return;
        }
    })
}

/*删除DB*/
function dropDb(db){
    db.db(dbConfig.database).dropDatabase(function(err, results){
        if (!err){
            console.log('Drop ' + dbConfig.database + ' Database Success');
            /*显示删除后的数据库列表*/
            showDbs(db);
        }else {
            console.log('Drop ' + dbConfig.database + ' Database Failed; result: ' + err);
            closeDB(db);
        }
    })
}

/*显示数据库列表*/
function showDbs(db){
    var admin = db.admin();
    admin.listDatabases(function(err, results){
        if (err){
            console.log("Show dbs error");
            closeDB(db);
            return;
        }
        console.log("Current Database List: ");
        console.log(results.databases);
        createDbAndCol(db);
    })
}


/*创建数据库和集合*/
function createDbAndCol(db){
    var bloggerDB = db.db(dbConfig.database);
    bloggerDB.createCollection('example', function(err, col){
        if (err){
            console.log('Create Database ' + dbConfig.database + ' and example ' + ' Col Failed!' + err);
            closeDB(db);
            return;
        }
        console.log('Create Database ' + dbConfig.database + ' and example ' + ' Col Success!');
        isCreateSuccess(db);
    })
}

/*关闭DB*/
function closeDB(db){
    db.close(true, function(err, results){
        if (!err){
            console.log('Close DB Success!');
        }else {
            console.log('Close DB Failed! Msg:' + err);
        }
    });
}
