/**
 * Created by laizhiyuan on 2017/10/30.
 *
 * <p>
 *
 * </p>
 *
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var articleImageSchema = new Schema({
    username: {type: String, required: true},
    image_path: {type: String, required: true},
    doc_id: {type: Schema.ObjectId, required: false},
    create_time: {type:Date, required: true, default: Date.now()},
    update_time: {type: Date, required: true, default: Date.now()}
},{
    id: true,
    _id: true,
    safe: true,
    collection: 'article_image'
});

articleImageSchema.index({username: 1});
articleImageSchema.set('versionKey', '_article_image');

var ArticleImageModel = mongoose.model('ArticleImageModel', articleImageSchema, false);
exports.articleImageSchema = articleImageSchema;
exports.ArticleImageModel = ArticleImageModel;