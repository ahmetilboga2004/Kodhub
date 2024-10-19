import { Op } from "sequelize";
// Bu fonksiyon her üç controller'da da kullanılabilir
const buildWhereClause = (status, search) => {
	let whereClause = {};

	if (status && status !== "all") {
		whereClause.status = status;
	}

	if (search) {
		whereClause[Op.or] = [
			{ title: { [Op.like]: `%${search}%` } },
			{ desc: { [Op.like]: `%${search}%` } },
		];
	}

	return whereClause;
};

export default buildWhereClause;
