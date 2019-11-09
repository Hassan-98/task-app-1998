// Modules
const path = require("path")
const express = require("express")
const mongoose = require("mongoose")
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const bodyParser = require('body-parser');

// Session MongoDB Store
const store = new MongoDBStore({
   uri: process.env.MONGODB_URL,
   collection: 'Sessions'
 });

// Firing Express
const app = express()

// Mongoose Database
mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true})


// Folders Pathes
var publicFolder = path.join(__dirname, "../public")
var viewsFolder = path.join(__dirname, "../templates/pages")

// Setting The View Engine
app.set('view engine', 'pug')
// Setting The Views Directory
app.set('views', viewsFolder)
// Setting The Static Folder
app.use(express.static(publicFolder))
// Setting JSON in Body Of Requests
app.use(express.json())
// Form Body Parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// Flash Session
app.use(flash())
// Session
app.use(session({
   secret: process.env.MOGODB_SECRET,
   saveUninitialized: false,
   resave: true,
   cookie: {
      maxAge: 7 * 24 * 60 * 60 * 100
   },
   store
 }))

// Routes
const homeRouter = require("./routes/home_route")
const authRouter = require("./routes/auth_route")
const usersRouter = require("./routes/users_route")
const tasksRouter = require("./routes/tasks_route")
const profileRouter = require("./routes/profile_route")
app.use(homeRouter)
app.use(authRouter)
app.use(usersRouter)
app.use(tasksRouter)
app.use(profileRouter)

// The Not Found Page Route
app.get("*", (req, res) => {
   res.render("NotFound", {
      title: "Not Found"
   })
})

// Creating A Server
const port = process.env.PORT
app.listen(port, () => {
   console.log(`Server Is Started At Port ${port}`)
})