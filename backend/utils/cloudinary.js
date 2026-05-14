const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (buffer, mimetype, eventId) => {
  const uploadOptions = {
    folder: `wedsnap/${eventId}`,
    resource_type: mimetype.startsWith('video') ? 'video' : 'image',
    quality: 'auto',
    fetch_format: 'auto',
  };

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    uploadStream.end(buffer);
  });
};

const destroy = async publicId => {
  return cloudinary.uploader.destroy(publicId, { resource_type: 'auto' });
};

module.exports = { uploadToCloudinary, destroy };
