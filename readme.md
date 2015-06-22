## Overview 

This sample implements a complete Angular2 + Node.js application.

It is based on the (evolving) Angular2/Microsoft "**ngconf2015**" demo which is described in the video,
"[Getting started with Angular 2 developer preview](https://www.youtube.com/watch?v=HmWm21cCAXM)" (May 2015).

The original github repo for that is [here](https://github.com/Microsoft/ngconf2015demo).
This MEAN version is in 
["mean" branch of a fork of that repo](https://github.com/wardbell/ngconf2015demo/tree/mean).

**Notable features**:
- Client-side app written with Angular2 and typescript
- Typed usage of express
- Typed usage of mongodb for server side database
- Typed usage of Node.js 
- Use of TypeScript module syntax 

> Note: This demo uses [SystemJS](https://github.com/systemjs/systemjs) and 
[es6-module-loader](https://github.com/ModuleLoader/es6-module-loader) to 
transpile typescript files in the browser. 
It also uses a pre-release drop of TypeScript 1.5.2 from 
[mhegazy/typescript#v1.5-beta2](https://github.com/mhegazy/typescript#v1.5-beta2)

##Install

Note: Perform all steps with your working directory set to the folder containing this README:

1. Install MongoDB if necessary (see http://docs.mongodb.org/manual/installation/ )

2. Run the following command to launch the MongoDB process
```
<mongoinstalldir>\bin\mongod
```

3. Restore the sample app data to MongoDB in another command prompt with the following command:
```
<mongoinstalldir>\bin\mongorestore dump
```
	
4. install (node) npm packages
```
npm install
```

5. install client-side bower packages
```
bower install
```

6. install typings (required for design time typechecking in editors). 

    ```
    npm install tsd -g
    tsd reinstall
    tsd rebundle
    ``` 
    Learn more about these "tsd" commands [here](https://github.com/DefinitelyTyped/tsd).
    
7. Compile the TS on command line with the following command
```
gulp ts-compile
```

8. Optionally install *node-inspector* for node debugging.
```
npm install -g node-inspector 
```

## Run 

1. Make sure that the MongoDb process is running in one terminal/console window
```
<mongoinstalldir>\bin\mongod [--dbpath database]
```

2. Launch the Node process to serve the app using the following command:
```
node server/server.js
```

3. Open your favorite browser and going to the following URL to access the app:
```
http://localhost:3001/
```

4. Toggle between "fake" and "mongo" client-side services in *todo.ts* by switching `import` statements: 
```
//import {Todo, TodoService} from 'todo.fake.service';
import {Todo, TodoService} from 'todo.service';
````

## Run w/ debugging 

**Remember to have installed *node-inspector* first! See above.** 

1. Make sure that the MongoDb process is running in one terminal/console window
```
<mongoinstalldir>\bin\mongod [--dbpath database]
```

2. in one terminal/console window, 
```
gulp serve-dev --verbose`
```

3. in a second terminal/console window, 
```
node-inspector server/server.js
```

4. to run the app, open browser to 
```
http://localhost:3001/
``` 

5. for *node-inspector* debugging, open second browser tab to 
```
http://127.0.0.1:8080/debug?port=5858
``` 

## Explore the node api w/ POSTman

The easy way to explore the node/mongo API is 
with the [POSTman chrome extension](https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm?hl=en).

You can import some prepared HTTP requests by
* open POSTman in Chrome
* press the "Collections" button
* press the "Import" icon (it looks like an in-box)
* either "Choose Files" or drag in the *MEANTodoPostman.json* file
* have fun!
