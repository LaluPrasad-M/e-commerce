const configure = require("log4js").configure;

configure({
    appenders: {
        out: { type: "stdout" },
        logger_info_file: { type: "file", filename: __dirname + "/../logs/logger_info.log", maxLogSize: 10485760, compress: true },
        logger_error_file: { type: "file", filename: __dirname + "/../logs/logger_error.log", maxLogSize: 10485760, compress: true },
    },
    categories: {
        default: {
            appenders: ["out"],
            level: "all"
        },
        info: {
            appenders: ["logger_info_file", "out"],
            level: "all"
        },
        error: {
            appenders: ["logger_error_file", "out"],
            level: "all"
        }
    }
})
