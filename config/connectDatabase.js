const mongoose = require('mongoose');
const bluebird = require('bluebird');

let connectDatabase = () =>{
    mongoose.Promise = bluebird;

    let URL = `mongodb://127.0.0.1:27017/rma`;
    mongoose.connect(URL , { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => { console.log("Connected MongoDB successfully !!!") })
    .catch( (error) => { console.log( error ) } )
}
module.exports = connectDatabase;