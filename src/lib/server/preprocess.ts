import lineReader from 'line-reader';
import { type Word, wordKey, type WordType } from '../dictionary/types.ts';

const WORD_GROUPS_PATH = 'data/word_groups_de.txt';

export const preprocess = async (wiktionaryPath: string): Promise<Word[]> => {
	const wordFromGroups = await parseGroups();

	const wiktionaryWords = await parseWiktionary(wiktionaryPath);

	return combineDataSources(wordFromGroups, wiktionaryWords);
};

const combineDataSources = (words: Word[], wiktionaryWords: Map<string, Word>): Word[] =>
	words.map((word: Word) => {
		const wiktionaryEntry = wiktionaryWords.get(wordKey(word));
		const examples = wiktionaryEntry?.examples || [];
		const englishTranslations = wiktionaryEntry?.englishTranslations || [];
		const firstPersonSingular = wiktionaryEntry?.firstPersonSingular || [];
		return { ...word, examples, englishTranslations, firstPersonSingular };
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

const GROUP_WORD_TYPES: Record<string, WordType> = { A: 'Adjective', N: 'Noun', V: 'Verb' };

const parseWord = (rawWord: string, groupId: number): Word => {
	const [word, rawType] = rawWord.split('_', 2);
	const type = GROUP_WORD_TYPES[rawType] ?? 'Other';
	return { word, type, groupId, examples: [], englishTranslations: [], firstPersonSingular: [] };
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

type WiktionaryTranslation = {
	lang_code: string;
	word: string;
};

type WiktionaryForm = {
	form: string;
	// Most rows come from the full conjugation table and carry neither of these.
	tags?: string[];
	pronouns?: string[];
};

type WiktionaryEntry = {
	word?: string;
	pos?: string;
	lang_code?: string;
	senses?: WiktionarySense[];
	translations?: WiktionaryTranslation[];
	forms?: WiktionaryForm[];
};

const uniques = (...values: string[]) => [...new Set(values)];

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

		const key = wordKey({ type, word: entry.word });
		const prevWord = result.get(key);

		const examples = uniques(
			...(prevWord?.examples ?? []),
			...(entry.senses
				?.filter((sense) => sense.examples !== undefined)
				.map((sense) => sense.examples![0].text.trim())
				.filter(Boolean) ?? [])
		);
		const englishTranslations = uniques(
			...(prevWord?.englishTranslations ?? []),
			...(entry.translations
				?.filter((trans) => trans.lang_code === 'en')
				.flatMap((it) => it.word.split(/ *, */))
				.map((it) => it.trim())
				.filter(Boolean) ?? [])
		);
		const firstPersonSingular = uniques(
			...(prevWord?.firstPersonSingular ?? []),
			...(entry.forms
				?.filter((form) => form.pronouns?.includes('ich') && form.tags?.includes('present'))
				?.map((it) => it.form) || [])
		);

		const word = {
			word: entry.word,
			type,
			examples,
			englishTranslations,
			firstPersonSingular,
			groupId: -1
		};
		result.set(key, word);
	});
	console.log(`Finished in ${(performance.now() - startTime) / 1000} s`);

	return result;
};
