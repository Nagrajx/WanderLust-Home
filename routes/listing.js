const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listings.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer')
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage });


router.route("/")
    .get(wrapAsync(listingController.index)
    )
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.create)
    );

//====new route =========

router.get("/new", isLoggedIn, (listingController.newForm));

// preview route//
router.get("/preview", async (req, res) => {
    const limitedListings = await Listing.find({}).limit(3); // bas 3 listing
    res.render("listings/preview", { allListings: limitedListings });
});

//    search-route
router.get("/search", async (req, res) => {
    const query = req.query.q || "";
    const regex = new RegExp(query, "i"); // case-insensitive

    const listings = await Listing.find({
        $or: [
            { title: regex },
            { location: regex },
            { category: regex }
        ]
    });

    res.render("listings/search", { allListings: listings, query });
});


router.route("/:id")
    .get(wrapAsync(listingController.showListings)
    )
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListings)
    )
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListings)
    );


//===== Edit route=============

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListings));

module.exports = router;
