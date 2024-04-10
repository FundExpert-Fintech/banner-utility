module.exports = {
	apps: [
		{
			name: 'Banner Utility Frontend',
			instances: 1,
			script: './node_modules/next/dist/bin/next',
			args: 'start',
			exp_backoff_restart_delay: 200,
			watch: true,
			max_memory_restart: '400M',
		},
	],
};
