import { Router } from "express";
const router = Router();

import * as auth from "../controllers/auth.js";
import { requireAuth, questOnly } from "../middlewares/authentication.js";
import { body, param } from "express-validator";
import validateRequest from "../middlewares/validateRequest.js";

router.post(
	"/register",
	questOnly,
	body("firstName")
		.notEmpty()
		.withMessage("İsim alanı boş olamaz.")
		.isAlpha("tr-TR")
		.withMessage("İsim yalnızca harflerden oluşmalı.")
		.isLength({ min: 2, max: 50 })
		.withMessage("İsim 2 ile 50 karakter arasında olmalı."),
	body("lastName")
		.notEmpty()
		.withMessage("Soyisim alanı boş olamaz.")
		.isAlpha("tr-TR")
		.withMessage("Soyisim yalnızca harflerden oluşmalı.")
		.isLength({ min: 2, max: 50 })
		.withMessage("Soyisim 2 ile 50 karakter arasında olmalı."),
	body("username")
		.notEmpty()
		.withMessage("Kullanıcı adı boş olamaz.")
		.isAlphanumeric("tr-TR")
		.withMessage("Kullanıcı adı yalnızca harf ve rakamlardan oluşmalı.")
		.isLength({ min: 6, max: 30 })
		.withMessage("Kullanıcı adı 6 ile 30 karakter arasında olmalı."),
	body("password")
		.notEmpty()
		.withMessage("Şifre alanı boş olamaz.")
		.isAlphanumeric()
		.withMessage("Şifre yalnızca harf ve rakamlardan oluşmalı.")
		.isLength({ min: 6, max: 30 })
		.withMessage("Şifre 6 ile 30 karakter arasında olmalı."),
	validateRequest,
	auth.register
);

router.post(
	"/login",
	questOnly,
	body("username")
		.notEmpty()
		.withMessage("Lütfen kullanıcı adınızı girin.")
		.isAlphanumeric("tr-TR")
		.withMessage("Lütfen geçerli bir kullanıcı adı girin.")
		.isLength({ min: 6, max: 30 })
		.withMessage("Lütfen geçerli bir kullanıcı adı girin."),
	body("password")
		.notEmpty()
		.withMessage("Lütfen şifrenizi girin.")
		.isAlphanumeric()
		.withMessage("Geçersiz bir şifre girdiniz.")
		.isLength({ min: 6, max: 30 })
		.withMessage("Geçersiz bir şifre girdiniz"),
	validateRequest,
	auth.login
);

router.get("/logout", requireAuth, auth.logout);

router.get(
	"/close-sessions/:id",
	requireAuth,
	param("id")
		.notEmpty()
		.withMessage("Geçersiz bir id girdiniz.")
		.isNumeric()
		.withMessage("Geçersiz bir id girdiniz."),
	auth.closeSession
);

router.get("/close-sessions", requireAuth, auth.closeAllSession);

export default router;
