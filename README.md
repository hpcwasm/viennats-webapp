# install instructions


# boostrapping

# install node

# boostrap ngx app https://cli.angular.io/
```bash
npm install -g @angular/cli
ng new websimapp
# choose SASS for CSS: https://marksheet.io/sass-scss-less.html
cd websimapp
npm install --save @angular/material @angular/cdk @angular/animations  hammerjs
# add import to main.ts: import 'hammerjs';
# add default scheme to styles.sass: @import url(~@angular/material/prebuilt-themes/indigo-pink.css);
npm install --save ngx-monaco
npm install ngx-monaco-editor --save
npm install vtk.js --save
npm i --save kw-web-suite
npm i -D @angular-builders/custom-webpack # needed for vtk.js to load glsl files using a custom loader
npm i -D @angular-devkit/build-angular
npm install -D @angular-builders/dev-server
npm install -D babel-loader @babel/core @babel/preset-env  # https://github.com/babel/babel-loader
```
# issues with babel 
https://github.com/babel/babel/issues/8599

https://stackoverflow.com/questions/48643556/use-vtk-js-glsl-files-in-angular-cli-app

# copy compiled wasm files from https://github.com/hpcwasm/viennats-dev/ (buildfolder) to /src/assets/buildwasm:

```bash
HPCWASM_WASM_BIN_DIR=/home/manstetten/github_hpcwasm/viennats-dev/buildwasm
HPCWASM_WEBAPP_ASSETS=/home/manstetten/github_hpcwasm/viennats-webapp/src/assets/buildwasm

cp $HPCWASM_WASM_BIN_DIR/viennats.js $HPCWASM_WEBAPP_ASSETS/viennats.js
cp $HPCWASM_WASM_BIN_DIR/viennats.wasm $HPCWASM_WEBAPP_ASSETS/viennats.wasm
```

# serve local

```bash
ng serve
```

# deploy
```bash
ng build --prod
ng build --prod --base-href "https://hpcwasm.github.io/viennats/"
```

# update https://github.com/hpcwasm/viennats

copy dist folder to https://github.com/hpcwasm/viennats/docs

# test hpcwasm.github.io/viennats