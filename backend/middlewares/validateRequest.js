import { validationResult } from "express-validator";
import sendResponse from "../utils/sendResponse.js";

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = {};
        errors.array().forEach((error) => {
            formattedErrors[error.path] = error.msg;
        });
        return sendResponse(
            res,
            400,
            "Doğrulama Hatası",
            null,
            formattedErrors
        );
    }
    next();
};

export default validateRequest;