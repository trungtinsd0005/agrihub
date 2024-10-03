const express = require('express');
const dotenv = require('dotenv');
const { default: mongoose } = require('mongoose');
const routes = require('./routes');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

app.use(cors())
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

routes(app);

mongoose.connect(`${process.env.MONGO_DB}`)
.then(() => {
    console.log("Connect Database Success");
})
.catch((err) => {
    console.log(err);
})

app.listen(port, () => {
    console.log("Server is running in port:  " + port);
})