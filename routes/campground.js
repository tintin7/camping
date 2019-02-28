var express = require("express");
var router = express.Router();
var Campground = require("../models/campground.js");

//INDEX ROUTE
router.get("/campgrounds",function(req,res){
	// get all campground from db
	Campground.find({},function(err,allcamp){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds.ejs",{place:allcamp , currentUser:req.user });
		}
	});
	 
	});
//CREATE ROUTE
router.post("/campgrounds",isLoggedIn,function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var author={
		id: req.user._id,
		username: req.user.username
	};
	var newCamp = {name:name , image:image,description:description,author:author};
	Campground.create(newCamp,function(err,newcamps){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/campgrounds");
		}
	});
});
//NEW ROUTES
router.get("/campgrounds/new",isLoggedIn,function(req,res){
	res.render("new.ejs");
	});
//SHOW ROUTE
router.get("/campgrounds/:id",function(req,res){
	//grab the id
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundcamp){
		if(err){
			console.log(err);
		}
		else{
			//show the content of id
			res.render("show.ejs",{campground:foundcamp});
		}
	});
});

//Edit and Update
router.get("/campgrounds/:id/edit",checkCampOwnership,function(req,res){
	Campground.findById(req.params.id,function(err,foundcamp){
		if(err){
			console.log(err);
		}
		else{
			res.render("edit.ejs",{campground:foundcamp});
		}
	});
});

router.put("/campgrounds/:id",checkCampOwnership,function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatecamp){
		if(err){
			console.log(err);
		}
		else{
			req.flash("success","Successfully Updated Campground");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

//Delete routes
router.delete("/campgrounds/:id",checkCampOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/campgrounds");
		}
	});
});


//middleware
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be logged in to do that");
	res.redirect("/login");
}

function checkCampOwnership(req,res,next){
	//check user logged in
	if(req.isAuthenticated()){
		Campground.findById(req.params.id,function(err,foundcamp){
			if(err){
				res.redirect("back");
			}
			else{
				//check campground author id with user id 
				if(foundcamp.author.id.equals(req.user._id)){
					next();
				}
				else{
					req.flash("error","You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	}
	else{
		req.flash("error","please login first");
		res.redirect("back");
	}
}

module.exports = router;

