import sendResponse from "../utils/sendResponse.js";
import User from "../models/user.js";
import Project from "../models/project.js";
import Position from "../models/position.js";
import { Op } from "sequelize";
import buildWhereClause from "../utils/buildWhereClause.js";

export const myProfile = (req, res, next) => {
	// Burda profil bilgileri alınacak
	return res.status(200).json({
		message: "Profil bilgileriniz başarılı bir şekilde alındı",
	});
};
export const getUserProfile = async (req, res, next) => {
	try {
		const username = req.params.username;
		console.log("\n\nUSERNAME: ", username);

		// Kullanıcıyı bul
		const user = await User.findOne({
			where: { username },
			attributes: [
				"id",
				"firstName",
				"lastName",
				"username",
				"biography",
				"title",
			],
			include: [
				{
					model: Project,
					limit: 3,
				},
			],
		});

		if (!user) {
			return sendResponse(res, 404, "Kullanıcı bulunamadı");
		}

		// Kullanıcının katıldığı projeleri çek
		const joinedProjects = await Project.findAll({
			include: [
				{
					model: User,
					attributes: ["id", "username", "firstName", "lastName"],
				},
				{
					model: Position,
					where: {
						status: "filled",
						UserId: user.id,
					},
				},
			],
			limit: 3,
		});

		const response = {
			id: user.id,
			username: user.username,
			firstName: user.firstName,
			lastName: user.lastName,
			biography: user.biography,
			title: user.title,
			projects: user.Projects,
			joinedProjects,
		};
		sendResponse(
			res,
			200,
			"Kullanıcı bilgileri ve projeleri alındı",
			response
		);
	} catch (error) {
		next(error);
	}
};

export const getUserProjects = async (req, res, next) => {
	try {
		const username = req.params.username;
		const { status, search, page = 1, limit = 3 } = req.query;

		let whereClause = buildWhereClause(status, search);

		const user = await User.findOne({
			where: { username },
			attributes: [
				"id",
				"username",
				"firstName",
				"lastName",
				"createdAt",
				"title",
			],
		});

		if (!user) {
			return sendResponse(res, 404, "Kullanıcı bulunamadı");
		}

		whereClause = {
			...whereClause,
			UserId: user.id,
		};

		// Önce toplam proje sayısını al
		const totalCount = await Project.count({ where: whereClause });

		const offset = (page - 1) * limit;
		const effectiveLimit = Math.min(parseInt(limit), totalCount - offset);

		const projects = await Project.findAll({
			where: whereClause,
			order: [["createdAt", "DESC"]],
			limit: effectiveLimit,
			offset: parseInt(offset),
			include: {
				model: Position,
			},
		});

		const totalPages = Math.max(1, Math.ceil(totalCount / limit));

		sendResponse(res, 200, "Proje bilgileri başarılı bir şekilde alındı", {
			count: totalCount,
			totalPages,
			currentPage: parseInt(page),
			projects,
			user,
		});
	} catch (error) {
		next(error);
	}
};
export const getJoinedProjects = async (req, res, next) => {
	try {
		const username = req.params.username;
		const { search, status, page = 1, limit = 3 } = req.query;
		let whereClause = buildWhereClause(status, search);

		const user = await User.findOne({
			where: { username },
			attributes: [
				"id",
				"username",
				"firstName",
				"lastName",
				"title",
				"createdAt",
			],
		});

		if (!user) {
			return sendResponse(res, 404, "Kullanıcı bulunamadı");
		}

		const positionWhereClause = {
			status: "filled",
			UserId: user.id,
		};

		// Önce toplam proje sayısını al
		const totalCount = await Project.count({
			where: whereClause,
			include: [
				{
					model: Position,
					where: positionWhereClause,
				},
			],
		});

		const offset = (page - 1) * limit;
		const effectiveLimit = Math.min(parseInt(limit), totalCount - offset);

		const projects = await Project.findAll({
			where: whereClause,
			include: [
				{
					model: User,
					attributes: ["id", "username", "firstName", "lastName"],
				},
				{
					model: Position,
					where: positionWhereClause,
				},
			],
			limit: effectiveLimit,
			offset: parseInt(offset),
			order: [["createdAt", "DESC"]],
		});

		const totalPages = Math.max(1, Math.ceil(totalCount / limit));

		const joinedProjects = {
			id: user.id,
			username: user.username,
			firstName: user.firstName,
			lastName: user.lastName,
			title: user.title,
			createdAt: user.createdAt,
			count: totalCount,
			totalPages,
			currentPage: parseInt(page),
			projects,
		};

		sendResponse(
			res,
			200,
			"Kullanıcının katıldığı proje bilgileri alındı",
			joinedProjects
		);
	} catch (error) {
		next(error);
	}
};
export const updateProfile = (req, res, next) => {
	// Burda profil güncelleme işlemleri yapılacak
	return res.status(200).json({
		message: "Profil bilgileriniz başarılı bir şekilde güncellendi",
	});
};
