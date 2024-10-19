import Project from "../models/project.js";
import { Op } from "sequelize";
import sendResponse from "../utils/sendResponse.js";
import sequelize from "../config/database.js";
import Position from "../models/position.js";
import User from "../models/user.js";
import Application from "../models/application.js";
import buildWhereClause from "../utils/buildWhereClause.js";

export const getAllProjects = async (req, res, next) => {
	try {
		const { status, search, page = 1, limit = 3 } = req.query;
		console.log("status: ", status);
		console.log("search: ", search);

		let whereClause = buildWhereClause(status, search);

		if (req.user) {
			const userId = req.user.id;
			whereClause = {
				...whereClause,
				UserId: { [Op.ne]: userId },
			};
		}

		console.log("whereClause: ", whereClause);

		// Önce toplam proje sayısını al
		const totalCount = await Project.count({ where: whereClause });

		const offset = (page - 1) * limit;
		const effectiveLimit = Math.min(parseInt(limit), totalCount - offset);

		const { rows: projects } = await Project.findAndCountAll({
			where: whereClause,
			order: [["createdAt", "DESC"]],
			limit: effectiveLimit,
			offset: parseInt(offset),
			include: [
				{
					model: User,
					attributes: ["id", "firstName", "lastName", "username"],
				},
				{
					model: Position,
					attributes: ["id", "title", "status"],
				},
			],
		});

		const totalPages = Math.max(1, Math.ceil(totalCount / limit));

		console.log("total pages: ", totalPages);
		console.log("limit: ", limit);
		console.log("effective limit: ", effectiveLimit);
		console.log("count: ", totalCount);
		console.log("offset: ", offset);
		console.log("projects length: ", projects.length);

		sendResponse(res, 200, "istek başarılı", {
			count: totalCount,
			totalPages,
			currentPage: parseInt(page),
			projects,
		});
	} catch (error) {
		next(error);
	}
};

export const getProject = async (req, res, next) => {
	try {
		const project = await Project.findOne({
			where: { id: req.params.id },
			include: [User, Position],
		});

		if (!project) {
			return sendResponse(res, 404, "Proje bulunamadı");
		}

		const totalApplications = await Application.count({
			where: {
				PositionId: project.Positions.map((position) => position.id),
			},
		});

		const projectData = project.get({ plain: true });

		sendResponse(res, 200, "Proje bulundu", {
			...projectData,
			totalApplications,
		});
	} catch (error) {
		next(error);
	}
};

export const getProjectPositions = async (req, res, next) => {
	try {
		const id = req.params.id;
		const positions = await Position.findAll({ where: { ProjectId: id } });
		sendResponse(res, 200, null, positions);
	} catch (error) {
		next(error);
	}
};

export const newProject = async (req, res, next) => {
	const t = await sequelize.transaction();
	try {
		const { title, desc, positions } = req.body;
		const newProject = await Project.create(
			{
				title,
				desc,
				UserId: req.user.id,
			},
			{ transaction: t }
		);
		if (!newProject) {
			return sendResponse(res, 400, "Yeni Proje oluşturulamadı");
		}
		if (!positions || positions.length === 0) {
			return sendResponse(res, 400, "Lütfen en az bir pozisyon ekleyin");
		}
		for (const pos of positions) {
			await Position.create(
				{
					title: pos.title,
					desc: pos.desc,
					ProjectId: newProject.id,
				},
				{ transaction: t }
			);
		}
		await t.commit();
		sendResponse(res, 201, "Yeni Proje başarılı bir şekilde oluşturuldu");
	} catch (error) {
		await t.rollback();
		next(error);
	}
};

export const updateProject = async (req, res, next) => {
	try {
		const projectId = req.params.id;
		const { title, desc, positions } = req.body;

		// Projeyi güncelle
		const [updatedCount] = await Project.update(
			{ title, desc },
			{ where: { id: projectId } }
		);

		if (updatedCount === 0) {
			return sendResponse(
				res,
				404,
				"Güncellemek istediğiniz proje bulunamadı"
			);
		}

		// Mevcut pozisyonları veritabanından al
		const existingPositions = await Position.findAll({
			where: { ProjectId: projectId },
		});

		// Veritabanında olan pozisyonların id'lerini alıyoruz
		const existingPositionIds = existingPositions.map((pos) => pos.id);

		// Gönderilen pozisyonlardan id'leri olanları ayırıyoruz
		const sentPositionIds = positions.filter((p) => p.id).map((p) => p.id);

		// Veritabanındaki ve gönderilenler arasında olmayanları sil
		const positionIdsToDelete = existingPositionIds.filter(
			(id) => !sentPositionIds.includes(id)
		);
		if (positionIdsToDelete.length > 0) {
			await Position.destroy({
				where: {
					ProjectId: projectId,
					id: positionIdsToDelete,
				},
			});
		}

		const updatedPositions = [];

		// Gönderilen pozisyonları işle (güncelleme veya ekleme)
		for (const position of positions) {
			if (position.id && existingPositionIds.includes(position.id)) {
				// Mevcut pozisyonu güncelle
				await Position.update(
					{ title: position.title, desc: position.desc },
					{
						where: {
							id: position.id,
							ProjectId: projectId,
							status: "open",
						},
					}
				);
				updatedPositions.push(position);
			} else {
				// Yeni pozisyon ekle
				const newPosition = await Position.create({
					title: position.title,
					desc: position.desc,
					ProjectId: projectId,
				});
				updatedPositions.push(newPosition.toJSON());
			}
		}

		sendResponse(res, 200, "Proje ve pozisyonlar başarıyla güncellendi", {
			updatedPositions,
		});
	} catch (error) {
		next(error);
	}
};

export const updateProjectStatus = async (req, res, next) => {
	try {
		const id = req.params.id;
		const status = req.body.status;
		const autoStatuses = ["open", "partial filled", "filled"];
		const manualStatuses = ["in progress", "complated", "suspended"];
		if (autoStatuses.includes(status) || !manualStatuses.includes(status)) {
			return sendResponse(res, 400, "Geçersiz bir durum girdiniz");
		}
		const project = await Project.findByPk(id);
		if (!project) {
			return sendResponse(res, 400, "Proje durumu güncellenemedi");
		}
		if (project.status === "complated") {
			return sendResponse(res, 400, "Bu proje zaten tamamlanmış");
		}
		project.status = status;
		if (status === "complated") {
			project.endDate = new Date();
		}
		await project.save();
		sendResponse(res, 200, "Proje durumu güncellendi");
	} catch (error) {
		next(error);
	}
};

export const deleteProject = async (req, res, next) => {
	try {
		const id = req.params.id;
		const project = await Project.findByPk(id);
		if (!project) {
			return sendResponse(
				res,
				404,
				"Silmek istediğiniz proje bulunamadı"
			);
		}
		await project.destroy();
		sendResponse(res, 200, "Proje silindi");
	} catch (error) {
		next(error);
	}
};
