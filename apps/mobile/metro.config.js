const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const reactRoot = path.resolve(__dirname, 'node_modules', 'react');

const pinnedTarget = (moduleName) => {
  if (moduleName === 'react') return path.join(reactRoot, 'index.js');
  if (moduleName === 'react/jsx-runtime') return path.join(reactRoot, 'jsx-runtime.js');
  if (moduleName === 'react/jsx-dev-runtime') return path.join(reactRoot, 'jsx-dev-runtime.js');
  return null;
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const target = pinnedTarget(moduleName);
  if (target) {
    return context.resolveRequest(
      { ...context, originModulePath: target },
      moduleName,
      platform
    );
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
