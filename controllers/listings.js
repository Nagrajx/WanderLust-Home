const Listing = require("../models/listings");

module.exports.index = async (req, res,) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
};

module.exports.newForm = (req, res) => {
    res.render("./listings/new.ejs");
};

module.exports.showListings = (async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews", populate: { path: "author" },
    }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing Already Deleted");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listings/show.ejs", { listing });
});

module.exports.create = (async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Listing created!");
    res.redirect("/listings");
});

module.exports.editListings = (async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you reqested for does not exist!");
        res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { listing });
});


module.exports.updateListings = (async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });


    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "New Listing Updated!");
    res.redirect(`/listings/${id}`);
});

module.exports.deleteListings = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedListing = await Listing.findByIdAndDelete(id);
        if (!deletedListing) {
            req.flash("error", "Listing not found.");
            return res.redirect("/listings");
        }
        req.flash("success", "Listing deleted successfully!");
        res.redirect("/listings");
    } catch (err) {
        next(err); // Pass error to Express error handler
    }
};
