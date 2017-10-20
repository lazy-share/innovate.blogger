/**
 * Created by laizhiyuan on 2017/10/20.
 *
 * <p>
 *    √ΩÃÂSchame
 * </p>
 *
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mediaSchema = new Schema({
    username: {type: String, required: true},
    media_url: {type: String, required: true},
    create_time: {type:Date, required: true, default: Date.now()},
    update_time: {type: Date, required: true, default: Date.now()}
},{
    id: true,
    _id: true,
    safe: true,
    collection: 'media'
});

mediaSchema.index({username: 1});
mediaSchema.set('versionKey', '_media');

var MediaModel = mongoose.model('MediaModel', mediaSchema, false);
exports.mediaSchema = mediaSchema;
exports.MediaModel = MediaModel;