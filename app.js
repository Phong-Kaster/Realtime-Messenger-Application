require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const connectDatabase = require('./config/connectDatabase.js');
connectDatabase();
const contactSchema = require('./models/contact.model');
app.get('/createClone' , async (req,res) =>{
    try {
        let item = {
            userId : "999",
            contactId : "909"
        }
        let contact = await contactSchema.createClone( item);
        res.send(contact);
    }
     catch (error) {
        console.log( error);
    }
})

app.listen( port, () => {
    console.log(`Server is running on port http://localhost/${port}`);
});