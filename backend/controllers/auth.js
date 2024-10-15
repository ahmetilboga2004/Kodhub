import User from "../models/user.js";
import sendResponse from "../utils/sendResponse.js";
import bcrypt from "bcrypt";
import tokenService from "../services/tokenService.js";
import redisService from "../services/redisService.js";

export const register = async (req, res, next) => {
	try {
		const { firstName, lastName, username, password, role } = req.body;
		const userRole = role || "user";

		await User.create({
			firstName,
			lastName,
			username,
			password,
			role: userRole,
		});
		sendResponse(res, 201, "Kullanıcı kaydı başarılı");
	} catch (error) {
		next(error);
	}
};

export const login = async (req, res, next) => {
	try {
		const { username, password, role } = req.body;

		const userRole = role || "user";

		const user = await User.findOne({
			where: {
				username,
				role: userRole,
			},
		});

		if (!user || !(await bcrypt.compare(password, user.password))) {
			return sendResponse(res, 400, "Geçersiz Kullanıcı adı veya şifre");
		}

		const userData = {
			id: user.id,
			username: user.username,
			role: user.role,
		};

		const accessToken = tokenService.generateAccessToken(
			userData,
			req.ip,
			req.ua
		);
		const { refreshToken, jti } = tokenService.generateRefreshToken(
			userData,
			req.ip,
			req.ua
		);
		await redisService.setSession(user.id, jti, refreshToken);

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "development" ? false : true,
			sameSite: "Lax",
			maxAge: 30 * 24 * 60 * 60 * 1000,
			path: "/",
		});

		res.setHeader("x-new-token", accessToken);
		sendResponse(res, 200, "Giriş Başarılı", { user: userData });
	} catch (error) {
		next(error);
	}
};

export const logout = async (req, res, next) => {
	try {
		const cookies = req.cookies;
		const refreshToken = cookies.refreshToken;

		if (!refreshToken) {
			return sendResponse(res, 404, "Oturum bulunamadı");
		}
		// burda güvenlik amaçlı gelen refreshTokenin ip ve device bilgisini kontrol etmemiz lazım önceden.
		const decodedToken = await tokenService.verifyRefreshToken(
			refreshToken,
			req.ip,
			req.ua
		);
		if (!decodedToken) {
			return sendResponse(res, 400, "Geçersiz Token");
		}
		await redisService.delSession(
			decodedToken.userData.id,
			decodedToken.jti
		);

		res.clearCookie("refreshToken", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "development" ? false : true,
			sameSite: "Lax",
			path: "/", // Aynı path ayarını kullanmalısınız
		});

		if (res.getHeader("x-new-token")) {
			res.removeHeader("x-new-token");
		}
		sendResponse(res, 200, "Başarılı bir şekilde çıkış yapıldı");
	} catch (error) {
		next(error);
	}
};

export const closeSession = async (req, res, next) => {
	try {
		const sessionId = req.params.sessionId;
		const userId = req.user.id;
		await redisService.delSession(userId, sessionId);
		sendResponse(res, 200, "Başarılı bir şekilde çıkış yapıldı");
	} catch (error) {
		next(error);
	}
};

export const closeAllSession = async (req, res, next) => {
	try {
		const userId = req.user.id;
		await redisService.delAllSessions(userId);
		res.clearCookie("refreshToken", {
			httpOnly: true,
			sameSite: "Lax",
			secure: process.env.NODE_ENV === "development" ? false : true,
			path: "/", // Aynı path ayarını kullanmalısınız
		});
		sendResponse(res, 200, "Tüm cihazlardan çıkış yapıldı");
	} catch (error) {
		next(error);
	}
};
