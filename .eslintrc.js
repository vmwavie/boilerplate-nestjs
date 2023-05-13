module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	extends: 'xo',
	overrides: [
		{
			extends: [
				'xo-typescript',
			],
			files: [
				'*.ts',
				'*.tsx',
				'**/*.spec.js',
				'**/*.spec.jsx',
			],
			env: {
				jest: true,
			},
		},
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	rules: {
		'new-cap': [
			'error',
			{
				capIsNewExceptions: [
					'Entity',
					'PrimaryGeneratedColumn',
					'Column',
					'Router',
				],
			},
		],
	},
};
