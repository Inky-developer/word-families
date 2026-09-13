import adapter from '@sveltejs/adapter-static';
import { type Config } from '@sveltejs/kit';

const config: Config = {
	kit: {
		paths: {
			base: process.argv.includes('dev') ? '' : (process.env.BASE_PATH as `/${string}`)
		},
		adapter: adapter({
			// default options are shown. On some platforms
			// these options are set automatically — see below
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: true,
			strict: true
		})
	}
};

export default config;
