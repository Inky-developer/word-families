// src/routes/notes/+page.server.js

import { preprocess } from '$lib/server/preprocess';

export async function load() {
	const words = await preprocess();
	return {
		content: words
	};
}
