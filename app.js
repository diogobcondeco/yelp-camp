var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    moment = require("moment"),
    passport = require("passport"),
    flash = require("connect-flash"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");
    
app.locals.moment = moment;

// Requiring Routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index")

var dburl = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
// console.log(dburl);

// Database
// mongoose.connect("mongodb://localhost/yelp_camp", { useMongoClient: true });
mongoose.connect(dburl, { useMongoClient: true });
// mongoose.connect("mongodb://diogobcondeco:udemy12345@ds235827.mlab.com:35827/yelp-camp", {useMongoClient: true});
mongoose.Promise = global.Promise;

// Using method-override
app.use(methodOverride("_method"));

// Using connect-flash (gotta be before passport config)
app.use(flash());

// Seeding the Database
// seedDB();

// Passport Configuration
app.use(require("express-session")({
    secret: "Once again Rust wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Body Parser
app.use(bodyParser.urlencoded({extended: true}));

// Set
app.set("view engine", "ejs");

// CSS
app.use(express.static(__dirname + "/public"));

// Set currentUser to be accessed in all routes
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Use Routes
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// Listen Cloud9
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server is online!");
});

// Listen Localhost
// app.listen(3000, function(){
//     console.log("YelpCamp Server is online!");
// });