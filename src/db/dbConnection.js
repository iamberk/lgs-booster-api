const mongoose = require('mongoose');
require('dotenv').config();
mongoose.set("strictQuery", false);

mongoose.connect(process.env.DB_URL,{
    useNewUrlParser: true,
     useUnifiedTopology: true,
}).then(()=>{console.log("bağlandı");}).catch((err)=>{console.log(err);});