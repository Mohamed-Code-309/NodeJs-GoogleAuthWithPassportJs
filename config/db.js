const mongoose = require('mongoose')

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser : true,
            useUnifiedTopology : true,
            useFindAndModify: false
            //these 3 options to avoid warning in consoles
        })

        console.log(`Mongodb Connected: ${conn.connection.host}`)
    }
    catch (err){
        console.log(err);
        process.exit(1); //stop everything, 1 for failure
    }
}

module.exports = connectDB; 