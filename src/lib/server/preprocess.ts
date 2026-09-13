import lineReader from 'line-reader';

const WORD_GROUPS_PATH = 'data/word_groups_de.txt';

export type WordType = 'Noun' | 'Verb' | 'Adjective' | 'Other';

export type WordKey = {
	word: string;
	type: WordType;
};

// Map keys are compared by identity for objects, so composite keys must be serialized.
const wordKey = ({ word, type }: WordKey): string => `${type}\u0000${word}`;

export type Word = {
	word: string;
	type: WordType;
	groupId: number;
	examples: string[];
};

export const preprocess = async (wiktionaryPath: string): Promise<Word[]> => {
	const wordFromGroups = await parseGroups();

	const wiktionaryWords = await parseWiktionary(wiktionaryPath);

	return combineDataSources(wordFromGroups, wiktionaryWords);
};

const combineDataSources = (words: Word[], wiktionaryWords: Map<string, Word>): Word[] =>
	words.map((word: Word) => {
		const wiktionaryEntry = wiktionaryWords.get(wordKey(word));
		const examples = wiktionaryEntry?.examples || [];
		return { ...word, examples };
	});

const readLines = async (fileName: string, onLine: (line: string) => void): Promise<void> =>
	new Promise((resolve, reject) => {
		lineReader.eachLine(
			fileName,
			(line, last) => {
				onLine(line);
				if (last) resolve();
				return true;
			},
			(err) => {
				if (err) reject(err);
			}
		);
	});

const parseGroups = async (): Promise<Word[]> => {
	const words: Word[] = [];

	// First line is a comment
	let isFirstLine = true;
	let groupId = 0;

	await readLines(WORD_GROUPS_PATH, (line) => {
		if (isFirstLine) {
			isFirstLine = false;
			return;
		}
		words.push(...parseGroup(line, groupId));
		groupId += 1;
	});
	return words;
};

const parseGroup = (line: string, groupId: number): Word[] => {
	const parts = line.split(' ');
	const words = parts.slice(1);
	return words.map((word) => parseWord(word, groupId));
};

const WORD_TYPES: Record<string, WordType> = { A: 'Adjective', N: 'Noun', V: 'Verb' };

const parseWord = (rawWord: string, groupId: number): Word => {
	const [word, rawType] = rawWord.split('_', 2);
	const type = WORD_TYPES[rawType] ?? 'Other';
	return { word, type, groupId, examples: [] };
};

const WIKTIONARY_POS_TYPES: Record<string, WordType> = {
	adj: 'Adjective',
	noun: 'Noun',
	verb: 'Verb'
};

type WiktionaryExample = {
	text: string;
	bold_text_offsets?: number[][];
};

type WiktionarySense = {
	examples?: WiktionaryExample[];
};

type WiktionaryEntry = {
	word?: string;
	pos?: string;
	lang_code?: string;
	senses?: WiktionarySense[];
};

const parseWiktionary = async (wiktionaryPath: string): Promise<Map<string, Word>> => {
	const result = new Map<string, Word>();

	let lineNumber = 0;
	const startTime = performance.now();
	console.log('Processing wiktionary dump');
	await readLines(wiktionaryPath, (line): void => {
		lineNumber += 1;
		if (!line) return;

		let entry: WiktionaryEntry;
		try {
			entry = JSON.parse(line);
		} catch (e) {
			console.error(`length ${line.length}`);
			console.error(`head ${JSON.stringify(line.slice(0, 120))}`);
			console.error(`tail ${JSON.stringify(line.slice(-120))}`);
			throw new Error(`Unable to parse Wiktionary entry at line ${lineNumber}: ${e}`, { cause: e });
		}

		if (entry.lang_code !== 'de' || !entry.word || !entry.pos) return;

		const type = WIKTIONARY_POS_TYPES[entry.pos];
		if (!type) return;

		const examples =
			entry.senses
				?.filter((sense) => sense.examples !== undefined)
				.map((sense) => sense.examples![0].text) ?? [];
		const key: WordKey = { type, word: entry.word };
		result.set(wordKey(key), { ...key, examples: examples, groupId: -1 });
	});
	console.log(`Finished in ${(performance.now() - startTime) / 1000} s`);

	return result;
};
