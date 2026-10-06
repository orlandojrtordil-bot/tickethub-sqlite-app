const path = require("node:path");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.watchFolders = [
  __dirname,
  path.resolve(__dirname, "node_modules/react-native"),
];

module.exports = config;
