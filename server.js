const app = require('./app')
const dotenv = require('dotenv')
dotenv.config();

const Port = process.env.PORT

app.listen(Port,()=>{
    console.log(`Server is connected at ${Port}`)
})