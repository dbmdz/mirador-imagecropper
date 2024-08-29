# mirador-imagecropper

[![npm package][npm-badge]][npm]
[![required Mirador version][mirador-badge]][mirador]

A Mirador 4 plugin to retrieve the image url for the selected area.

![Screenshot1][screenshot1]
![Screenshot2][screenshot2]

## Installation

Currently the plugin can only be used if you build your own Mirador JavaScript bundle.
To include the plugin in your Mirador installation, you need to install it
from npm with `npm install mirador-imagecropper`, import it into your project
and pass it to Mirador when you instantiate the viewer:

```javascript
import Mirador from 'mirador/dist/es/src/index';
import imageCropperPlugin from 'mirador-imagecropper/es';

const miradorConfig = {
  // Your Mirador configuration
}
Mirador.viewer(config, [...imageCropperPlugin]);
```

## Configuration

You can configure the plugin globally for all windows and/or individually for
every window.

For global configuration add the `imageCropper` entry to the top-level
`window` configuration (globally for all windows) or to the individual window
object:

```javascript
const miradorConfig = {
  window: {
    // ....
    imageCropper: {
      // Global config for all windows, see available settings below
    },
  },
  windows: [{
    // ....
    imageCropper: {
      // config for an individual window, see available settings below
    },
  }, // ...
}
```

You can view an example configuration in [demo/src/index.js][demo-cfg].

The available settings are:

- `active`: If the cropping overlay is active. Boolean, defaults to `false`.
- `dialogOpen`: If the settings dialog is open. Boolean, defaults to `false`.
- `enabled`: If the plugin is enabled. Boolean, defaults to `true`.
- `roundingPrecision`: Set the number of decimal places. Number, defaults to `5`.
- `showRightsInformation`: If rights information defined in the manifest should be shown. Boolean, defaults to `true`.

## Contributing

Found a bug? The plugin is not working with your manifest? Want a new
feature? Create an issue, or if you want to take a shot at fixing it
yourself, make a fork, create a pull request, we're always open to
contributions :-)

For larger changes/features, it's usually wise to open an issue before
starting the work, so we can discuss if it's a fit.

**Note**: The package requires Node.js `16` and npm in major version `8`.

[demo-cfg]: https://github.com/dbmdz/mirador-imagecropper/blob/main/demo/src/index.js#L5-L52
[mirador]: https://github.com/ProjectMirador/mirador/releases/tag/v3.1.1
[mirador-badge]: https://img.shields.io/badge/Mirador-%E2%89%A53.1.1-blueviolet
[npm]: https://www.npmjs.org/package/mirador-imagecropper
[npm-badge]: https://img.shields.io/npm/v/mirador-imagecropper.png?style=flat-square
[screenshot1]: .docassets/screenshot1.png
[screenshot2]: .docassets/screenshot2.png
