import {
    ValidationError,
    UniqueConstraintError,
    ForeignKeyConstraintError,
    DatabaseError,
} from "sequelize";
import logger from "../config/winston.js"; // logger'ın bulunduğu dosya yolunu doğru şekilde ayarlayın
import sendResponse from "../utils/sendResponse.js"; // sendResponse fonksiyonunun bulunduğu dosya yolunu doğru şekilde ayarlayın

const errorHandler = (err, req, res, next) => {
    logger.error(err);

    if (err instanceof ValidationError) {
        const validationErrors = err.errors.map((error) => ({
            field: error.path,
            message: error.message,
        }));
        return sendResponse(res, 400, "Doğrulama Hatası", null, {
            validationErrors,
        });
    } else if (err instanceof UniqueConstraintError) {
        return sendResponse(
            res,
            409,
            "Bu bilgilerle zaten bir kayıt mevcut. Lütfen başka bilgiler deneyin."
        );
    } else if (err instanceof ForeignKeyConstraintError) {
        return sendResponse(
            res,
            400,
            "İlişkili veri bulunamadı. Lütfen girdiğiniz bilgileri kontrol edin."
        );
    } else if (err instanceof DatabaseError) {
        return sendResponse(
            res,
            500,
            "İşleminiz şu anda gerçekleştirilemiyor. Lütfen daha sonra tekrar deneyin."
        );
    }

    const statusCode = err.statusCode || 500;
    const message = "Sunucu Hatası";
    sendResponse(
        res,
        statusCode,
        message,
        null,
        process.env.NODE_ENV === "development" ? { stack: err.stack } : null
    );
};

export default errorHandler;
