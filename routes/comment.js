var express = require("express");
var router = express.Router();
var Campground = require("../models/campground.js");
var Comments = require("../models/comment.js");

//===============
//Comments routes
//campground/:id/comments/new  GET
//campground/:id/comments      POST
//===============
router.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
	//find the campground by id
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
		}
		else{
			//send it to new page of commnets
			res.render("comment_new.ejs",{campground:campground});
		}
	});
});

router.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
	//lookup campground using id
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log("err");
		}
		else{
				//create new comments
	Comments.create(req.body.comment,function(err,newcomment){
		if(err){
			console.log("err");
		}
		else{
			//add username and id to comment and save
			newcomment.author.id = req.user._id;
			newcomment.author.username = req.user.username;
			newcomment.save();
			//connect new comments to campgrounds
			campground.comments.push(newcomment);
			campground.save();
			//redirect to show page
			req.flash("success","Comment successfully created");
			res.redirect("/campgrounds/"+ campground._id);
		}
	});
		}
	});
});

//Edit Route
router.get("/campgrounds/:id/comments/:comment_id/edit", checkCommentOwnership ,function(req,res){
	Comments.findById(req.params.comment_id,function(err,foundcomment){
		if(err){
			res.redirect("back");
		}
		else{
			res.render("comment_edit.ejs",{campground_id:req.params.id,comment:foundcomment});	
		}
	});
});

//Update Route
router.put("/campgrounds/:id/comments/:comment_id", checkCommentOwnership ,function(req,res){
	Comments.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedcomment){
		if(err){
			res.redirect("back");
		}
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

//Delete Route
router.delete("/campgrounds/:id/comments/:comment_id", checkCommentOwnership ,function(req,res){
	Comments.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect("back");
		}
		else{
			res.redirect("/campgrounds/"+req.params.id);
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

function checkCommentOwnership(req,res,next){
	//check user logged in
	if(req.isAuthenticated()){
		Comments.findById(req.params.id,function(err,foundcomment){
			if(err){
				res.redirect("back");
			}
			else{
				//check campground author id with user id 
				if(foundcomment.author.id.equals(req.user._id)){
					next();
				}
				else{
					req.flash("error","You don't have a permission to do that");
					res.redirect("back");
				}
			}
		});
	}
	else{
		req.flash("error","You need to be logged in to do that");
		res.redirect("back");
	}
}

module.exports = router;

