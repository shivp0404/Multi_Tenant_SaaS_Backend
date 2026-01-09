const bcrypt = require('bcrypt')

const bcryptSevices ={
    
    hashPassword: (password)=>{
        return bcrypt.hash(password,10)
    },
    comparePassword :(plainPassword,hashPassword)=>{
        return bcrypt.compare(plainPassword,hashPassword)
    }
}

module.exports = bcryptSevices


