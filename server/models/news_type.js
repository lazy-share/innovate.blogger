/**
 * Created by lzy on 2017/10/21.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var newsTypeSchema = new Schema({
    name: {type: String, required: true},
    no: {type: String, required: true},
    is_use: {type: Boolean, required: true, default: true},
    priority: {type: Number},
    create_time: {type: Date, required: true, default: Date.now()}
},{
    id: true,
    _id: true,
    safe: true,
    collection: 'news_type'
});

newsTypeSchema.set('versionKey', '_news_type');
var NewsTypeModel = mongoose.model('NewsTypeModel', newsTypeSchema, false);
exports.NewsTypeModel = NewsTypeModel;
exports.newsTypeSchema = newsTypeSchema;

