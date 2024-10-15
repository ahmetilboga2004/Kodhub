import e from "express";
const router = e.Router();
import {
	deleteProject,
	getAllProjects,
	getProject,
	getProjectPositions,
	newProject,
	updateProject,
	updateProjectStatus,
} from "../controllers/project.js";
import { getAllApplications } from "../controllers/applications.js";
import { requireAuth } from "../middlewares/authentication.js";
import checkOwnership from "../middlewares/checkOwnership.js";
import Project from "../models/project.js";
import { checkedOwnerchip } from "../controllers/checkOwnership.js";

router.get("/", getAllProjects);
router.get("/:id", getProject);
router.get("/:id/positions/", getProjectPositions);
router.get("/:id/applications", getAllApplications);
router.get("/:id/check-ownership", checkOwnership(Project), checkedOwnerchip);
router.post("/", requireAuth, newProject);
router.put("/:id", requireAuth, updateProject);
router.put("/status/:id", requireAuth, updateProjectStatus);
router.delete("/:id", requireAuth, deleteProject);

export default router;
