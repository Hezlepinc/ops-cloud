import fetch from "node-fetch";

const CW_AUTH = "https://api.cloudways.com/api/v1/oauth/access_token";
const CW_BASE = "https://api.cloudways.com/api/v1";

export async function getAccessToken() {
	const res = await fetch(CW_AUTH, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: `email=${encodeURIComponent(process.env.CW_EMAIL || "")}&api_key=${encodeURIComponent(process.env.CW_API_KEY || "")}`
	});
	const data = await res.json();
	return data.access_token;
}

export async function getServers(token) {
	const res = await fetch(`${CW_BASE}/server`, {
		headers: { Authorization: `Bearer ${token}` }
	});
	return await res.json();
}

export async function getApps(token) {
	const res = await fetch(`${CW_BASE}/app`, {
		headers: { Authorization: `Bearer ${token}` }
	});
	return await res.json();
}


