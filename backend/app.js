import e from "express";
import cors from "cors";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import morgan from "morgan";
import dotenv from "dotenv";
import parser from "ua-parser-js";
import cookieParser from "cookie-parser";
import logger from "./config/winston.js";
import { connectDb } from "./config/database.js";
import "./models/relationships.js";
import { authentication } from "./middlewares/authentication.js";
import routes from "./routes/index.js";
import limiter from "./middlewares/limiter.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = e();
dotenv.config();

const corsOptions = {
	origin: "http://localhost:5173",
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: true,
	exposedHeaders: ["x-new-token"],
};

app.use(cors(corsOptions));

app.disable("x-powered-by");
app.use(e.json());
app.use(e.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(limiter);
app.use(morgan("dev"));
app.use((req, res, next) => {
	const ua = parser.UAParser(req.headers["user-agent"]);
	req.ua = ua;
	next();
});

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Web API Dokümantasyonu",
			version: "1.0.0",
			description:
				"Express.js, Sequelize, PostgreSQL ve Redis ile oluşturulmuş Web API",
		},
		servers: [
			{
				url: "http://localhost:4000/api",
				description: "Geliştirme sunucusu",
			},
		],
	},
	apis: ["./routes/*.js"],
};

const specs = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(authentication);
app.use("/api", routes);
app.use(errorHandler);

const port = process.env.PORT || 4000;
async function startServer() {
	try {
		await connectDb();
		app.listen(port, () => {
			logger.info(`Sunucu http://localhost:${port} adresinde başlatıldı`);
		});
	} catch (error) {
		logger.error(`Hata oluştu: ${error}`);
		process.exit(1);
	}
}

startServer();
