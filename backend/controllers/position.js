import Position from "../models/position.js";
import sendResponse from "../utils/sendResponse.js";
import { Op } from "sequelize";

export const getPosition = async (req, res, next) => {
    try {
        const id = req.params.id;
        const position = await Position.findByPk(id);
        if (!position) {
            return sendResponse(res, 404, "Aradığınız pozisyon bulunamadı");
        }
        sendResponse(res, 200, "Pozisyon bilgileri alındı", position);
    } catch (error) {
        next(error);
    }
};

export const newPosition = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { title, desc } = req.body;
        const position = await Position.create({ title, desc, ProjectId: id });
        if (!position) {
            return sendResponse(res, 400, "Pozisyon oluşturulamadı");
        }
        sendResponse(res, 200, "Pozisyon oluşturuldu");
    } catch (error) {
        next(error);
    }
};

export const updatePosition = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { title, desc } = req.body;
        const [updatedCount] = await Position.update(
            { title, desc },
            { where: { id } }
        );
        if (updatedCount === 0) {
            return sendResponse(
                res,
                404,
                "Güncellemek istediğiniz pozisyon bulunamadı"
            );
        }
        sendResponse(res, 200, "Pozisyon bilgileri güncellendi");
    } catch (error) {
        next(error);
    }
};

export const updatePositionStatus = async (req, res, next) => {
    try {
        const id = req.params.id;
        const status = req.body.status;
        const allowedStatuses = ["open", "filled"];
        if (!allowedStatuses.includes(status)) {
            return sendResponse(res, 400, "Geçersiz pozisyon durumu girdiniz");
        }
        const [updatedCount] = await Position.update(
            { status },
            { where: { id } }
        );
        if (updatedCount === 0) {
            return sendResponse(
                res,
                404,
                "Güncellemek istediğiniz pozisyon bulunamadı"
            );
        }
        sendResponse(res, 200, "Pozisyon durumu güncellendi");
    } catch (error) {
        next(error);
    }
};

export const deletePosition = async (req, res, next) => {
    try {
        const id = req.params.id;
        const position = await Position.findByPk(id);
        if (!position) {
            return sendResponse(
                res,
                404,
                "Silmek istediğiniz pozisyon bulunamadı"
            );
        }
        const projectId = position.ProjectId;
        const otherPositions = await Position.count({
            where: {
                ProjectId: projectId,
                id: { [Op.ne]: id },
            },
        });
        if (otherPositions === 0) {
            return sendResponse(
                res,
                400,
                "Bu projenin tek pozisyonu olduğu için silinemez!"
            );
        }
        await position.destroy();
        sendResponse(res, 200, "Pozisyon başarıyla silindi");
    } catch (error) {
        next(error);
    }
};
