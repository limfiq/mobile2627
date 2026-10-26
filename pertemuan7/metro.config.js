const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Atur assetRegistryPath ke lokasi AssetRegistry yang valid di React Native
config.transformer.assetRegistryPath = 'react-native/Libraries/Image/AssetRegistry';

// Custom resolver untuk memetakan path internal React Native
const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react-native/asset-registry') {
    return {
      filePath: path.resolve(
        __dirname,
        'node_modules/react-native/Libraries/Image/AssetRegistry.js'
      ),
      type: 'sourceFile',
    };
  }
  if (moduleName === 'react-native/unstable-internals-do-not-use') {
    return {
      filePath: path.resolve(__dirname, 'unstable-internals.js'),
      type: 'sourceFile',
    };
  }
  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
