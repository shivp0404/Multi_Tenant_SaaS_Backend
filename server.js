const app = require('./app')
const dotenv = require('dotenv')
const pool = require('./config/db')
dotenv.config();

const Port = process.env.PORT || 3000

const StartServer = async()=>{
    try{
        await pool.query('');

        app.listen(Port,()=>{
            console.log("Server is connected at:",Port)
        })
    }
    catch(e){
        console.log("Error:",e.message)
    }
}

StartServer()
