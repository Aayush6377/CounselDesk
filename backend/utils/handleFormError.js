import { validationResult } from "express-validator";

const handleFormError = (req,res,next) => {
    const result = validationResult(req);

    if (!result.isEmpty()){
        const errors = Object.fromEntries(
            Object.entries(result.mapped()).map(([key,value]) => [key, value.msg])
        );
        return res.status(400).json({message: "Signup failed", errors});
    }
    next();
}

export default handleFormError;