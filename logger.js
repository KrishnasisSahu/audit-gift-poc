const {createLogger, transports, format} = require('winston')


const dataLogger = createLogger({
    transports : [
        new transports.File({
            filename : './Log/dataemitted.log',
            level : 'info',
            format : format.combine(format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),format.json())
        }),
        // new transports.File({
        //     filename : 'datalogged.log',
        //     level : 'passed',
        //     format : format.combine(format.timestamp(),format.json())

        // }),
        // new transports.File({
        //     filename : 'datanotfound.log',
        //     level : 'warn',
        //     format : format.combine(format.timestamp(),format.json())

        // }),
        new transports.File({
            filename : './Log/data-error.log',
            level : 'error',
            format : format.combine(format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),format.json())

        })

    ]
})
module.exports = {dataLogger}