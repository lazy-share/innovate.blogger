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
/*推荐：http://3g.163.com/touch/article/list/BA8J7DG9wangning/20-20.html      主要修改20-20
    新闻：http://3g.163.com/touch/article/list/BBM54PGAwangning/0-10.html
    娱乐：http://3g.163.com/touch/article/list/BA10TA81wangning/0-10.html
    体育：http://3g.163.com/touch/article/list/BA8E6OEOwangning/0-10.html
    财经：http://3g.163.com/touch/article/list/BA8EE5GMwangning/0-10.html
    时尚：http://3g.163.com/touch/article/list/BA8F6ICNwangning/0-10.html
    军事：http://3g.163.com/touch/article/list/BAI67OGGwangning/0-10.html
    手机：http://3g.163.com/touch/article/list/BAI6I0O5wangning/0-10.html
    科技：http://3g.163.com/touch/article/list/BA8D4A3Rwangning/0-10.html
    游戏：http://3g.163.com/touch/article/list/BAI6RHDKwangning/0-10.html
    数码：http://3g.163.com/touch/article/list/BAI6JOD9wangning/0-10.html
    教育：http://3g.163.com/touch/article/list/BA8FF5PRwangning/0-10.html
    健康：http://3g.163.com/touch/article/list/BDC4QSV3wangning/0-10.html
    汽车：http://3g.163.com/touch/article/list/BA8DOPCSwangning/0-10.html
    家居：http://3g.163.com/touch/article/list/BAI6P3NDwangning/0-10.html
    房产：http://3g.163.com/touch/article/list/BAI6MTODwangning/0-10.html
    旅游：http://3g.163.com/touch/article/list/BEO4GINLwangning/0-10.html
    亲子：http://3g.163.com/touch/article/list/BEO4PONRwangning/0-10.html*/
exports.news = function (req, res) {
    var express=require('express');//引入模块
    var cheerio=require('cheerio');
    var superagent=require('superagent');
    var app=express();
    //http://news.baidu.com/
    //http://wangyi.butterfly.mopaasapp.com/detail/api?simpleId=8
    superagent.get('http://tuijian.hao123.com/hotrank')//请求页面地址
        .end(function(err,sres){//页面获取到的数据
            if(err) return next(err);

            var $=cheerio.load(sres.text);//用cheerio解析页面数据
            var arr=[];

            $(".ulist.focuslistnews").each(function(index,element){//下面类似于jquery的操作，前端的小伙伴们肯定很熟悉啦
                var $eleItem=$(element).find('.bold-item a');
                var $eleItemSon=$(element).find('.bold-item ~ li a')
                arr.push(
                    {
                        title: $eleItem.text(),
                        href: $eleItem.attr('href'),
                        item:{
                            title: $eleItemSon.text(),
                            href: $eleItemSon.attr('href')
                        }
                    }
                );
            });
            res.send(arr);
        })
};

exports.index = function (req, res) {
    res.render('example');
};

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

    var example = new ExampleModel({
        name: req.body.name,
        address: req.body.address,
        gender: req.body.gender,
        hobby:[Math.random() + '', Math.random() + '', Math.random() + '']
    });

    example.save(function (err, result) {
        if (err){
            console.log("save faild, errMsg:" + err);
            res.json({code: false, msg: '保存失败'});
        }else {
            res.json({code: true, msg: '保存成功'});
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