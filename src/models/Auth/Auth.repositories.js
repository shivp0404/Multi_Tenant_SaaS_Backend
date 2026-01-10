const AuthQueries = require('./Auth.queries')
const pool = require('../../../config/db')


const AuthRepositories = {

    createuser: async (name,email,password)=>{
      const user = await  pool.query(AuthQueries.createuser,[name,email,password])
      return user.rows[0] || null
    },

    findbyemail:async(email)=>{
        const user = await pool.query(AuthQueries.findbyemail,[email])
        return user.rows[0] || null
    },

    updateRefreshToken: async(RefreshToken,id)=>{
      const user = await pool.query(AuthQueries.updateRefreshToken,[RefreshToken,id])
      return user.rowCount 
    },

    findbyid: async(id)=>{
      const user = await pool.query(AuthQueries.findbyid,[id])
      return user.rows[0] || null
    }

  
}

module.exports = AuthRepositories