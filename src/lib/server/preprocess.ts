import lineReader from 'line-reader';

const WORD_GROUPS_PATH = 'data/word_groups_de.txt';

export type WordType = 'Noun' | 'Verb' | 'Adjective' | 'Other';

export type WordKey = {
	word: string;
	type: WordType;
}

export type Word = {
	word: string;
	type: WordType;
	groupId: number;
	example?: string;
};

export const preprocess = async (wiktionaryPath: string): Promise<Word[]> => {
	const wordFromGroups = await parseGroups();

	const wiktionaryWords = await parseWiktionary(wiktionaryPath);
	console.log(wiktionaryWords.size)

	return wordFromGroups;
};

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
	return { word, type, groupId };
};

const WIKTIONARY_POS_TYPES: Record<string, WordType> = {
	adj: 'Adjective',
	noun: 'Noun',
	verb: 'Verb'
};

type WiktionaryEntry = {
	word?: string;
	pos?: string;
	lang_code?: string;
};

const parseWiktionary = async (wiktionaryPath: string): Promise<Map<WordKey, Word>> => {
	const result = new Map<WordKey, Word>();

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

		// const type = WIKTIONARY_POS_TYPES[entry.pos];
	});
	console.log(`Finished in ${(performance.now() - startTime) / 1000} s`);

	return result;
};
