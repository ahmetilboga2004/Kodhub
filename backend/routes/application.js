import e from "express";
import {
	createApplication,
	updateStatus,
} from "../controllers/applications.js";
import { requireAuth } from "../middlewares/authentication.js";
const router = e.Router();

router.use(requireAuth);
router.post("/", createApplication);
router.put("/:id", updateStatus);

export default router;
