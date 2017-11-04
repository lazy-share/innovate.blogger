/**
 * Created by lzy on 2017/11/4.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var updateIntersapceNameLogSchema = new Schema({
    account_id: {type: String, required: true, index: 1},
    old_interspace_name: {type: String, required: true, index: 1},
    new_interspace_name: {type: String, required: true},
    is_opt: {type:Boolean, required: true, default: false}, //是否处理过
    create_time: {type: Date, required: true, default: Date.now()},
    update_time: {type: Date, required: true, default: Date.now()}
},{
    _id: true,
    id: true,
    collection: 'update_interspace_name_log'
});

updateIntersapceNameLogSchema.set('versionKey', '_uinl');

var UpdateInterspaceNameLogModel = mongoose.model('UpdateInterspaceNameLogModel', updateIntersapceNameLogSchema);
exports.UpdateInterspaceNameLogModel = UpdateInterspaceNameLogModel;
exports.updateIntersapceNameLogSchema = updateIntersapceNameLogSchema;