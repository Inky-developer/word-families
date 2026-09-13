export const WORD_TYPES = ['Verb', 'Noun', 'Adjective', 'Other'] as const;
export type WordType = (typeof WORD_TYPES)[number];

export type WordKey = {
	word: string;
	type: WordType;
};

// Map keys are compared by identity for objects, so composite keys must be serialized.
export const wordKey = ({ word, type }: WordKey): string => `${type}\u0000${word}`;

export type Word = {
	word: string;
	type: WordType;
	groupId: number;
	examples: string[];
	englishTranslations: string[];
};
