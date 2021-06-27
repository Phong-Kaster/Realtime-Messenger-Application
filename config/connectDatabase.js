const mongoose = require('mongoose');
const bluebird = require('bluebird');

let connectDatabase = () =>{
    mongoose.Promise = bluebird;

    let URI = `mongodb://localhost:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    mongoose.connect(URI , { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => { console.log("Connected MongoDB successfully !!!") })
    .catch( (error) => { console.log( error ) } )
}
module.exports = connectDatabase;