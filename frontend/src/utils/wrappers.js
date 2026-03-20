export async function apiFetch(url, options = {}) {
	const token = localStorage.getItem("token");
	const api_password = import.meta.env.VITE_API_PASSWORD;
	return fetch(url, {
		...options,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
			"x-api-password": api_password,
			...options.headers
		}
	});
}