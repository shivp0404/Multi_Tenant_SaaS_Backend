const bcrypt = require('bcrypt')

const bcryptSevices ={
    
    hashPassword: (password)=>{
        return bcrypt.hash(password,10)
    }
}

module.exports = bcryptSevices


