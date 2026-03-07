import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({ error: "Missing or invalid Authorization header" });
		}

		const token = authHeader.split(" ")[1];

		const payload = jwt.verify(token, process.env.JWT_SECRET);

		req.user = {
			userId: payload.userId,
			googleId: payload.googleId
		};

		next();
	} catch (err) {
		return res.status(401).json({ error: "Invalid or expired token" });
	}
}