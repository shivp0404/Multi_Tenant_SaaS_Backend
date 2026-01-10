const bcrypt = require('bcrypt')

const bcryptSevices ={
    
    hashPassword: (password)=>{
        return bcrypt.hash(password,10)
    },
    comparePassword :(plainPassword,hashPassword)=>{
        return bcrypt.compare(plainPassword,hashPassword)
    },
    hashToken: (token)=>{
        return bcrypt.hash(token,10)
    },
    compareToken :(plainToken,hashtoken)=>{
        return bcrypt.compare(plainToken,hashtoken)
    },
}

module.exports = bcryptSevices


