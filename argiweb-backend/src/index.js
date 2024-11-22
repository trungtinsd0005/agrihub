const express = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const routes = require("./routes");
const { urlencoded } = require("body-parser");
const cors = require("cors");
const scheduleJobs = require("./services/scheduleJobs");

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));

routes(app);

mongoose
  .connect(`${process.env.MONGO_DB}`)
  .then(() => {
    console.log("Connect Database Success");
  })
  .catch((err) => {
    console.log(err);
  });

scheduleJobs();

app.listen(port, () => {
  console.log("Server is running in port:  " + port);
});
