const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listings.js");
const Review = require("../models/review.js");
const review = require("../models/review.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const { validateReviwe } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js")

//POST ROute
router.post("/", isLoggedIn, validateReviwe, wrapAsync(reviewController.createReview));

// Delete Review Route

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;