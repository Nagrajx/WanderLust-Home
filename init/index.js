const mongoose = require("mongoose");

const initData = require("./data.js");

const Listing = require("../models/listings.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";


main().then(() => {
    console.log("Connected to db")
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDb = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "67c293d4510e7180d979979e" }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDb();