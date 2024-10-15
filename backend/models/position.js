import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Position = sequelize.define("Position", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    desc: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM("open", "filled"),
        defaultValue: "open",
    },
});

export default Position;
