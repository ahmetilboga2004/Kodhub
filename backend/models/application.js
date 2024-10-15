import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Application = sequelize.define("Application", {
	status: {
		type: DataTypes.ENUM("pending", "accepted", "rejected", "cancelled"),
		defaultValue: "pending",
	},
	message: {
		type: DataTypes.TEXT,
		allowNull: true,
	},
	position: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

export default Application;
