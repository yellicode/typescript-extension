## Contents
* [ClassFeatures](#class-features) enumeration
* [ClassOptions](#class-options) interface
* [EnumFeatures](#enum-features) enumeration
* [EnumOptions](#enum-options) interface
* [FunctionFeatures](#function-features) enumeration
* [FunctionOptions](#function-options) interface
* [InterfaceFeatures](#interface-features) enumeration
* [InterfaceOptions](#interface-options) interface
* [OptionalityModifier](#optionality-modifier) enumeration
* [PropertyFeatures](#property-features) enumeration
* [PropertyOptions](#property-options) interface
* [TypeScriptWriter](#type-script-writer) class
* [WriterOptions](#writer-options) interface
## <a name="class-features"></a> ClassFeatures enumeration

* None
* JsDocDescription
* Generalizations
* InterfaceRealizations
* All
* AllExceptJsDoc

## <a name="class-options"></a> ClassOptions interface

### ClassOptions.features: ClassFeatures
Defines the class features to write. The default is ClassFeatures.All.
### ClassOptions.implements: string
Any additional interface names that the class should implement.
### ClassOptions.inherits: string
Any additional class names that the class should inherit from.
### ClassOptions.prefix: string
Any string to prefix the class keyword with, such as "export".

## <a name="enum-features"></a> EnumFeatures enumeration

* None
* JsDocDescription
* Initializers
* All
* AllExceptJsDoc

## <a name="enum-options"></a> EnumOptions interface

### EnumOptions.features: EnumFeatures
### EnumOptions.prefix: string

## <a name="function-features"></a> FunctionFeatures enumeration

* None
* Comments
* JsDocDescription
* JsDocParameters
* AccessModifier
* All
* AllExceptJsDoc

## <a name="function-options"></a> FunctionOptions interface

### FunctionOptions.features: FunctionFeatures
### FunctionOptions.parameterOptionality: OptionalityModifier
Indicates what to write when an input parameters has a lower bound of 0. The default is OptionalityModifier.NullKeyword.
### FunctionOptions.returnOptionality: OptionalityModifier
Indicates what to write when the return parameter has a lower bound of 0. The default is OptionalityModifier.NullKeyword.

## <a name="interface-features"></a> InterfaceFeatures enumeration

* None
* JsDocDescription
* Generalizations
* All
* AllExceptJsDoc

## <a name="interface-options"></a> InterfaceOptions interface

### InterfaceOptions.features: InterfaceFeatures
Defines the interface features to write. The default is InterfaceFeatures.All.
### InterfaceOptions.inherits: string
Any additional interface names that the interface should inherit from.
### InterfaceOptions.prefix: string
Any string to prefix the interface keyword with, such as "export".

## <a name="optionality-modifier"></a> OptionalityModifier enumeration
Defines options for dealing with elements that are 'optional', meaning that they have a lower bound of 0.

* Ignore

   Don't write any modifier. 
* NullKeyword

   Write a 'null' keyword, for example 'myProperty: string | null;';
* QuestionToken

   Write a question token, for example 'myProperty?: string;';

## <a name="property-features"></a> PropertyFeatures enumeration

* None
* JsDocDescription
* AccessModifier
* ReadonlyModifier
* OptionalModifier
* All
* AllExceptJsDoc

## <a name="property-options"></a> PropertyOptions interface

### PropertyOptions.features: PropertyFeatures
Defines the property features to write. The default is PropertyFeatures.All.
### PropertyOptions.optionality: OptionalityModifier
Indicates how to deal with properties that have a lower bound of 0. The default is OptionalityModifier.QuestionToken.

## <a name="type-script-writer"></a> TypeScriptWriter class
Provides code writing functionality specific for TypeScript. 

### TypeScriptWriter.maxCommentWidth: any
### TypeScriptWriter.writeClassBlock(cls, contents, options) : void
Writes a block of code, wrapped in a class declaration and opening and closing brackets. 
This function does not write class members.
* cls: Class

   The class.
* contents: (writer: TypeScriptWriter, cls: Class) => void

   A callback function that writes the class contents.
* options: [ClassOptions](#class-options)

   An optional ClassOptions object.
### TypeScriptWriter.writeCodeBlock(contents) : void
Writes an indented block of code, wrapped in opening and closing brackets. 
* contents: (writer: TypeScriptWriter) => void

   A callback function that writes the contents.
### TypeScriptWriter.writeEnumeration(enumeration, options) : void
Writes a full enumeration, including members.   
* enumeration: Enumeration
* options: [EnumOptions](#enum-options)

   An optional EnumerationOptions object.
### TypeScriptWriter.writeFunctionBlock(operation, contents, options) : void
Writes a block of code, wrapped in an function declaration and opening and closing brackets.      * 
* operation: Operation

   The operation. 
* contents: (writer: TypeScriptWriter, op: Operation) => void

   A callback that writes the operation contents.
* options: [FunctionOptions](#function-options)

   An optional FunctionOptions object.
### TypeScriptWriter.writeFunctionDeclaration(operation, options) : void
Writes a function declaration without a body.     
* operation: Operation

   The operation. 
* options: [FunctionOptions](#function-options)

   An optional FunctionOptions object.
### TypeScriptWriter.writeInterfaceBlock(iface, contents, options) : void
Writes a block of code, wrapped in an interface declaration and opening and closing brackets. 
This function does not write interface members.
* iface: Interface

   The interface.
* contents: (writer: TypeScriptWriter, cls: Interface) => void

   A callback function that writes the interface contents.
* options: [InterfaceOptions](#interface-options)

   An optional InterfaceOptions object.
### TypeScriptWriter.writeJsDocDescription(comments) : void
* comments: Comment
### TypeScriptWriter.writeJsDocDescription(text) : void
* text: string
### TypeScriptWriter.writeJsDocLines(lines) : void
* lines: string
### TypeScriptWriter.writeJsDocParagraph(text) : void
* text: string
### TypeScriptWriter.writeProperty(property, options) : void
Writes a class or interface property.
* property: Property

   The property to write.
* options: [PropertyOptions](#property-options)

   An optional PropertyOptions object.
### TypeScriptWriter.writeStringLiteralType(enumeration, prefix) : void
Writes a string literal type from a specified enumeration. Example: 'type Easing = 'ease-in' | 'ease-out' | 'ease-in-out';'     
* enumeration: Enumeration

   The enumeration.     
* prefix: string

   An optional prefix, such as 'export'.

## <a name="writer-options"></a> WriterOptions interface

### WriterOptions.maxCommentWidth: integer
The maximum width of generated documentation comments before they are word-wrapped.
The default value is 100 characters.
### WriterOptions.typeNameProvider: TypeNameProvider
Sets an optional TypeNameProvider. By default, the TypeScriptTypeNameProvider is used.

