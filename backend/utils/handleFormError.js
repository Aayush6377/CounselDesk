import { validationResult } from "express-validator";
import deleteUploadedFiles, { deleteUploadedImage } from "./deleteFile.js";
// import { unlink } from 'fs/promises';

const handleFormError = async (req,res,next) => {
    const result = validationResult(req);

    if (!result.isEmpty()){
        const errors = Object.fromEntries(
            Object.entries(result.mapped()).map(([key,value]) => [key, value.msg])
        );

        if (req.file) {
            try {
                // await unlink(req.file.path);
                await deleteUploadedImage(req.file.path);
            } catch (err) {
                console.error(`Error cleaning up file ${req.file.path}:`, err);
            }
        }
        
        return res.status(400).json({success: false, message: "Form validation error", errors});
    }
    next();
}

export const validationAndCleanup = async (req, res, next) => {
    const bodyValidationErrors = validationResult(req);
    const hasBodyErrors = !bodyValidationErrors.isEmpty();

    const uploadedFiles = req.files;
    const requiredFields = ['barCouncilCertificate', 'governmentId', 'lawDegree'];
    const missingFileFields = requiredFields.filter(field => 
        !uploadedFiles || !uploadedFiles[field] || uploadedFiles[field].length === 0
    );

    const hasFileErrors = missingFileFields.length > 0;

    if (hasBodyErrors || hasFileErrors) {
        if (uploadedFiles) {
            await deleteUploadedFiles(uploadedFiles);
        }

        let errors = {};
        
        if (hasBodyErrors) {
            errors = {
                ...errors,
                ...Object.fromEntries(
                    Object.entries(bodyValidationErrors.mapped()).map(([key, value]) => [key, value.msg])
                )
            };
        }

        if (hasFileErrors) {
            for (const field of missingFileFields) {
                errors[field] = `The ${field} document is required.`;
            }
        }

        if (req.fileValidationError) {
             errors.files = req.fileValidationError;
        }

        return res.status(400).json({
            success: false,
            message: "Validation failed. Please check the provided data.", 
            errors
        });
    }
    next();
};

export default handleFormError;