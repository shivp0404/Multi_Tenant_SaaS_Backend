const pino = require('pino');

const logger = pino({
    level:"debug",
    timestamp:pino.stdTimeFunctions.isoTime,
    redact:[
        "req.headers.authorization","password"
]
})

module.exports = logger