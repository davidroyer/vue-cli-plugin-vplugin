const fs = require("fs");
const path = require("path");
const babel = require("rollup-plugin-babel");
const cjs = require("rollup-plugin-commonjs");
const node = require("rollup-plugin-node-resolve");
const alias = require("rollup-plugin-alias");
const css = require("rollup-plugin-css-only");
const replace = require("rollup-plugin-replace");
const VuePlugin = require("rollup-plugin-vue");
const typescript = require("rollup-plugin-typescript2");
const { classify } = require("../utils");
// require.main cannot be used because this process is run externally (from vue-cli-service)
const { dependencies } = require(path.resolve(process.cwd(), "package.json"));
const configPath = path.resolve(process.cwd(), "vplugin.config.js");
const isModularBuild = process.env.BUILD_TYPE === "modular";

const VPluginDefaultConfig = {
  globals: {}
};

let userConfig;

if (fs.existsSync(configPath)) {
  userConfig = require(path.resolve(process.cwd(), "vplugin.config.js"));
} else {
  userConfig = {};
}

const VPluginConfig = {
  ...VPluginDefaultConfig,
  ...userConfig
};

console.log("VPluginConfig: Using New Setup: ", VPluginConfig);

function makeEntries(entryPath, destPath, moduleName, packageName, banner) {
  const resolve = _path => path.resolve(destPath, _path);
  return {
    commonjs: {
      entry: resolve(entryPath),
      dest: resolve(`dist/${packageName}.common.js`),
      format: "cjs",
      banner
    },
    esm: {
      entry: resolve(entryPath),
      dest: resolve(`dist/${packageName}.esm.js`),
      format: "es",
      banner
    },
    production: {
      entry: resolve(entryPath),
      dest: resolve(`dist/${packageName}.umd.min.js`),
      format: "umd",
      env: "production",
      moduleName,
      banner,
      globals: VPluginConfig.globals
    },

    modular: {
      entry: resolve(entryPath),
      dest: resolve(`dist/js/${packageName}.js`),
      format: "umd",
      // env: "production",
      moduleName,
      banner,
      globals: VPluginConfig.globals
    },

    // ssr: {
    //   entry: resolve(entryPath),
    //   dest: resolve(`dist/${packageName}.ssr.js`),
    //   format: "umd",
    //   banner
    // },

    development: {
      entry: resolve(entryPath),
      dest: resolve(`dist/${packageName}.umd.js`),
      format: "umd",
      env: "development",
      moduleName,
      banner,
      globals: VPluginConfig.globals
    }
  };
}

function buildinPlugins(version, env, langInfo, buildName) {
  const plugins = [
    node({
      customResolveOptions: {
        moduleDirectory: "node_modules"
      }
    }),

    cjs(),

    // css(),

    alias({
      resolve: [".css", ".js", ".vue"],
      "@": path.resolve(process.cwd(), "src")
    })
  ];

  handleModularBuildPlugins(isModularBuild, plugins, buildName);

  if (langInfo.lang === "ts") {
    plugins.push(
      typescript({
        typescript: require(langInfo.runtime),
        tsconfig: langInfo.config,
        cacheRoot: "./node_modules/.cache/rpt2_cache",
        clean: true
      })
    );
  }

  if (langInfo.useBabel) {
    plugins.push(
      VuePlugin({
        css: buildName === "modular" && isModularBuild ? false : true
      })
    );
    plugins.push(
      babel({
        // https://cli.vuejs.org/guide/browser-compatibility.html#polyfills-when-building-as-library-or-web-components
        babelrc: false,
        presets: [["@vue/babel-preset-app", { useBuiltIns: false }]],
        extensions: [".js", ".jsx", ".ts", ".tsx", ".es6", ".es", ".mjs"],
        runtimeHelpers: true
      })
    );
  }

  const replaceOptions = { __VERSION__: version };
  if (env) {
    replaceOptions["process.env.NODE_ENV"] = JSON.stringify(env);
  }
  plugins.push(replace(replaceOptions));

  return plugins;
}

/**
 *
 * @param {string} buildName The `key` in the build types Object
 * @param {*} options
 * @param {*} moduleName
 * @param {*} version
 * @param {*} langInfo
 */
function generateConfig(buildName, options, moduleName, version, langInfo) {
  const plugins = buildinPlugins(version, options.env, langInfo, buildName);
  return {
    input: options.entry,
    output: {
      file: options.dest,
      name: moduleName,
      format: options.format,
      banner: options.banner,
      exports: "named",
      globals: VPluginConfig.globals
      // TODO: sourcemap: 'inline'
    },
    // https://github.com/rollup/rollup/issues/1514#issuecomment-320438924
    external: Object.keys(dependencies),
    plugins
  };
}

function getAllEntries({ name, version }, { entry, dest }, banner, langInfo) {
  const moduleName = classify(name);
  const entries = makeEntries(entry, dest, moduleName, name, banner);
  return Object.keys(entries).map(name =>
    generateConfig(name, entries[name], moduleName, version, langInfo)
  );
}

function handleModularBuildPlugins(isModularBuild, plugins, buildName) {
  console.log("Building Modular Version...");

  if (isModularBuild && buildName === "modular")
    plugins.push(css({ output: "dist/css/vue2-editor.css" }));
}

module.exports = getAllEntries;
