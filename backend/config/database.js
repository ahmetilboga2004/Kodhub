import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import logger from "./winston.js";
dotenv.config();

const sequelize = new Sequelize(
    process.env["DB_NAME"],
    process.env["DB_USER"],
    process.env["DB_PASSWORD"],
    {
        host: process.env["DB_HOST"],
        dialect: "postgres",
    }
);

export async function connectDb() {
    await sequelize.sync({
        alter: process.env.NODE_ENV === "development",
        logging: false,
    });
    await sequelize.authenticate();
    logger.info("Veritabanı bağlantısı başarıyla kuruldu.");
}

export default sequelize;