var mongoose = require("mongoose");
var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js");


var data =[
	{
		name:"pushkar rajasthan",
		image:"https://www.visittnt.com/blog/wp-content/uploads/2018/01/Camping-in-Rajasthan-1.jpg",
		description:"this is in ajmer"
	},
	{
		name:"pushkar rajasthan",
		image:"https://www.visittnt.com/blog/wp-content/uploads/2018/01/Camping-in-Rajasthan-1.jpg",
		description:"this is in ajmer"
	},
	{
		name:"pushkar rajasthan",
		image:"https://www.visittnt.com/blog/wp-content/uploads/2018/01/Camping-in-Rajasthan-1.jpg",
		description:"this is in ajmer"
	}
];

function seedDB(){
	// remove all campgrounds
	Campground.remove({},function(err){
		if(err){
			console.log(err);
		}
			console.log("campground removed");
			// add few campground
	data.forEach(function(seed){
		Campground.create(seed,function(err,newcamp){
		if(err){
			console.log(err);
		}
		else{
			console.log("campground craeted");
				//add few comments
				Comment.create({
					text:"go india go!",
					author:"tarun gahlot"
				},function(err,newcomment){
					newcamp.comments.push(newcomment);
					newcamp.save();
					console.log("new comments created");

				});
		}
	});
	});
	});
}
module.exports = seedDB;