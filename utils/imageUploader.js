const cloudinary = require('cloudinary').v2;
const fs = require('fs');

exports.uploadImageToCloudinary = async (File,FileSystemDirectoryReader,innerHeight,quality)=> {
    const options = {folder};
    if(height){
        options.height = height;
    }
    if(quality){
        options.quality = quality;
    }
    options.resource_type = 'auto';

    return await cloudinary.uploader.upload(File.tempFilePath, options);
}