/**
 * Created by lzy on 2017/10/6.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dateSchema = new Schema({
    date:{
        type: {
            year: {type: Number},
            month: {type: Number},
            day: {type: Number}
        }
    }
});

module.exports = dateSchema;