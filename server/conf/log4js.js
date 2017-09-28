module.exports = {
    appenders: {
        out: { type: 'stdout' },
        app: { type: 'dateFile', filename: process.cwd() + '/logs/app', "pattern":"-yyyy-MM-dd.log",alwaysIncludePattern:true },
        error: {type: 'dateFile', filename: process.cwd() + '/logs/error', "pattern":"-yyyy-MM-dd.log",alwaysIncludePattern:true},
        errors: { type: 'logLevelFilter', appender: 'error', level: 'error'}
    },
    categories: {
        default: { appenders: [ 'out', 'app' ,'errors'], level: 'debug' }
    }
}