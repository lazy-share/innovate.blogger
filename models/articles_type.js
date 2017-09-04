/**
 * Created by lzy on 2017/9/2.
 *
 * <p>
 *     文章类型 Schema
 * </p>
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var articlesTypeSchema = new Schema({
    name: {type: String, required: true, unique: true},
    username: {type: String, required: true, default: null}
},{
    id: true,
    _id:true,
    collection: "articles_type"
});

articlesTypeSchema.index({name: 1});
articlesTypeSchema.set('versionKey', '_articles_type');

var ArticlesTypeModel = mongoose.model('ArticlesTypeModel', articlesTypeSchema);
exports.ArticlesTypeModel = ArticlesTypeModel;
exports.articlesTypeSchema = articlesTypeSchema;