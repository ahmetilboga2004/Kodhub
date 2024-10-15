import sendResponse from "../utils/sendResponse.js";
/**
 * @param {typeof import('sequelize').Model} model
 * @param {string} [ownerIdField='ownerId']
 * @returns {import('express').RequestHandler}
 */
const checkOwnership = (model, ownerIdField = "UserId") => {
	return async (req, res, next) => {
		try {
			const resource = await model.findOne({
				where: {
					id: req.params.id,
					[ownerIdField]: req.user.id,
				},
			});
			if (!resource) {
				return sendResponse(
					res,
					403,
					"Bu işlemi yapabilmek için yetkiniz yok",
					false
				);
			}
			next();
		} catch (error) {
			next(error);
		}
	};
};

export default checkOwnership;
