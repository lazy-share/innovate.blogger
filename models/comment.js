/**
 * Created by lzy on 2017/9/2.
 *
 * <p>
 *     评论、回复 Schema
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var replySchema = new Schema({
    username: {type: String, required: true},
    parent_username: {type: String, required: true},
    replies: [replySchema],
    create_time: {type: Date, required: true, default: Date.now()},
    update_time: {type: Date, required: true, default: Date.now()}
},{
    id: true,
    _id: true,
    safe: true,
    strict: true
});

var commentSchema = new Schema({
    username: {type: String, required: true},
    replies:[replySchema]
},{
    id: true,
    _id: true,
    safe: true,
    strict: true,
    collection: 'comment'
});

commentSchema.set('versionKey', '_comment');

mongoose.model('CommentModel', commentSchema);
mongoose.model('Reply', replySchema);
exports.commentSchema = commentSchema;