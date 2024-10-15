import sendResponse from "../utils/sendResponse.js";
import User from "../models/user.js";
import Project from "../models/project.js";
import Position from "../models/position.js";

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
		const user = await User.findOne({
			where: {
				username,
			},
			attributes: [
				"id",
				"username",
				"firstName",
				"lastName",
				"title",
				"createdAt",
			],
			include: {
				model: Project,
				include: Position,
			},
		});
		if (!user) {
			return sendResponse(res, 404, "Kullanıcı bulunamadı");
		}
		sendResponse(
			res,
			200,
			"Proje bilgileri başarılı bir şekilde alındı",
			user
		);
	} catch (error) {
		next(error);
	}
};

export const getJoinedProjects = async (req, res, next) => {
	try {
		const username = req.params.username;

		const user = await User.findOne({
			where: {
				username,
			},
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

		const projects = await Project.findAll({
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
		});

		const joinedProjects = {
			id: user.id,
			username: user.username,
			firstName: user.firstName,
			lastName: user.lastName,
			title: user.title,
			createdAt: user.createdAt,
			projects,
		};

		sendResponse(
			res,
			200,
			"Kullanıcının katıldığı proje bilgilleri alındı",
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
