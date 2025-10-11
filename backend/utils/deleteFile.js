import fs from 'fs';
import { unlink } from 'fs/promises';
import path from 'path';

const deleteUploadedFiles = (files) => {
    if (!files) return;

    for (const fieldName in files) {
        if (Object.prototype.hasOwnProperty.call(files, fieldName)) {
            const uploadedFilesArray = files[fieldName];

            uploadedFilesArray.forEach(file => {
                fs.unlink(file.path, (err) => {
                    if (err) {
                        console.error(`Error deleting file: ${file.path}`, err);
                    } else {
                        console.log(`Successfully deleted file: ${file.path}`);
                    }
                });
            });
        }
    }
};

export const deleteUploadedImage = async (oldImageUrl) => {
    const isLocalFile = oldImageUrl.includes("localhost");

    if (isLocalFile) {
        try {
            const urlParts = new URL(oldImageUrl);
            const filePath = path.join(process.cwd(), urlParts.pathname);
            await unlink(filePath);
        } catch (err) {
            console.error(`Failed to delete old image at ${oldImageUrl}. It might not exist. Error:`, err.message);
        }
    }
}

export const deleteFileByUrl = async (fileUrl) => {
    if (!fileUrl) return;

    try {
        const urlParts = new URL(fileUrl);
        const relativePath = urlParts.pathname.startsWith('/') ? urlParts.pathname.substring(1) : urlParts.pathname;
        const filePath = path.join(process.cwd(), relativePath);

        await unlink(filePath);
        console.log(`Successfully deleted file: ${filePath}`);
    } catch (err) {
        console.error(`Failed to delete file at ${fileUrl}. It might not exist. Error:`, err.message);
    }
};

export default deleteUploadedFiles;