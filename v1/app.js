//require ('dotenv').config();
var express= require('express'),
	app=express(),
	bodyParser=require('body-parser'),
	mongoose=require("mongoose"),
	flash=require("connect-flash"),
	passport=require("passport"),
	LocalStrategy=require("passport-local"),
	methodOverride=require("method-override"),
	Campground=require("./models/campground"),
	User=require("./models/user"),
	seedDB= require("./seeds"),
	Comment=require("./models/comment");

//requiring routes
var commentRoutes=require("./routes/comments"),
	campgroundRoutes=require("./routes/campgrounds"),
	authRoutes=require("./routes/index");

mongoose.connect('mongodb+srv://shiristy:yelpcamp@cluster0-ibvyr.mongodb.net/test?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
}).then (() => {
	console.log('Connected to DB');
}).catch(err => {
	console.log('ERROR: ', err.messgae);
});

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

//PASSPORT CONFIGURATION

app.use(require("express-session")({
	secret: "ABCD",
	resave:false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
})

app.use(authRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

var port = process.env.PORT || 200;
app.listen(port, function(){
  console.log("Server Has Started!");
})