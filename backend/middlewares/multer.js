import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    filename: (req,file,cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
    destination: (req,file,cb) => {
        let uploadPath;
        if (file.fieldname === "profileImage") {
            uploadPath = path.join(__dirname, "../uploads/images");
        } else {
            uploadPath = path.join(__dirname, "../uploads/docs");
        }
        
        cb(null, uploadPath);
    }
});

const limits = {
    fileSize: 1024*1024*5
}

const fileFilter = (req, file, cb) => {
    const isImage = file.mimetype.startsWith("image/");
    const isPDF = file.mimetype === "application/pdf";

    if (file.fieldname === "profileImage"){
        if (isImage){
            cb(null,true);
        }
        else{
            cb(new Error("Profile image must be an image file."), false);
        }
    }
    else {
        if (isImage || isPDF) {
            cb(null, true);
        } else {
            cb(new Error(`${file.fieldname} must be an image or a PDF.`), false);
        }
    }
}

const upload = multer({storage, limits, fileFilter});

export const imageUploader = upload.single("profileImage");

const fileUploader = upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'barCouncilCertificate', maxCount: 1 },
    { name: 'practiceCertificate', maxCount: 1 },
    { name: 'governmentId', maxCount: 1 },
    { name: 'lawDegree', maxCount: 1 },
    { name: 'fullName', maxCount: 1 },
    { name: 'specialization', maxCount: 1 },
    { name: 'bio', maxCount: 1 },
    { name: 'qualifications', maxCount: 1 },
    { name: 'phone', maxCount: 1 },
    { name: 'city', maxCount: 1 },
    { name: 'state', maxCount: 1 },
    { name: 'pincode', maxCount: 1 },
    { name: 'accountHolderName', maxCount: 1 },
    { name: 'bankName', maxCount: 1 },
    { name: 'accountNumber', maxCount: 1 },
    { name: 'ifscCode', maxCount: 1 },
    { name: 'fees', maxCount: 1 },
]);

const fileUploaderMiddleware = (req, res, next) => {
    fileUploader(req, res, (err) => {
        if (err) {
            let fieldname = err.message.split(" ")[0];
            if (err.hasOwnProperty('field')) fieldname = err.field;
            return res.status(400).json({ success: false, message: "File upload failed", errors: {[fieldname]: err.message }});
        }
        next();
    });
};

export default fileUploaderMiddleware;