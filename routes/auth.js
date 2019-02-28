var express = require("express");
var passport = require("passport");
var router = express.Router();
var User = require("../models/user.js");

router.get("/",function(req,res){
	res.render("landing.ejs");
	});

//Register routes
router.get("/register",function(req,res){
	res.render("register.ejs");
});

router.post("/register",function(req,res){
	User.register(new User({username:req.body.username}),req.body.password,function(err,user){
		if(err){
			console.log(err.message);
			req.flash("error",err);
			return res.render("register.ejs");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to Yelp Camp "+ user.username);
			res.redirect("/campgrounds");
		});
	});
});

//Login routes
router.get("/login",function(req,res){
	res.render("login.ejs");
});

router.post("/login",passport.authenticate("local",{
	successRedirect :"/campgrounds",
	failureRedirect: "/login"
}),function(req,res){
});

//logout routes
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","successfully logged out");
	res.redirect("/campgrounds");
});

//middleware
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","please login first");
	res.redirect("/login");
}

module.exports = router;
