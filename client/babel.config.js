module.exports = function () {
  return {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react',
      '@babel/preset-typescript',
    ],
    plugins: ['react-native-reanimated/plugin', '@babel/plugin-syntax-jsx'],
  };
};