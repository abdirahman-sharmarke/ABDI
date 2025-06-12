const { supabaseAdmin } = require('../config/supabase');
const path = require('path');

class StorageService {
  constructor() {
    this.bucketName = 'abdirahman-images';
  }

  // Upload file to Supabase storage
  async uploadFile(file, folder = 'avatars', userId = null) {
    try {
      const fileExt = path.extname(file.originalname);
      const baseFileName = path.basename(file.originalname, fileExt);
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2);
      
      // Create unique filename
      const fileName = userId 
        ? `${userId}-${timestamp}-${randomId}${fileExt}`
        : `${timestamp}-${randomId}${fileExt}`;
      
      const filePath = `${folder}/${fileName}`;

      const { data, error } = await supabaseAdmin.storage
        .from(this.bucketName)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false // Don't overwrite existing files
        });

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabaseAdmin.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      return {
        url: publicUrl,
        path: filePath,
        filename: fileName,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      };
    } catch (error) {
      throw new Error(`Storage upload failed: ${error.message}`);
    }
  }

  // Delete file from Supabase storage
  async deleteFile(filePath) {
    try {
      const { error } = await supabaseAdmin.storage
        .from(this.bucketName)
        .remove([filePath]);

      if (error) {
        throw new Error(`Delete failed: ${error.message}`);
      }

      return { success: true, message: 'File deleted successfully' };
    } catch (error) {
      throw new Error(`Storage delete failed: ${error.message}`);
    }
  }

  // Get public URL for a file
  getPublicUrl(filePath) {
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(this.bucketName)
      .getPublicUrl(filePath);

    return publicUrl;
  }

  // List files in a folder
  async listFiles(folder = 'avatars') {
    try {
      const { data, error } = await supabaseAdmin.storage
        .from(this.bucketName)
        .list(folder);

      if (error) {
        throw new Error(`List files failed: ${error.message}`);
      }

      return data.map(file => ({
        name: file.name,
        id: file.id,
        size: file.metadata?.size,
        contentType: file.metadata?.mimetype,
        createdAt: file.created_at,
        url: this.getPublicUrl(`${folder}/${file.name}`)
      }));
    } catch (error) {
      throw new Error(`Storage list failed: ${error.message}`);
    }
  }

  // Extract file path from Supabase URL
  extractFilePathFromUrl(url) {
    try {
      const urlParts = url.split('/storage/v1/object/public/abdirahman-images/');
      return urlParts[1] || null;
    } catch (error) {
      return null;
    }
  }
}

module.exports = new StorageService(); 