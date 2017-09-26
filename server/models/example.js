/**
 * Created by laizhiyuan on 2017/8/18.
 *
 * <p>
 *      例子Schema
 *  example schema
 * </p>
 *
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var exampleSchema = new Schema({
    name: {type: String, required: true, unique: true, lowercase: true},
    gender: {type: Number, required: false, unique: false, min: 16, max: 50},
    create_time: {type: Date, required: true, unique: false, default:Date.now()},
    is_delete: {type: Boolean, required: true, unique: false, default: 0},
    status: {type: Number, required: true, unique:false, default:1, enum:[1,2,3]},
    u: {type: Date, required: true, default: Date.now(), alias: 'update_time'},
    hobby: {type: [String]},
    testToUpperCase: {type: String, required: true, default:'TestToUpperCase', uppercase: true},
    testTrim: {type: String, required:true, default:'  Test  Trim   ', trim: true},
    size: {type: Number, required: true, default: Math.random()}

},{
    collection:'example',
    id: true,
    _id: true,
    autoIndex: true,
    safe: true,
    strict: true,
    retainKeyOrder: true
});

exampleSchema.set('toJSON', {getters: true, virtual: true});
exampleSchema.set('validateBeforeSave', true);
exampleSchema.set('versionKey', '_example');
exampleSchema.set('timestamps', {createAt:'test_create', updateAt: 'test_update'});

exampleSchema.virtual('state').get(function () {
    if (this.status == 1){
        return "激活";
    }
    if (this.status == 2){
        return "冻结";
    }
    if (this.status == 3){
        return "停用";
    }
}).set(function (status) {
    if (status == '激活') {
        this.status = 1;
    }
    if (status == '冻结') {
        this.status = 2;
    }
    if (status == '停用') {
        this.status = 3;
    }
});

exampleSchema.pre('validate', function (next) {
    if (this.gender < 15){
        console.log("gender lt 15, current set min default value 16");
        this.gender = 16;
    }

    if (this.gender > 50){
        console.log("gender gt 50, current set max default value 50");
        this.gender = 50;
    }
    next();
})

exampleSchema.static.staticMethod = function (req, res) {
    if (req.query.name != null){
        res.json("Hello: " + req.query.name);
    }else {
        res.json("Hello: stranger");
    }
};

exampleSchema.methods.sayHello = function(req, res){
    if (req.query.name != null){
        res.json("Hello: " + req.query.name);
    }else {
        res.json("Hello: stranger");
    }
};

//编译模型
var ExampleModel = mongoose.model('ExampleModel', exampleSchema, false);
exports.ExampleModel = ExampleModel;
exports.exampleSchema = exampleSchema;
