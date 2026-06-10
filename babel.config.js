module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', { alias: { '@': './src' } }],
      //['@babel/plugin-transform-private-methods', { loose: true }],
      //['@babel/plugin-transform-private-property-in-object', { loose: true }],
      // NOTE: Do NOT add 'react-native-worklets/plugin' here.
      // babel-preset-expo (SDK 54+) auto-injects it when react-native-worklets is installed.
      // Adding it manually runs the worklets transform twice -> "Cannot assign to read only property" at runtime.
    ],
  };
};
