import fetch from "node-fetch";

const CW_AUTH = "https://api.cloudways.com/api/v1/oauth/access_token";
const CW_BASE = "https://api.cloudways.com/api/v1";

async function fetchJsonSafe(url, options = {}) {
	const res = await fetch(url, options);
	const contentType = res.headers.get("content-type") || "";
	const text = await res.text();
	let json = null;
	if (contentType.toLowerCase().includes("application/json")) {
		try {
			json = text ? JSON.parse(text) : null;
		} catch (e) {
			throw new Error(`Cloudways JSON parse error (${res.status}): ${String(e).slice(0, 120)}`);
		}
	} else {
		if (!res.ok) {
			throw new Error(`Cloudways HTTP ${res.status}: ${text.slice(0, 160)}`);
		}
		// Non-JSON but ok — unlikely for API; surface a concise message
		throw new Error(`Cloudways response not JSON (${res.status}): ${text.slice(0, 160)}`);
	}
	if (!res.ok) {
		const msg = json?.message || json?.error || `HTTP ${res.status}`;
		throw new Error(`Cloudways error: ${msg}`);
	}
	return json;
}

export async function getAccessToken() {
	const body = `email=${encodeURIComponent(process.env.CW_EMAIL || "")}&api_key=${encodeURIComponent(process.env.CW_API_KEY || "")}`;
	const data = await fetchJsonSafe(CW_AUTH, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body
	});
	return data.access_token;
}

export async function getServers(token) {
	return await fetchJsonSafe(`${CW_BASE}/server`, {
		headers: { Authorization: `Bearer ${token}` }
	});
}

export async function getApps(token) {
	return await fetchJsonSafe(`${CW_BASE}/app`, {
		headers: { Authorization: `Bearer ${token}` }
	});
}


