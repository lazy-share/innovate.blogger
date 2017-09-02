/**
 * Created by lzy on 2017/9/2.
 *
 * <p>
 *     博客文章 Schema
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var articlesTypeSchema = require('./articles_type').articlesTypeSchema;
var commentSchema = require('./comment').commentSchema;
var articlesSchema = new Schema({
    account_id: {type: String, required: true},
    title: {type: String},
    type: {type: [articlesTypeSchema], required: true},
    content: {type: String},
    desc: {type: String},
    praise: [String],
    comment: {type: commentSchema, required: true},
    create_time: {type: Date, required: true, default: Date.now()},
    update_time: {type: Date, required: true, default: Date.now()}
},{
    autoIndex: true,
    id: true,
    _id: true
});

articlesSchema.index({account_id: 1});
articlesSchema.set('versionKey', '_articles');

var ArticlesModel = mongoose.model('ArticlesModel', articlesSchema, 'articles', false);
exports.articlesSchema = articlesSchema;
exports.ArticlesModel = ArticlesModel;