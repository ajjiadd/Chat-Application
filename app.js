//external Imports
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const loginRouter = require("./router/loginRouter");
const usersRouter = require("./router/usersRouter");
const inboxRouter = require("./router/inboxRouter");

//internal Imports
const {notFoundHandler, errorHandler} = require("./middlewares/common/errorHandler");

//create app
const app = express();
dotenv.config();

//Database connection with mongoose
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => console.log("Database connection successfull"))
  .catch(() => console.log("err"));


//Request parsers
app.use(express.json());
app.use(express.urlencoded({extended: true})); //this line use for HTML handle

//set view engine
app.set("view engine", "ejs");

//set static folder(folder:public)
app.use(express.static(path.join(__dirname, "public")));

//parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

//routing setup
app.use("/", loginRouter);
app.use("/users", usersRouter);
app.use("/inbox", inboxRouter);

//404 not found handler
app.use(notFoundHandler);
//Common Error
app.use(errorHandler);


//APP listen
app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
});