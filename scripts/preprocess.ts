import { preprocess } from '../src/lib/server/preprocess.ts';
import { mkdirSync } from 'fs';
import { writeFileSync } from 'node:fs';

const words = await preprocess();
mkdirSync('src/lib/generated', { recursive: true });
writeFileSync('src/lib/generated/data.json', JSON.stringify(words));
