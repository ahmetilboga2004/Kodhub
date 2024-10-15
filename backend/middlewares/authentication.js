import tokenService from "../services/tokenService.js";
import ApiError from "../utils/apiError.js";
import sendResponse from "../utils/sendResponse.js";

export const authentication = (req, res, next) => {
	try {
		const authHeader =
			req.headers.authorization || req.headers["authorization"];

		if (!authHeader) {
			return handleRefreshToken(req, res, next);
		}

		const accessToken = authHeader.split(" ")[1];

		if (!accessToken) {
			return handleRefreshToken(req, res, next);
		}

		const decodedAccessToken = tokenService.verifyAccessToken(
			accessToken,
			req.ip,
			req.ua
		);
		if (!decodedAccessToken) {
			return handleRefreshToken(req, res, next);
		}

		req.user = decodedAccessToken.userData;
		next();
	} catch (error) {
		next(error);
	}
};

const handleRefreshToken = async (req, res, next) => {
	try {
		const token = req.cookies?.refreshToken;

		if (token) {
			const decodedRefreshToken = await tokenService.verifyRefreshToken(
				token,
				req.ip,
				req.ua
			);

			if (decodedRefreshToken) {
				const newAccessToken = tokenService.generateAccessToken(
					decodedRefreshToken.userData,
					req.ip,
					req.ua
				);

				if (newAccessToken) {
					res.setHeader("x-new-token", newAccessToken);
					req.user = decodedRefreshToken.userData;
				}
			}
		}
		next();
	} catch (error) {
		next(error);
	}
};

export const requireAuth = (req, res, next) => {
	try {
		if (!req.user) return sendResponse(res, 401, "Oturum açmanız gerekli");
		next();
	} catch (error) {
		next(error);
	}
};

export const questOnly = (req, res, next) => {
	try {
		if (req.user) {
			if (res.getHeader("x-new-token")) {
				res.removeHeader("x-new-token");
			}
			return sendResponse(res, 409, "Zaten oturum açık");
		}
		next();
	} catch (error) {
		next(error);
	}
};

export const authRole = (...roles) => {
	return (req, res, next) => {
		if (req.user && roles.includes(req.user.role)) {
			return next();
		} else {
			return sendResponse(res, 403, "Yetkisiz Eylem");
		}
	};
};
