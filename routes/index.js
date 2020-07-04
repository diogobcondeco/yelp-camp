var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");

// =======================
// Root Routes
// =======================

// Main/Index Route
router.get("/", function(req, res) {
    res.render("landing")
});

// =======================
// Auth Routes
// =======================

// Register
router.get("/register", function(req, res) {
    res.render("register", {page: 'register'});
});

// Handle the register logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    
    // Set Admin Code
    if (req.body.adminCode === 'secretcode123'){
        newUser.isAdmin = true;
    };
    
    User.register(newUser, req.body.password, function(err, user){
        if (err) {
            console.log(err.message);
            return res.render("register", {error: err.message + "."});
        } else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to YelpCamp " + user.username + "!");
                res.redirect("/campgrounds");
            });
        }
    });
});

// Login
router.get("/login", function(req, res) {
   res.render("login", {page: 'login'}); 
});

// Using middleware on login
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res) {
    
});

// Logout
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Successfully logged you out.");
    res.redirect("/campgrounds");
});

module.exports = router;