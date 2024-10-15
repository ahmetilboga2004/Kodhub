import e from "express";
import {
	deletePosition,
	getPosition,
	newPosition,
	updatePosition,
} from "../controllers/position.js";
import { requireAuth } from "../middlewares/authentication.js";
const router = e.Router();

router.use(requireAuth);
router.get("/:id", getPosition);
router.post("/id", newPosition);
router.put("/id", updatePosition);
router.delete("/id", deletePosition);

export default router;
