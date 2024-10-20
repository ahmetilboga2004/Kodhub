// backend/routes/events.js
import { Router } from "express";
const router = Router();

const userEventSenders = new Map();

router.get("/", (req, res) => {
	res.writeHead(200, {
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache",
		Connection: "keep-alive",
		"access-control-allow-origin": "*",
	});

	const sendEvent = (data) => {
		res.write(`data: ${JSON.stringify(data)}\n\n`);
	};

	const userId = req.query.userId;
	userEventSenders.set(userId, sendEvent);

	req.on("close", () => {
		userEventSenders.delete(userId);
	});
});

export { userEventSenders };
export default router;
