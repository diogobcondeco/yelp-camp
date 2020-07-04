var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware"),
    geocoder = require("geocoder");

// =======================
// Show Campgrounds Route
// =======================

// Show campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, page: 'campgrounds'});
        }
    });
});

// Create Route - Add a new compground to the db
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    geocoder.geocode(req.body.location, function (err, data) {
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newCampground = {name: name, price: price, image: image, description: description, author: author, location: location, lat: lat, lng: lng};
        // Create a new campground and save to DB
        Campground.create(newCampground, function(err, newlyCreated){
            if (err) {
                console.log(err);
            } else {
                // redirect to /campsgrounds get
                req.flash("success", "Successfully created the campground.");
                res.redirect("/campgrounds");  
            }
        });
    });
});

// New Route - Show form to create campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// Show Route
router.get("/:id", function(req, res) {
    // find campground with defined id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err) {
            console.log(err)
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// Edit Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function (err, foundCampground){
        if (err){
            res.redirect("back")
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        };
    }); 
});

// Update Campground Route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newData = {name: req.body.name, image: req.body.image, description: req.body.description, cost: req.body.cost, location: location, lat: lat, lng: lng};
       // find and update the correct campground and then redirect somewhere
       Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, updatedCampground){
           if (err){
               req.flash("error", err.message);
               res.redirect("back");
           } else {
               req.flash("success","Successfully Updated!");
               res.redirect("/campgrounds/" + req.params.id);
           };
       });
    });
});

// Destroy Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err){
            res.redirect("back");
        } else {
            req.flash("success", "Successfully deleted the campground.");
            res.redirect("/campgrounds");
        };
    });
});

module.exports = router;