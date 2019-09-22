var express = require("express");
var mongoose = require("mongoose");
var bodyParser  = require("body-parser");
var passport    = require("passport");
var LocalStrategy = require("passport-local");
var User   = require("./models/user");
var passportLocalMongoose = require("passport-local-mongoose");
var validator = require("express-validator");
mongoose.connect("mongodb://localhost:27017/live_med_app", { useUnifiedTopology: true });


var app = express();

//need these two lines anytime we need passport
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
// PASSPORT CONFIGURATION
app.use(require("express-session")({
   secret: "June the best!",
   resave: false,
   saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/",function (req,res) {
   res.render("landing");
});
app.get("/secret",function (req,res) {
   res.render("secret");
});
//show sign up form
app.get("/register", function(req, res){
   res.render("register");
});
//handling user sign up
app.post("/register", function(req, res){
   User.register(new User({username: req.body.username}), req.body.password, function(err, user){
      if(err){
         console.log(err);
         return res.render('register');
      }
      passport.authenticate("local")(req, res, function(){
         res.redirect("/secret");
      });
   });
});

//LOGIN ROUTES
//render login form
app.get("/login", function(req, res){
   res.render("login");
});
//login logic
//middleware
app.post("/login", passport.authenticate("local", {
   successRedirect: "/secret",
   failureRedirect: "/login"
}) ,function(req, res){
});

app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/");
});


function isLoggedIn(req, res, next){
   if(req.isAuthenticated()){
      return next();
   }
   res.redirect("/login");
}

app.listen(3000, () => console.log(`Example app listening on port ${3000}!`))