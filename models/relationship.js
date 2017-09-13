/**
 * Created by laizhiyuan on 2017/9/13.
 *
 * <p>
 *    往来关系中间集合Schema、比如，关注和访问
 * </p>
 *
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var relationshipSchema = new Schema({
    subject: {type: String, required: true, index: 1},
    from: {type: String, required: true, index: 1},
    type: {type: Number, required: true, default: 1, enum: [1,2,3,4,5]}, //1:关注关系 2:访问关系 其它预留字段
    ip: {type: String, required: false, index: 1},
    create_time: {type: Date, required: true, default: Date.now()},
    update_time: {type: Date, required: true, default: Date.now()}
},{
    _id: true,
    id: true,
    collection: 'relationship'
});

var RelationshipModel = mongoose.model('RelationshipModel', relationshipSchema);
exports.RelationshipModel = RelationshipModel;
exports.relationshipSchema = relationshipSchema;