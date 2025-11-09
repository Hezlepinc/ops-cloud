import fetch from "node-fetch";

export async function fetchJSON(url, options = {}) {
	const res = await fetch(url, options);
	const text = await res.text();
	let data = null;
	try {
		data = text ? JSON.parse(text) : null;
	} catch {
		data = null;
	}
	return { ok: res.ok, status: res.status, data, raw: text };
}


