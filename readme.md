# TypeScript extension for Yellicode

Yellicode lets you build your own code generation templates with TypeScript. It consists of a Node.js CLI and extensible APIs, making it easy for developers to create, share and re-use code generators for their favorite programming languages and frameworks.

Check out [our website](https://www.yellicode.com) for more.

This extension contains a TypeScriptWriter class and other utilities that make is easier to generate TypeScript code from a Yellicode template.

License: MIT

## Using the TypeScript package
### Prerequisites
In order to run a code generation template, you must have the CLI installed (@yellicode/cli) globally and have a valid *codegenconfig.json* file in your working directory. Please refer to the [installation instructions](https://www.yellicode.com/docs/installation) and the [quick start](https://www.yellicode.com/docs/quickstart) for more.

You should also have the *@yellicode/model* package installed in your working directory:
```
npm install @yellicode/model --save-dev
```

### Installation
Open a terminal/command prompt in your working directory and install this package as a dev dependency:

```
npm install @yellicode/typescript --save-dev
```

### Sample template
This template generates a TypeScript code file with all classes in the model and, for each class, writes a property for each class attribute.

```ts
import * as model from '@yellicode/model';
import { Generator, TextWriter } from '@yellicode/templating';
import { TypeScriptWriter } from '@yellicode/typescript';

Generator.generateFromModel({ outputFile: `my-classes.ts` }, (textWriter: TextWriter, pack: model.Package) => {
    const writer = new TypeScriptWriter(textWriter);   
    pack.getAllClasses().forEach(c => {
        writer.writeEndOfLine(); // insert a blank line
        writer.writeClassBlock(c, () => {
            c.ownedAttributes.forEach(att => {
                writer.writeProperty(att);
            })
        }, { prefix: 'export' });
    });
});    
```

### API Documentation
For all TypeScriptWriter functions and options, check out the [API documentation](https://github.com/yellicode/yellicode-typescript/blob/master/docs/api.md).