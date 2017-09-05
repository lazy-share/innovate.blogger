/**
 * Created by lzy on 2017/9/2.
 *
 *
 * <p>
 *     心情/日记 Schema
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var notesSchema = new Schema({
    username: {type: String, required: true},
    content: {type: String, required: true},
    comment: {type: Schema.ObjectId, required: true},
    praise: [String],
    visitor: {type: Number},
    create_time: {type: Date, required:true, default: Date.now()},
    update_time: {type: Date, required: true, default: Date.now()}
},{
    id: true,
    _id: true,
    safe: true,
    collection: 'notes'
});

notesSchema.index({account_id: 1});
notesSchema.set('versionKey', '_notes');

var NotesModel = mongoose.model('NotesModel', notesSchema, false);
exports.NotesModel = NotesModel;
exports.notesSchema = notesSchema;

