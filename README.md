# :electric_plug: vue-cli-plugin-vplugin



[![CircleCI](https://circleci.com/gh/davidroyer/vue-cli-plugin-vplugin.svg?style=svg)](https://circleci.com/gh/davidroyer/vue-cli-plugin-vplugin)

Vue CLI 3 plugin to pluginize your Vue project

> vp = pluginization

<a href="https://www.patreon.com/davidroyer" target="_blank">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button.png" alt="Become a Patreon">
</a>


## :star: Features
Adjust your project generated by Vue CLI 3 to plugin development environment.

- Setup the plugin development codes for JavaScript or TypeScript
- Build for production code with rollup
- Adjust some files to distribute your Vue plugin
- Adjust to the environment where developable your Vue plugin with App.vue
- Provide demonstrate environment for your Vue plugin
- Setup the initial documentation environment with VuePress
- Automatically insert node_modules as rollup externals 


## :rocket: Getting Started
If yon don't have a project created with Vue CLI 3:

```sh
vue create vue-your-plugin
```

Install the plugin into your project:

```sh
cd vue-your-plugin
vue add vp
```

## :package: Build Customizing

### Automatically insert node_modules as externals
If you don't want to bundle dependent modules like `axios` at your plugin, you can make it external using `dependencies` of `package.json`.

example the below:

```json
{
  ...
  "dependencies": {
    "axios": "^0.18.0"
  },
  ...
}
```

## :scroll: Changelog

Detailed changes for each release are documented in the [CHANGELOG.md](https://github.com/davidroyer/vue-cli-plugin-vplugin/blob/master/CHANGELOG.md).


## :exclamation: Issues

Please make sure to read the [Issue Reporting Checklist](https://github.com/davidroyer/vue-cli-plugin-vplugin/blob/master/CONTRIBUTING.md#issue-reporting-guidelines) before opening an issue. Issues not conforming to the guidelines may be closed immediately.


## :muscle: Contribution

Please make sure to read the [Contributing Guide](https://github.com/davidroyer/vue-cli-plugin-vplugin/blob/master/CONTRIBUTING.md) before making a pull request.


## :white_check_mark: TODO
See the [GitHub projects](https://github.com/davidroyer/vue-cli-plugin-vplugin/projects/1)


## :copyright: License

[MIT](http://opensource.org/licenses/MIT)
