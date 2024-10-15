import { Router } from "express";
const router = Router();
import authRouter from "./auth.js";
import userRouter from "./user.js";
import projectRouter from "./project.js";
import positionRouter from "./position.js";
import applicationRouter from "./application.js";

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/projects", projectRouter);
router.use("/positions", positionRouter);
router.use("/applications", applicationRouter);

export default router;
