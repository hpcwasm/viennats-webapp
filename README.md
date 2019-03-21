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

# copy buildwasm files from https://github.com/hpcwasm/viennats-dev/buildwasm (buildfolder) to /src/assets/buildwasm:

- viennats.js
- viennats.wasm
- viennats.data
- vtsworker.js

# serve local

ng serve
ng build --prod
