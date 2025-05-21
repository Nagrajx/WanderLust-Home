const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.NODE.ENV.CLOUD_NAME,
    api_key: process.env.NODE.ENV.CLOUD_API_KEY,
    api_secret: process.env.NODE.ENV.CLOUD_API_SECRET
});


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'SmartHomeFinder',
        allowedFormats: ["png", "jpg", "jpeg"]

    },
});

module.exports = {
    cloudinary,
    storage,
};