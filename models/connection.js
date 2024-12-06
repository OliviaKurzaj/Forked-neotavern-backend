const mongoose = require("mongoose");

const connectionString =
  "mongodb+srv://admin:sZDlwHNCg29JqDoD@cluster0.t6zdt.mongodb.net/neotavern";

mongoose
  .connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log("Database connected"))
  .catch((error) => console.log(error));

module.exports = connectionString;
