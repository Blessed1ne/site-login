const express = require("express")
const app = express()
const mustache = require("mustache-express")
const bodyParser = require("body-parser")
const session = require("express-session")
const users = require("./users")
app.engine('mustache', mustache())
app.set('view engine', 'mustache')
app.use(express.static('public'))

//For Encryption purposes
var sess = {
  secret: 'secretpassword',
  cookie: {},
  saveUninitialized: true,
  resave: true
}
app.use(session(sess))
app.use(bodyParser.urlencoded({
  extended: false
}))

//Retrieves data and directs to homepage then redirects to login

app.get("/", function(req, res) {
  req.session.authorized = false
  res.redirect("/login")
})

app.get("/login", function(req, res) {
  res.render("login")
})

//this part is where the app process whether user information is verified
app.post("/authorized", function(req, res) {
      const username = req.body.username
      const password = req.body.password
      //Empty variable that goes through the user.js array to varify username and password
      let user
      for (var i = 0; i < users.length; i++) {
        if (users[i].username === username && users[i].password === password) {
          user = users[i]
        }
      }
      //directs user to index homepage if username and password are correct
      //if not correct user gets an error message
      if (user) {
        req.session.user = user
        req.session.authorized = true
        res.redirect("/index")
      } else {
        res.render("login", {
          message: "Something is wrong. Try again."
        })
      }
    })


app.use(function(req, res, next) {
  req.User = req.session.user
  next()
})

app.get("/index", function(req, res) {
  const authUser = req.User
  res.render("index", {
    authUser: authUser
  })
})

//directs to server 3000
app.listen(3000, function() {
console.log("listening to port 3000")
})
