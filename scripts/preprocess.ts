import { preprocess } from '../src/lib/server/preprocess.ts';
import { createWriteStream, existsSync, mkdirSync } from 'node:fs';
import { mkdir, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import type { ReadableStream } from 'node:stream/web';
import { createGunzip } from 'node:zlib';

const WIKTIONARY_URL = 'https://kaikki.org/dictionary/downloads/de/de-extract.jsonl.gz';
const WIKTIONARY_DIR = 'data/download/';
const WIKTIONARY_PATH = join(WIKTIONARY_DIR, 'de-extract.jsonl');

const downloadWiktionary = async (): Promise<void> => {
	if (existsSync(WIKTIONARY_PATH)) {
		console.log(`Reusing Wiktionary dump at ${WIKTIONARY_PATH}`);
		return;
	}

	await mkdir(WIKTIONARY_DIR, { recursive: true });

	console.log(`Downloading ${WIKTIONARY_URL}`);
	const response = await fetch(WIKTIONARY_URL);
	if (!response.ok || !response.body) {
		throw new Error(
			`Unable to download ${WIKTIONARY_URL}: ${response.status} ${response.statusText}`
		);
	}

	const partialPath = `${WIKTIONARY_PATH}.partial`;
	await pipeline(
		Readable.fromWeb(response.body as ReadableStream<Uint8Array>),
		createGunzip(),
		createWriteStream(partialPath)
	);
	await rename(partialPath, WIKTIONARY_PATH);

	console.log(`Extracted Wiktionary dump to ${WIKTIONARY_PATH}`);
	return;
};

await downloadWiktionary();
const words = await preprocess(WIKTIONARY_PATH);
mkdirSync('src/lib/generated', { recursive: true });
await writeFile('src/lib/generated/data.json', JSON.stringify(words));
