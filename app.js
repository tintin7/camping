var express = require("express");
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var methodOverride = require("method-override");
var flash = require("connect-flash");
var Campground = require("./models/campground.js");
var Comments = require("./models/comment.js");
var seedDB = require("./seeds.js");
var User = require("./models/user.js");

var campgroundRoutes = require("./routes/campground.js");
var commentsRoutes = require("./routes/comment.js");
var authRoutes = require("./routes/auth.js");

var app = express();
mongoose.connect("mongodb+srv://tarun:tarun123@yelpcamp5-9zqd9.mongodb.net/test?retryWrites=true",{ useNewUrlParser: true });
//mongodb+srv://tarun:<PASSWORD>@cluster0-0xjzs.mongodb.net/test?retryWrites=true
//mongo "mongodb+srv://cluster0-0xjzs.mongodb.net/test" --username tarun
app.use(bodyparser.urlencoded({extended:true}));
//seedDB();
app.use(methodOverride("_method"));
app.use(flash());
app.use(express.static(__dirname + "/public"));

app.use(require("express-session")({
	secret:"msd is the best",
	resave:false,
	saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(campgroundRoutes);
app.use(commentsRoutes);
app.use(authRoutes);

// app.listen(3000,"0.0.0.0",function(){
// 	console.log("yelp camp server started!");
// });

app.listen(process.env.PORT,process.env.IP,function(){
	console.log("yelp camp server started!");
});