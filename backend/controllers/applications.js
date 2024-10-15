import Application from "../models/application.js";
import sendResponse from "../utils/sendResponse.js";
import Project from "../models/project.js";
import Position from "../models/position.js";
import User from "../models/user.js";
import sequelize from "../config/database.js";

export const getAllApplications = async (req, res, next) => {
	try {
		const id = req.params.id;
		const project = await Project.findOne({
			where: {
				id,
				UserId: req.user.id,
			},
			include: [
				{
					model: Position,
					include: {
						model: Application,
						include: {
							model: User,
							attributes: ["id", "firstName", "lastName"],
						},
					},
				},
			],
		});

		if (!project) {
			return sendResponse(
				res,
				404,
				"Başvuru bilgilerini almak istediğiniz proje bulunamadı"
			);
		}

		const positions = project.Positions;
		const totalApplyCount = positions.reduce(
			(total, position) => total + position.Applications.length,
			0
		);

		const applyes = {
			projectId: project.id,
			projectTitle: project.title,
			positions: positions.map((position) => ({
				id: position.id,
				title: position.title,
				desc: position.desc,
				status: position.status,
				Applications: position.Applications,
			})),
			totalApplyCount,
		};

		sendResponse(res, 200, "Başvuru bilgileri alındı", applyes);
	} catch (error) {
		next(error);
	}
};

export const createApplication = async (req, res, next) => {
	try {
		const { message, positionId, projectId } = req.body;
		const existPosition = await Position.findOne({
			where: {
				id: positionId,
				ProjectId: projectId,
			},
			include: {
				model: Project,
				attributes: ["UserId"],
			},
		});
		if (!existPosition) {
			return sendResponse(
				res,
				400,
				"Başvurmak istediğiniz pozisyon bulunamadı"
			);
		}
		const projectOwnerId = existPosition.Project.UserId;
		if (projectOwnerId === req.user.id) {
			return sendResponse(
				res,
				400,
				"Kendi Projenizdeki bir pozisyona başvuru yapamazsınız"
			);
		}
		if (existPosition.status === "filled") {
			return sendResponse(
				res,
				400,
				"Başvurmak istediğiniz pozisyon dolu"
			);
		}
		// Kullanıcının daha önce başvuru yapıp yapmadığını kontrol et
		const existingApplication = await Application.findOne({
			where: {
				PositionId: existPosition.id,
				UserId: req.user.id,
			},
		});

		if (existingApplication) {
			return sendResponse(res, 400, "Bu pozisyona zaten başvurmuşsunuz");
		}
		const application = await Application.create({
			message,
			position: existPosition.title,
			PositionId: existPosition.id,
			UserId: req.user.id,
		});
		if (!application) {
			return sendResponse(res, 400, "Başvuru yapılamadı");
		}
		sendResponse(res, 201, "Başvurunuz alındı");
	} catch (error) {
		next(error);
	}
};
export const updateStatus = async (req, res, next) => {
	const t = await sequelize.transaction();
	try {
		const id = req.params.id;
		const status = req.body.status;

		if (!["accepted", "rejected"].includes(status)) {
			return sendResponse(
				res,
				400,
				"Geçersiz bir başvuru durumu girdiniz"
			);
		}

		const application = await Application.findOne({
			where: { id },
			include: {
				model: Position,
				include: {
					model: Project,
					attributes: ["UserId", "id"],
					include: {
						model: Position, // Projedeki diğer pozisyonları al
						attributes: ["status"],
					},
				},
			},
			transaction: t,
		});

		if (!application) {
			return sendResponse(res, 404, "Böyle bir başvuru yok");
		}

		const ownerId = application.Position.Project.UserId;
		if (ownerId !== req.user.id) {
			return sendResponse(
				res,
				403,
				"Başvurulan pozisyonun projesi size ait değil"
			);
		}

		if (application.status !== "pending") {
			return sendResponse(
				res,
				400,
				"Bu başvuruya daha önceden yanıt verilmiş"
			);
		}

		application.status = status;
		await application.save();

		if (status === "accepted") {
			const [updatedPositionCount] = await Position.update(
				{ status: "filled", UserId: application.UserId },
				{ where: { id: application.PositionId }, transaction: t }
			);

			if (updatedPositionCount === 0) {
				return sendResponse(
					res,
					400,
					"Pozisyon güncellenirken bir hata oluştu"
				);
			}

			// Diğer tüm "pending" başvuruları "iptal edildi" olarak güncelle
			await Application.update(
				{ status: "cancelled" },
				{
					where: {
						PositionId: application.PositionId,
						status: "pending",
					},
					transaction: t,
				}
			);

			// Projedeki pozisyonların durumu kontrol et
			const project = application.Position.Project;
			const filledPositions = project.Positions.filter(
				(pos) => pos.status === "filled"
			).length;

			if (
				filledPositions > 0 &&
				filledPositions < project.Positions.length
			) {
				// Eğer bazı pozisyonlar dolu, bazıları boşsa projeyi "partial filled" yap
				await Project.update(
					{ status: "partial filled" },
					{ where: { id: project.id }, transaction: t }
				);
			} else if (filledPositions === project.Positions.length) {
				// Eğer tüm pozisyonlar dolmuşsa projeyi "fully filled" yap
				await Project.update(
					{ status: "filled" },
					{ where: { id: project.id }, transaction: t }
				);
			}
		}

		await t.commit();
		sendResponse(res, 200, "Başvuru güncellendi");
	} catch (error) {
		await t.rollback();
		next(error);
	}
};
