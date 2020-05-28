var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");

//root route
router.get("/", function(req, res){
	res.render("landing");
});

//===================================
//AUTH ROUTES

//show registeration form
router.get("/register", function(req, res){
		res.render("register", {page: 'register'});
		})

//handle signup
router.post("/register", function(req, res){
	var newUser=new User({username:req.body.username})
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			return res.render("register", {error: err.message});
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Successfully signed Up! Nice to meet you, "+ user.username);
			res.redirect("/campgrounds");
		})
	})
})

//show login
router.get("/login", function(req, res){
	res.render("login", {page: 'login'});
})

router.post("/login", 
		 passport.authenticate('local', 
			{successRedirect: "/campgrounds", 
			failureRedirect:"/login"}
			),function(req, res){
	
})

//logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged You Out!");
	res.redirect("/campgrounds");
})

module.exports=router;
