const User = require("../models/user");



module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.singup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        let registedUser = await User.register(newUser, password)
        // console.log(registedUser);
        req.login(registedUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome To SmartHomeFinder!");
            res.redirect("/listings");
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }

}


module.exports.renderLoginPage = (req, res) => {
    res.render("users/login.ejs");
}


module.exports.login = async (req, res) => {
    req.flash("success", "Welcome On SmartHomeFinder You are logged In! ");
    let redirectUrl = res.locals.redirectUrl || "/listings";

    res.redirect(redirectUrl);
}

module.exports.logOut = (req, res) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged Out!");
        res.redirect("/listings");
    })
}