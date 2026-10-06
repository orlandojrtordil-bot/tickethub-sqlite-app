// Workaround for an upstream packaging quirk.
//
// `expo-clipboard` ships a `tsconfig.json` that extends
// "expo-module-scripts/tsconfig.base". However `expo-module-scripts` is only a
// *devDependency* of that package (jest, ts-jest, eslint-config-universe, ...)
// and is therefore never installed in a consumer app, so editors report:
//
//   File 'expo-module-scripts/tsconfig.base' not found.  ts(1)
//
// This script bridges the missing entry to `expo/tsconfig.base`, which the Expo
// SDK already ships. It only affects editor type-checking of a third-party
// package's own config file - the Metro/Babel bundle is completely unaffected.
//
// Safe to delete together with the "postinstall" script in package.json.
const fs = require("fs");
const path = require("path");

const bridgePath = path.join(
  __dirname,
  "..",
  "node_modules",
  "expo-module-scripts",
  "tsconfig.base.json"
);

const bridgeContents = '{ "extends": "expo/tsconfig.base" }\n';

try {
  fs.mkdirSync(path.dirname(bridgePath), { recursive: true });
  fs.writeFileSync(bridgePath, bridgeContents, "utf8");
  console.log(
    "[postinstall] bridged expo-module-scripts/tsconfig.base -> expo/tsconfig.base"
  );
} catch (error) {
  // Never fail an install over an editor-only diagnostic.
  console.warn(
    "[postinstall] could not create tsconfig bridge: " + error.message
  );
}
