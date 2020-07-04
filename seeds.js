var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment")
    
var data = [
        {
            name: "Cloud's Rest",
            image: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse id elit id lacus vestibulum malesuada. Cras auctor pellentesque ligula, tincidunt scelerisque turpis pharetra non. Donec lorem velit, pretium vitae lobortis sit amet, lacinia ut justo. In bibendum maximus ex, vitae posuere eros."
        },
        {
            name: "Thirsty Sleep",
            image: "https://farm3.staticflickr.com/2116/2164766085_0229ac3f08.jpg",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse id elit id lacus vestibulum malesuada. Cras auctor pellentesque ligula, tincidunt scelerisque turpis pharetra non. Donec lorem velit, pretium vitae lobortis sit amet, lacinia ut justo. In bibendum maximus ex, vitae posuere eros."
        },
        {
            name: "Lake View",
            image: "https://farm3.staticflickr.com/2931/14128269785_f27fb630f3.jpg",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse id elit id lacus vestibulum malesuada. Cras auctor pellentesque ligula, tincidunt scelerisque turpis pharetra non. Donec lorem velit, pretium vitae lobortis sit amet, lacinia ut justo. In bibendum maximus ex, vitae posuere eros."
        },
        {
            name: "Friends Dirt",
            image: "https://farm4.staticflickr.com/3162/2642197987_2c71947286.jpg",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse id elit id lacus vestibulum malesuada. Cras auctor pellentesque ligula, tincidunt scelerisque turpis pharetra non. Donec lorem velit, pretium vitae lobortis sit amet, lacinia ut justo. In bibendum maximus ex, vitae posuere eros."
        }
    ]
    
function seedDB (){
    // Remove all campgrounds
    Campground.remove({}, function(err){
        if (err){
            console.log(err)
        } else {
            console.log("Campgrounds removed");   
        }
        
        // Add a few campgrounds
        data.forEach(function (seed){
            Campground.create(seed, function (err, campground){
                if (err) {
                    console.log(err);
                } else {
                    console.log("Added a campground");
                    
                    // Create comment
                    Comment.create({
                        text: "This place is great but I wish there was internet",
                        author: "Homer"
                        
                    }, function(err, comment){
                        if (err) {
                            console.log(err);
                        } else {
                            campground.comments.push(comment);
                            campground.save();
                            console.log("Created new comment");
                        }
                    });
                };
            });
        });
    });
    
    // Add a few comments
};

module.exports = seedDB;