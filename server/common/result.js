/**
 * Created by lzy on 2017/9/23.
 */
module.exports =  {
    json: function (status, code, msg, data) {
        return {
            status: status,
            code: code,
            msg: msg,
            data: data
        }
    }
};