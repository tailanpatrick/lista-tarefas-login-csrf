const path = require('path');

module.exports = {
	mode: 'development',
	entry: './src/frontend/main.tsx',
	output: {
		path: path.resolve(__dirname, 'public/assets/js'),
		filename: 'bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.(ts|tsx|js|jsx)$/, // aceita TS e JS
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							'@babel/preset-env',
							'@babel/preset-react',
							'@babel/preset-typescript', // adiciona suporte a TS
						],
					},
				},
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader', 'postcss-loader'],
			},
			{
				test: /\.(png|jpg|gif|webp)$/,
				use: {
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'assets/img',
					},
				},
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx'], // adiciona .ts e .tsx
	},
	devServer: {
		static: {
			directory: path.resolve(__dirname, 'public'),
		},
		port: 3000,
		open: true,
		hot: true,
		compress: true,
		historyApiFallback: true,
	},
	devtool: 'source-map',
};
