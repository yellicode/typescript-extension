# TypeScript extension for Yellicode
Generate TypeScript code using powerful TypeScript code generation templates! This [Yellicode](https://www.yellicode.com) extension lets you generate TypeScript classes, interfaces, enumerations and their members from different kinds of models, using a fully typed code writer.

License: MIT

## About Yellicode
Yellicode lets you build your own code generation templates with TypeScript. It consists of a Node.js CLI and extensible APIs, making it easy for developers to create, share and re-use code generators for their favorite programming languages and frameworks.

Check out [our website](https://www.yellicode.com) for more.

## Using the TypeScript package
### Prerequisites
In order to run a code generation template, you must have the CLI installed (@yellicode/cli) globally and have a valid *codegenconfig.json* file in your working directory. Please refer to the [installation instructions](https://www.yellicode.com/docs/installation) and the [quick start](https://www.yellicode.com/docs/quickstart) for more.

### Installation
Open a terminal/command prompt in your working directory and install this package as a dev dependency:

```
npm install @yellicode/typescript --save-dev
```
## Using the TypeScriptWriter
The main class for generating TypeScript code is the `TypeScriptWriter`. The `TypeScriptWriter` can work with 2 different model kinds as input:
* A TypeScript code definition. 
* A [Yellicode model](https://www.yellicode.com/docs/yellicode-models).

Most `TypeScriptWriter` functions have 2 overloads which can be used for each different kind of input. For example, the `writeClassBlock` function has the 
following overloads:
1. `public writeClassBlock(cls: ClassDefinition, contents: (writer: TypeScriptWriter) => void): void`
2. `public writeClassBlock(cls: elements.Type, contents: (writer: TypeScriptWriter) => void, options?: opts.ClassOptions): void`

The first overload accepts a `ClassDefinition`, which has the following structure (comments left out for brevity):

```ts
export interface ClassDefinition extends TypeDefinition {   
    isAbstract?: boolean;    
    implements?: string[];    
    extends?: string[];    
    properties?: PropertyDefinition[];
}
```
When using this overload, you should build the definition in your code generation template. You can do this manually, but typically you would 
configure a JSON file as model (see the [Yellicode quick start](https://www.yellicode.com/docs/quickstart) for a how-to) and transform that JSON structure to a TypeScript definition.

The second overload accepts a [class](https://www.yellicode.com/docs/api/model/class) instance from a Yellicode model and accepts an optional `ClassOptions` 
object to control code generation (internally, the Yellicode class is transformed to a `ClassDefinition`). 

## Examples
*Note: a ZIP archive with working examples is also [available for download here](https://github.com/yellicode/yellicode-typescript/blob/master/examples/yellicode-typescript-examples.zip).*

### Example using a TypeScript code definition
This sample creates a simple TypeScript definition of a *Task* class, which is then provided to the `TypeScriptWriter`. You would typically create this definition from another structure (your own JSON model, using the 'model' parameter).

```ts
import { Generator, TextWriter } from '@yellicode/templating';
import { TypeScriptWriter, ClassDefinition } from '@yellicode/typescript';

Generator.generate({ outputFile: './custom-sample.ts' }, (output: TextWriter) => {    
    const classDefinition: ClassDefinition = {
        name: 'Task',
        export: true,
        description: ['Represents an activity to be done.']
    };

    classDefinition.properties = [
        { name: 'TaskDescription', typeName: 'string', accessModifier: 'public', description: ['Gets or sets a description of the task.'] },
        { name: 'IsFinished', typeName: 'boolean', accessModifier: 'public', description: ['Indicates if the task is finished.'] }
    ];

    const ts = new TypeScriptWriter(output);
    ts.writeClassBlock(classDefinition, () => {
        classDefinition.properties.forEach(p => {
            ts.writeProperty(p);
            ts.writeLine();
        })
    });
});

```
The generated TypeScript code will look as follows:
```typescript
/**
* Represents an activity to be done.
*/
export class Task {
	/**
	* Gets or sets a description of the task.
	*/
	public TaskDescription: string;

	/**
	* Indicates if the task is finished.
	*/
	public IsFinished: boolean;
}
```
### Example using a Yellicode model
For navigating a Yellicode model in template code, you should also have the *@yellicode/elements* package installed in your working directory:
```
npm install @yellicode/elements --save-dev
```

This template generates a TypeScript code file with all classes in the model and, for each class, write property for each class attribute.

```ts
import { Generator, TextWriter } from '@yellicode/templating';
import { TypeScriptWriter } from '@yellicode/typescript';
import * as elements from '@yellicode/elements';

Generator.generateFromModel({ outputFile: './model-based-sample.ts' }, (output: TextWriter, model: elements.Model) => {
    const ts = new TypeScriptWriter(output);

    model.getAllClasses().forEach(cls => {
        ts.writeClassBlock(cls, () => {
            cls.ownedAttributes.forEach(att => {
                ts.writeProperty(att);
                ts.writeLine();
            });
        }, { export: true });
        ts.writeLine();
    });
});  
```

## API Documentation
For all TypeScriptWriter functions and options, check out the [API documentation](https://github.com/yellicode/yellicode-typescript/blob/master/docs/api.md).