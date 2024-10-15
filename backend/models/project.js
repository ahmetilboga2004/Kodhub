import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

// User modelimizi tanımlıyoruz
const Project = sequelize.define("Project", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    desc: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM(
            "open",
            "partial filled",
            "filled",
            "in progress",
            "complated",
            "suspended"
        ),
        defaultValue: "open",
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});

export default Project;
