import e from "express";
const router = e.Router();

import * as user from "../controllers/user.js";

router.get("/:username/profile", user.getUserProfile);
router.get("/:username/projects", user.getUserProjects);
router.get("/:username/joined-projects", user.getJoinedProjects);

export default router;
