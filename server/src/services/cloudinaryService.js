const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary if credentials are present
const hasCloudinary = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('[Blaze Cloudinary] Initialized with cloud:', process.env.CLOUDINARY_CLOUD_NAME);
} else {
  console.log('[Blaze Cloudinary] Credentials not set. Will use direct URLs / data URIs.');
}

// Memory storage multer for handling image uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

const uploadImageBuffer = async (buffer, folder = 'blaze_menu') => {
  if (!hasCloudinary) {
    // Return base64 data URI fallback for zero-config testing
    const base64 = buffer.toString('base64');
    return `data:image/jpeg;base64,${base64}`;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
};

module.exports = {
  upload,
  uploadImageBuffer,
};
