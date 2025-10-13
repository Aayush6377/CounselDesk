// import fs from 'fs';
// import { unlink } from 'fs/promises';
// import path from 'path';

import cloudinary from '../config/cloadinary.js';

const getPublicIdFromUrl = (fileUrl) => {
    try {
        const parts = fileUrl.split('/');
        const versionIndex = parts.findIndex(part => part.startsWith('v'));
        if (versionIndex === -1) return null;

        const publicIdWithFormat = parts.slice(versionIndex + 1).join('/');
        
        const lastDotIndex = publicIdWithFormat.lastIndexOf('.');
        if (lastDotIndex === -1) {
            return publicIdWithFormat;
        }
        return publicIdWithFormat.substring(0, lastDotIndex);
    } catch (error) {
        console.error("Error parsing Cloudinary URL:", error);
        return null;
    }
};


// const deleteUploadedFiles = (files) => {
//     if (!files) return;

//     for (const fieldName in files) {
//         if (Object.prototype.hasOwnProperty.call(files, fieldName)) {
//             const uploadedFilesArray = files[fieldName];

//             uploadedFilesArray.forEach(file => {
//                 fs.unlink(file.path, (err) => {
//                     if (err) {
//                         console.error(`Error deleting file: ${file.path}`, err);
//                     } else {
//                         console.log(`Successfully deleted file: ${file.path}`);
//                     }
//                 });
//             });
//         }
//     }
// };

const deleteUploadedFiles = async (files) => {
    if (!files) return;

    const deletionPromises = [];

    for (const fieldName in files) {
        if (Object.prototype.hasOwnProperty.call(files, fieldName)) {
            const uploadedFilesArray = files[fieldName];
            
            uploadedFilesArray.forEach(file => {
                const publicId = file.filename;
                if (publicId) {
                    const resourceType = file.mimetype.startsWith('image/') ? 'image' : 'raw';
                    deletionPromises.push(
                        cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
                    );
                }
            });
        }
    }
    if (deletionPromises.length > 0) {
        await Promise.allSettled(deletionPromises);
    }
};



// export const deleteUploadedImage = async (oldImageUrl) => {
//     const isLocalFile = oldImageUrl.includes("localhost");

//     if (isLocalFile) {
//         try {
//             const urlParts = new URL(oldImageUrl);
//             const filePath = path.join(process.cwd(), urlParts.pathname);
//             await unlink(filePath);
//         } catch (err) {
//             console.error(`Failed to delete old image at ${oldImageUrl}. It might not exist. Error:`, err.message);
//         }
//     }
// }

export const deleteUploadedImage = async (oldImageUrl) => {
    return deleteFileByUrl(oldImageUrl);
};

// export const deleteFileByUrl = async (fileUrl) => {
//     if (!fileUrl) return;

//     try {
//         const urlParts = new URL(fileUrl);
//         const relativePath = urlParts.pathname.startsWith('/') ? urlParts.pathname.substring(1) : urlParts.pathname;
//         const filePath = path.join(process.cwd(), relativePath);

//         await unlink(filePath);
//     } catch (err) {
//         console.error(`Failed to delete file at ${fileUrl}. It might not exist. Error:`, err.message);
//     }
// };

export const deleteFileByUrl = async (fileUrl) => {
    if (!fileUrl || !fileUrl.includes('cloudinary')) {
        return;
    }

    const publicId = getPublicIdFromUrl(fileUrl);
    if (!publicId) {
        console.error(`Could not extract public_id from URL: ${fileUrl}`);
        return;
    }

    try {
        const resourceType = fileUrl.includes('/raw/upload/') ? 'raw' : 'image';
        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (error) {
        console.error(`Failed to delete from Cloudinary: ${publicId}`, error);
    }
};

export default deleteUploadedFiles;