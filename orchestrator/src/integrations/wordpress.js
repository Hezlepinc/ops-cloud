import fetch from "node-fetch";

export async function getWPHealth(siteUrl) {
	try {
		const res = await fetch(`${siteUrl.replace(/\/+$/, "")}/wp-json/wp/v2/types`, { method: "GET" });
		if (!res.ok) {
			return { status: "offline", code: res.status };
		}
		const types = await res.json();
		return { status: "online", types: Object.keys(types || {}).length };
	} catch (e) {
		return { status: "offline", error: String(e) };
	}
}


