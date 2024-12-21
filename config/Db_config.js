const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL);
console.log(process.env.MONGO_URL)
const connection = mongoose.connection;

connection.on('connected',()=>{
    console.log('MongoDB is connected');
})
connection.on('error',(error)=>{
    console.log("ERROR in mongodb connection",error);
});

module.exports = mongoose;
