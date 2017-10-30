/**
 * Created by lzy on 2017/10/28.
 */
var mongoose = require('mongoose');
var commentSchema = require('./comment').commentSchema;
var Schema = mongoose.Schema;
var imageSchema = new Schema({
    account_id: {type: Schema.ObjectId, required: true},
    image_url: {type: String, required: true},
    visitor:{type: Number, required: true, default: 0},
    content: {type: String, required: false},
    comment: commentSchema,
    praise: [String],
    is_private: {type: Boolean, required: true, default: false},
    create_time: {type:Date, required: true, default: Date.now()},
    update_time: {type: Date, required: true, default: Date.now()}
},{
    id: true,
    _id: true,
    safe: true,
    collection: 'images'
});

imageSchema.index({username: 1});
imageSchema.set('versionKey', '_image');

var ImageModel = mongoose.model('ImageModel', imageSchema, false);
exports.imageSchema = imageSchema;
exports.ImageModel = ImageModel;