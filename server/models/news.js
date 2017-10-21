/**
 * Created by lzy on 2017/10/21.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var newsSchema = new Schema({
    docid: {type: String},
    title: {type:String},
    source: {type: String},
    priority: {type: Number},
    stitle: {type: String},
    imgsrc: {type: String},
    hasImg: {type: Number},
    digest: {type: String},
    commentCount: {type: Number},
    ptime: {type: String},
    url: {type: String},
    modelmode: {type: String},
    photosetID: {type: String},
    skipType: {type: String},
    newsTypeName: {type: String},
    newsTypeNo: {type: String}
},{
    id: true,
    _id: true,
    safe: true,
    collection: 'news',
    capped: { size: 10485760, max: 20000, autoIndexId: true } //10MB  在没有超过10MB情况下可以存2万条数据，理论上每个类型可以分100页
});

newsSchema.set('versionKey', '_news');
var NewsModel = mongoose.model('NewsModel', newsSchema, false);
exports.NewsModel = NewsModel;
exports.newsSchema = newsSchema;

