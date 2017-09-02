/**
 * Created by laizhiyuan on 2017/8/18.
 *
 * <p>
 *     例子服务层
 *  example controller
 * </p>
 *
 */
//init mongoose model
var example = require('../models/example');

var mongoose = require('mongoose');
var ExampleModel = example.ExampleModel;

exports.testAggregate = function (req, res) {
    ExampleModel.aggregate([
        {$match: {name:{$in:['zh','l','w','t']}}},
        {$group: {_id: '$gender', maxSize:{$max: "$size"}, minSize: {$min: "$size"}, sum: {$sum: "$size"}}}
        ], function (err, result) {
        if (err){
            res.json("select faild! errMsg:" + err);
        }else {
            res.json(result);
        }
    });
}

exports.testStaticMethod = function (req, res) {
    ExampleModel.staticMethod(req, res);
}

exports.testMethod = function (req, res) {
    var example = new ExampleModel();
    example.sayHello(req, res);
};

exports.insert = function (req, res) {
    var name = req.query.name;
    if (name == null){
        res.json("param name not empty");
    }
    var example = new ExampleModel({
        name: name,
        hobby:[Math.random() + '', Math.random() + '', Math.random() + '']
    });

    example.save(function (err, result) {
        if (err){
            res.json("save faild, errMsg:" + err);
        }else {
            res.json(result);
        }
    });
}

exports.findByIdAndUpdate = function (req, res) {
    var id = req.query.id;
    if (id == null){
        res.json("param id not emtpy");
    }else{
        ExampleModel.findByIdAndUpdate(id, {$set:{name: 'findByIdAndUpdate'}}, {new: true}, function (err, result) {
            if (err){
                res.json('oper faild, errMsg:' + err);
            }else {
                res.json('update after doc:' + result);
            }
        })
    }
};

exports.updateByName = function (req, res) {
    var name = req.query.name;
    if (name == null){
        res.json('param name not empty');
    }else {
        ExampleModel.update({name: name},{$set: {is_delete: 1}}, function (err, result) {
            if (err){
                res.json('update error, errMsg:' + err);
            }else{
                res.json('update after doc:' + result);
            }
        });
    }

};

exports.deleteByName = function (req, res) {
    var name = req.query.name;
    if (name == null){
        res.json(304, 'param name not empty!');
        return;
    }
    var query = ExampleModel.remove({name: name});
    query.exec(function (err, result) {
        if (err){
            res.json("delete faild, errMsg:" + err);
        }else {
            res.json(result);
        }
    });
};

exports.findByLimit = function (req, res) {
    var query = ExampleModel.find();
    query.skip(2).limit(5).sort({update_time: -1}).exec(function (err, result) {
        if (err){
            res.json("select faild, errMsg:" + err);
        }else {
            res.json(result);
        }
    })
}

exports.findByOrder = function (req, res) {
    ExampleModel.find().sort({create_time: 1}).exec(function (err, result) {
        if (err){
            res.json('select error, errMsg:' + err);
        }else{
            res.json(result);
        }
    })
};

exports.likeByName = function (req, res) {
    var name = req.query.name;
    ExampleModel.find({name: new RegExp(name, 'i')},function(err, results){
        if (err){
            res.json(500, '查询错误! errMsg:' + err);
        }else {
            res.json(results);
        }
    })
};

exports.findAll = function(req, res){
    ExampleModel.find(function(err, results){
        if (err){
            res.json(500, '查询错误! errMsg:' + err);
        }else {
            res.json(results);
        }
    });
};

exports.example = function(req, res){
    var name = req.query.name;
    if (name == null && req.query.id == null){
        res.json('param name not empty!');
        return;
    }
    ExampleModel.findOne({_id: req.query.id})
    .exec(function(err, example){
        if (err){
            console.log('查询example错误');
        }
        console.log(example);
        if (example == null){
            console.log('查example无数据!');
            var exampleData = {
                name: name,
                gender: 1,
                status: 2
            };
            var exampleModel = new ExampleModel(exampleData);
            exampleModel.save(function(err, results){
                if (err){
                    res.json(500, "Faild to save Example: errorMsg:" + err);
                }else {
                    res.json(results);
                }
            });
        }else {
            res.json(example);
        }
    });
};