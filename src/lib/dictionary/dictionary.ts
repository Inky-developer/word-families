import type { Word, WordType } from '$lib/server/preprocess';

export const WORD_TYPE_META: Record<WordType, { label: string; short: string; classes: string }> = {
	Noun: {
		label: 'Substantiv',
		short: 'Subst.',
		classes: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
	},
	Verb: {
		label: 'Verb',
		short: 'Verb',
		classes: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
	},
	Adjective: {
		label: 'Adjektiv',
		short: 'Adj.',
		classes: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
	},
	Other: {
		label: 'Sonstige',
		short: 'Sonst.',
		classes: 'bg-paper-200 text-paper-700 dark:bg-paper-800 dark:text-paper-300'
	}
};

export class Dictionary {
	constructor(
		readonly groups: Record<number, Word[]>,
		readonly words: Word[]
	) {}

	static fromWords(words: Word[]): Dictionary {
		const groups: Record<number, Word[]> = {};
		words.forEach((word) => {
			groups[word.groupId] = (groups[word.groupId] || []).concat(word);
		});
		return new Dictionary(groups, words);
	}

	search(query: string): Word[] {
		const needle = query.toLowerCase();
		return this.words.filter(({ word }) => word.toLowerCase().startsWith(needle));
	}
}
