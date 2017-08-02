/**
 * Created by lzy on 2017/8/1.
 */
var MongoClient = require('mongodb').MongoClient;

var DB = null;



/*删除数据库*/
/*MongoClient.connect(
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
);*/

/*创建数据库和集合*/
/*MongoClient.connect(
    'mongodb://localhost/',
    function (err, db) {
        var demoDB = db.db('demoDB');
        demoDB.createCollection('demoCol',function (err, col) {
            if (!err){
                console.log('demoDB database and demoCol collection Created');
            }
        })
    }
);*/
/*MongoClient.connect(
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

module.exports = DB;