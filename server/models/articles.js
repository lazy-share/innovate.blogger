/**
 * Created by lzy on 2017/9/2.
 *
 * <p>
 *     博客文章 Schema
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var accountSchema = require('./account').accountSchema;

var articlesSchema = new Schema({
    account_id: {type: Schema.ObjectId, required: true},
    title: {type: String},
    type: {type: Schema.ObjectId, required: true},
    content: {type: String},
    is_private: {type: Boolean, default: false, required: true},
    desc: {type: String},
    praise: [accountSchema],
    comment: {type: Schema.ObjectId, required: true},
    visitor: {type: Number},
    interspace_name: {type: String, required: false},
    head_portrait: {type: String, required: false},
    is_manuscript: {type:Boolean, required: true, default: false},
    create_time: {type: Date, required: true, default: Date.now()},
    update_time: {type: Date, required: true, default: Date.now()}
},{
    autoIndex: true,
    id: true,
    _id: true
});

articlesSchema.index({username: 1});
articlesSchema.set('versionKey', '_articles');

var ArticlesModel = mongoose.model('ArticlesModel', articlesSchema, 'articles', false);
exports.articlesSchema = articlesSchema;
exports.ArticlesModel = ArticlesModel;