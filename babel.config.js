module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['nativewind/babel'],
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.jsx', '.js', '.ts', '.tsx', '.json'],
        alias: {
          tests: './tests/',
          '@components': './src/components',
          '@screens': './src/screens',
          '@images': './src/assets/images',
          '@store': './src/Store',
          '@src': './src',
          ROOTDIR: './',
        },
      },
    ],
    ['react-native-reanimated/plugin'],
  ],
};
