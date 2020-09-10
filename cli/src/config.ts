import { readJSON } from 'fs-extra';
import { basename, dirname, join, resolve } from 'path';

import { logFatal } from './common';
import {
  Config,
  ExternalConfig,
  OS,
  CLIConfig,
  AndroidConfig,
  IOSConfig,
} from './definitions';

export const EXTERNAL_CONFIG_FILE = 'capacitor.config.json';

export async function loadConfig(): Promise<Config> {
  const appRootDir = process.cwd();
  const cliRootDir = dirname(__dirname);
  const extConfig = await loadExternalConfig(
    resolve(appRootDir, EXTERNAL_CONFIG_FILE),
  );

  const webDir = extConfig.webDir ?? 'www';
  const cli = await loadCLIConfig(cliRootDir);

  return {
    windows: {
      androidStudioPath:
        'C:\\Program Files\\Android\\Android Studio\\bin\\studio64.exe',
    },
    linux: {
      androidStudioPath: '/usr/local/android-studio/bin/studio.sh',
    },
    android: await loadAndroidConfig(appRootDir, cli.assetsDir),
    ios: await loadIOSConfig(appRootDir, cli.assetsDir),
    web: {
      name: 'web',
    },
    cli,
    app: {
      rootDir: appRootDir,
      appId: extConfig.appId ?? '',
      appName: extConfig.appName ?? '',
      webDir,
      webDirAbs: resolve(appRootDir, webDir),
      package: await readJSON(resolve(appRootDir, 'package.json')),
      extConfigName: EXTERNAL_CONFIG_FILE,
      extConfigFilePath: resolve(appRootDir, EXTERNAL_CONFIG_FILE),
      extConfig,
      bundledWebRuntime: extConfig.bundledWebRuntime ?? false,
    },
  };
}

async function loadCLIConfig(rootDir: string): Promise<CLIConfig> {
  const assetsName = 'assets';

  return {
    rootDir,
    assetsName,
    assetsDir: join(rootDir, assetsName),
    package: await readJSON(resolve(rootDir, 'package.json')),
    os: determineOS(process.platform),
  };
}

async function loadAndroidConfig(
  rootDir: string,
  assetDir: string,
): Promise<AndroidConfig> {
  const name = 'android';
  const platformDir = resolve(rootDir, name);
  const webDir = 'app/src/main/assets/public';
  const resDir = 'app/src/main/res';

  const templateName = 'android-template';
  const pluginsFolderName = 'capacitor-cordova-android-plugins';

  return {
    name,
    minVersion: '21',
    platformDir,
    webDir,
    webDirAbs: resolve(platformDir, webDir),
    resDir,
    resDirAbs: resolve(platformDir, resDir),
    assets: {
      templateName,
      pluginsFolderName,
      templateDir: resolve(assetDir, templateName),
      pluginsDir: resolve(assetDir, pluginsFolderName),
    },
  };
}

async function loadIOSConfig(
  rootDir: string,
  assetDir: string,
): Promise<IOSConfig> {
  const name = 'ios';
  const platformDir = resolve(rootDir, name);
  const webDir = 'public';
  const nativeProjectName = 'App';
  const templateName = 'ios-template';
  const pluginsFolderName = 'capacitor-cordova-ios-plugins';

  return {
    name,
    minVersion: '11.0',
    cordovaSwiftVersion: '5.0',
    platformDir,
    webDir,
    webDirAbs: resolve(platformDir, nativeProjectName, webDir),
    nativeProjectName,
    assets: {
      templateName,
      pluginsFolderName,
      templateDir: resolve(assetDir, templateName),
      pluginsDir: resolve(assetDir, pluginsFolderName),
    },
  };
}

function determineOS(os: NodeJS.Platform): OS {
  switch (os) {
    case 'darwin':
      return OS.Mac;
    case 'win32':
      return OS.Windows;
    case 'linux':
      return OS.Linux;
  }

  return OS.Unknown;
}

async function loadExternalConfig(p: string): Promise<ExternalConfig> {
  try {
    return await readJSON(p);
  } catch (e) {
    return {};
  }
}
