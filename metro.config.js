const { getDefaultConfig } = require('expo/metro-config');
const { FileStore } = require('metro-cache');
const path = require('path');

const config = getDefaultConfig(__dirname);

const cacheDir = process.env.METRO_CACHE_DIR || path.join(require('os').tmpdir(), 'metro-shared-cache');
config.cacheStores = [new FileStore({ root: cacheDir })];

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('@/')) {
    const resolved = path.resolve(__dirname, 'src', moduleName.slice(2));
    return context.resolveRequest(context, resolved, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
