#Angular Extension Schematics
by [@tomastrajan](https://twitter.com/tomastrajan)

[![license](https://img.shields.io/github/license/angular-extensions/schematics.svg)](https://github.com/angular-extensions/schematics/blob/master/LICENSE) [![Build Status](https://travis-ci.org/angular-extensions/schematics.svg?branch=master)](https://travis-ci.org/angular-extensions/schematics) [![Twitter Follow](https://img.shields.io/twitter/follow/tomastrajan.svg?style=social&label=Follow)](https://twitter.com/tomastrajan)

### Testing

To test locally, install `@angular-devkit/schematics` globally and use the `schematics` command line tool. That tool acts the same as the `generate` command of the Angular CLI, but also has a debug mode.

Check the documentation with
```bash
schematics --help
```

### Unit Testing

`npm run test` will run the unit tests, using Jasmine as a runner and test framework.

### Publishing

To publish, simply do:

```bash
npm run build
npm publish
```

That's it!
 