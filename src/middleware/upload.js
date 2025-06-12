const multer = require('multer');
const { supabaseAdmin } = require('../config/supabase');
const path = require('path');

// Configure multer to use memory storage
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Create multer instance with reduced file size for avatars
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit for avatars
    files: 1 // Only one file at a time
  }
});

// Supabase upload function
const uploadToSupabase = async (file, folder = 'avatars') => {
  try {
    // Check file size again
    if (file.size > 2 * 1024 * 1024) {
      throw new Error(`File too large. Maximum size is 2MB, but file is ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    }

    const fileExt = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    console.log(`Uploading file: ${file.originalname} (${(file.size / 1024).toFixed(2)}KB) to ${filePath}`);

    const { data, error } = await supabaseAdmin.storage
      .from('abdirahman-images') // Updated to match your actual bucket name
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: true // Allow overwriting files
      });

    if (error) {
      console.error('Supabase upload error details:', {
        message: error.message,
        statusCode: error.statusCode,
        error: error.error,
        bucket: 'abdirahman-images',
        filePath: filePath,
        fileSize: file.size,
        contentType: file.mimetype
      });
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('abdirahman-images')
      .getPublicUrl(filePath);

    console.log(`File uploaded successfully: ${publicUrl}`);

    return {
      url: publicUrl,
      path: filePath
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }
};

// Middleware to handle single file upload
const uploadSingle = (fieldName) => {
  return async (req, res, next) => {
    const uploadMiddleware = upload.single(fieldName);
    
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        let errorMessage = err.message;
        
        // Handle specific multer errors
        if (err.code === 'LIMIT_FILE_SIZE') {
          errorMessage = 'File too large. Maximum size allowed is 2MB';
        } else if (err.code === 'LIMIT_FILE_COUNT') {
          errorMessage = 'Too many files. Only one file allowed';
        } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          errorMessage = 'Unexpected field name. Use "avatar" as the field name';
        }
        
        return res.status(400).json({
          success: false,
          message: errorMessage,
          maxSize: '2MB'
        });
      }

      // If no file was uploaded, continue
      if (!req.file) {
        return next();
      }

      try {
        // Upload to Supabase
        const uploadResult = await uploadToSupabase(req.file);
        
        // Add Supabase info to req.file
        req.file.supabaseUrl = uploadResult.url;
        req.file.supabasePath = uploadResult.path;
        
        next();
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: 'Failed to upload file to storage',
          error: error.message,
          maxSize: '2MB'
        });
      }
    });
  };
};

module.exports = {
  single: uploadSingle,
  uploadToSupabase
}; 