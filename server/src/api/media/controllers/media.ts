// path: ./src/api/media/controllers/media.ts

import { factories } from '@strapi/strapi';
import { Context } from 'koa';
import path from 'path';
import fs from 'fs'
import { promisify } from 'util';
const moveFile = promisify(fs.rename);

/**
 * Controller for handling media files.
 * This uses Strapi's core factory to extend and customize actions.
 */
export default factories.createCoreController('plugin::upload.file', ({ strapi }) => ({
  // Custom action to get all media files from a specific folder
  async findByFolder(ctx: Context) {
    try {
      // Get the folder name or ID from the query parameters
      const { folder } = ctx.query;  // Folder can be passed as a query parameter

      if (!folder) {
        return ctx.badRequest('Folder identifier is required');
      }

      // Fetch the folder from the database by name or ID
      const folderData = await strapi.db.query('plugin::upload.folder').findOne({
        where: {
          name: folder, // Query by folder name
        },
      });

      if (!folderData) {
        return ctx.notFound('Folder not found');
      }

      // Fetch files related to this folder
      const files = await strapi.db.query('plugin::upload.file').findMany({
        where: {
          folder: {
            id: folderData.id,  // Filter files based on folder ID
          },
        },
        select: ['id','name', 'url', 'ext', 'createdAt', 'size', 'folderPath']
      });

      // Return the files from the folder
      ctx.send(files);
    } catch (error) {
      console.error('Error occurred while fetching files:', error);
      // Handle any errors
      ctx.badRequest('An error occurred while fetching files', { error });
    }
  },

  async deleteByFile(ctx: Context) {
    try {
      const { folder, fileId } = ctx.params; // Folder name and file ID

      if (!folder || !fileId) {
        return ctx.badRequest('Folder and file ID are required');
      }

      // Fetch the folder from the database by name
      const folderData = await strapi.db.query('plugin::upload.folder').findOne({
        where: {
          name: folder, // Query by folder name
        },
      });

      if (!folderData) {
        return ctx.notFound('Folder not found');
      }

      // Fetch the file from the database
      const file = await strapi.db.query('plugin::upload.file').findOne({
        where: {
          id: fileId,
          folder: folderData.id, // Ensure the file is in the correct folder
        },
      });

      if (!file) {
        return ctx.notFound('File not found in this folder');
      }

     

      // Delete the file from the database
      await strapi.db.query('plugin::upload.file').delete({
        where: { id: fileId },
      });

      const filePath = file.url.replace(process.env.STRAPI_URL, ''); // Adjust the path if needed
      const fileToDelete = path.join(strapi.dirs.static.public, filePath); // Join with the public directory

      if (fs.existsSync(fileToDelete)) {
        fs.unlinkSync(fileToDelete); // Delete the file from the file system
      } else {
      }

      await strapi.service('api::log.log').createLog({
        Type: 'File',
        User: ctx.state.user?.username,
        State: 'Success',
        Activity: 'Deleted File',
        Source: ctx.request.ip,
        Browser: ctx.request.headers['user-agent']
      });


      // Return a success message
      ctx.send({ message: 'File successfully deleted' });
    } catch (error) {
      console.error('Error occurred while deleting file:', error);
      ctx.badRequest('An error occurred while deleting the file', { error });
    }
  },

  async uploadFile(ctx) {
    const { files } = ctx.request;
    
    
    // Handle the case where there is a single file or an array of files
    let file;
    if (Array.isArray(files.file)) {
      file = files.file[0]; // Use the first file if multiple files are uploaded
    } else {
      file = files.file;
    }
  
    // Validate if the file exists
    if (!file) {
      return ctx.badRequest('No file uploaded');
    }

    console.log(file);

    const MAX_FILE_SIZE_MB = parseInt(process.env.MAX_FILE_SIZE_MB || '50');
    const maxFileSizeBytes = MAX_FILE_SIZE_MB * 1024 * 1024;

    if (file.size > maxFileSizeBytes) {
      return ctx.badRequest(`File too large. Max size is ${MAX_FILE_SIZE_MB}MB.`);
    }
  
    // Find or create the folder where the file will be stored
    const folder = await strapi.db.query('plugin::upload.folder').findOne({
      where: { name: 'Files' }, // Adjust the folder name as needed
    });
  
    if (!folder) {
      return ctx.badRequest('Folder not found');
    }
  
    // Create the path where the file will be stored in public/uploads
    const uploadsPath = path.join(strapi.dirs.static.public, 'uploads');
    
    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath, { recursive: true });
    }
  
    // Generate the file path
    const ext = path.extname(file.originalFilename); // Get the file extension
    const name = file.originalFilename; // Use the original filename
    const filePath = path.join(uploadsPath, name); // Full path where the file will be saved
  
    // Move the file to the `public/uploads` folder
    await moveFile(file.filepath, filePath); // Use fs.rename to move the file
  
    // Save metadata in the database
    const uploadData = {
      name, // Original filename
      hash: name.split('.')[0], // File name without the extension
      ext, // File extension (e.g., .txt, .jpg)
      mime: file.mimetype, // MIME type (e.g., text/plain, image/jpeg)
      size: file.size / 1000, // Size in KB (convert from bytes to kilobytes)
      url: `/uploads/${name}`, // URL to access the file
      folder: folder.id, // Folder ID from the database
      folderPath: '/1'
    };
  
    // Save the file data into the database
    const uploadedFile = await strapi.db.query('plugin::upload.file').create({
      data: uploadData,
    });
    

    await strapi.service('api::log.log').createLog({
      Type: 'File',
      User: ctx.state.user?.username,
      State: 'Success',
      Activity: `Created File: ${name}`,
      Source: ctx.request.ip,
      Browser: ctx.request.headers['user-agent']
    });
  
    // Return the uploaded file details as a response
    ctx.send(uploadedFile);
  }
}));
