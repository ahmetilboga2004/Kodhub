import sendResponse from "../utils/sendResponse.js";

export const checkedOwnerchip = (req, res, next) => {
	sendResponse(res, 200, "Bu işlem için yetkiniz var", true);
};
