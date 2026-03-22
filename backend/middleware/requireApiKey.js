

export const requireApiKey = (req, res, next) => {
	const apiPassword = req.headers["x-api-password"];
	const expectedPassword = process.env.API_PASSWORD;

	if (!expectedPassword) {
		return res.status(500).json({
			error: "Server API password is not configured"
		});
	}

	if (apiPassword !== expectedPassword) {
		return res.status(401).json({
			error: "Unauthorized"
		});
	}

	next();
}