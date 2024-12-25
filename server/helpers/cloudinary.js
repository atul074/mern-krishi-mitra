const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// cloudinary.config({
//   cloud_name: "de7imsn1h",
//   api_key: "198963114891834",
//   api_secret: "91_tWkPaYmsOOJhmy6Pc8NRVGzo",
// });

// const storage = new multer.memoryStorage();

// async function imageUploadUtil(file) {
//   const result = await cloudinary.uploader.upload(file, {
//     resource_type: "auto",
//   });

//   return result;
// }

const upload = multer({ storage });

module.exports = { upload, imageUploadUtil };