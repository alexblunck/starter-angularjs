# starter-angular
Starting point for AngularJs 1.6+ applications using es6 & webpack.

## Setup
The project uses [alexblunck/webpack-config](https://github.com/alexblunck/webpack-config) for its webpack configuration. It is included as a submodule in the `lib` directory.

```bash
git clone https://github.com/alexblunck/starter-angularjs --recurse-submodules
```

## Workflow

### Development
Run `npm start` to start a development server, open a browser & watch for changes.

### Production
Run `npm run build` to create a production ready build in the `dist` directory.

### Analyze
Run `npm run analyze` to analyze the production build.
