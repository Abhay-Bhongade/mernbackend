const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

const routes = require('./routes/index');

const app = express();
dotenv.config();

app.use(bodyParser.json());

app.use(express.static(path.join('public')));
app.use((req,res,next) => {
  
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type, Accept,Authorization,Origin");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    //res.setHeader("Access-Control-Allow-Credentials", true);
    next();
})

app.use('/api',routes);


mongoose.connect(
    process.env.DATABASE_URL,
    {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true,
        poolSize: 10,
        dbName: "Construction"
    }
    )
    .then(() => {
        console.log("connected");
        app.listen(process.env.PORT || 5000, () => console.log(`Server Running On Port ${process.env.PORT}...`));
    })
    .catch((err) => {
        console.log(err, process.env.DATABASE_URL);
    });
