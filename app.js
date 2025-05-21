if  (process.env.NODE_ENV !== "production") {

    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Listing = require("./models/listings.js");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingsRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const Localstrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");
const { isLoggedIn } = require("./middleware.js")


// For EJS Templating
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/// This is Middleware Function 
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Also For EJS
app.engine('ejs', ejsMate);
// This is Also Middleware Functions
app.use(express.static(path.join(__dirname, "/public")));


/// =====mongoose connections====
const dbUrl = process.env.ATLASDB_URL
main().then(() => {
    console.log("Connected to db")
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
})

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})



app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"))
})

//  async erorr handling middleware
app.use((err, req, res, next) => {
    let { status = 500, message = "Some error occured" } = err;
    res.status(status).render("error.ejs", { message });
    //    res.status(status).send(message);
});

// ======== server =========
app.listen(8080, () => {
    console.log("port is listening");
});