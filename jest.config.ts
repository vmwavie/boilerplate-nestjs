/* eslint-disable @typescript-eslint/naming-convention */
import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
	testEnvironment: 'node',
	preset: 'ts-jest',
	transform: {
		'^.+\\.ts?$': 'ts-jest',
	},
	clearMocks: true,
};

export default config;
