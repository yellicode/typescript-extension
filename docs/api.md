## Contents
* [ClassDefinition](#class-definition) interface
* [ClassFeatures](#class-features) enumeration
* [ClassOptions](#class-options) interface
* [DefinitionBase](#definition-base) interface
* [EnumDefinition](#enum-definition) interface
* [EnumFeatures](#enum-features) enumeration
* [EnumMemberDefinition](#enum-member-definition) interface
* [EnumOptions](#enum-options) interface
* [FunctionDefinition](#function-definition) interface
* [FunctionFeatures](#function-features) enumeration
* [FunctionOptions](#function-options) interface
* [InterfaceDefinition](#interface-definition) interface
* [InterfaceFeatures](#interface-features) enumeration
* [InterfaceOptions](#interface-options) interface
* [OptionalityModifier](#optionality-modifier) enumeration
* [ParameterDefinition](#parameter-definition) interface
* [ParameterFeatures](#parameter-features) enumeration
* [PropertyDefinition](#property-definition) interface
* [PropertyFeatures](#property-features) enumeration
* [PropertyOptions](#property-options) interface
* [StringLiteralOptions](#string-literal-options) interface
* [TypeDefinition](#type-definition) interface
* [TypeScriptWriter](#type-script-writer) class
* [WriterOptions](#writer-options) interface
## <a name="class-definition"></a> ClassDefinition interface
Represents a TypeScript class.

### ClassDefinition.description: string
Gets the description of the element. This field is optional.
### ClassDefinition.name: string
Get or sets the name of the code element. This field is required.
### ClassDefinition.declare: boolean
Indicates if the 'declare' keyword should be written. The default value is false.
### ClassDefinition.export: boolean
Indicates if the 'export' keyword should be written. The default value is false.
### ClassDefinition.extends: string
Contains the names of the classes that the class inherits from. 
This field is optional.
### ClassDefinition.implements: string
Contains the names of the interfaces that the class implements. 
This field is optional.
### ClassDefinition.isAbstract: boolean
Indicates if the class should contain the 'abstract' keyword. 
The default value is false.
### ClassDefinition.properties: PropertyDefinition
Gets the class properties.

## <a name="class-features"></a> ClassFeatures enumeration

* None
* JsDocDescription
* Generalizations
* InterfaceRealizations
* All

## <a name="class-options"></a> ClassOptions interface

### ClassOptions.declare: boolean
True if the class definition should contain the 'declare' keyword.
### ClassOptions.export: boolean
Indicates if the class must be exported or not (using the 'export' keyword).
By default, the class is exported only if it has public or package visibility.
### ClassOptions.features: ClassFeatures
Defines the class features to write. The default is ClassFeatures.All.
### ClassOptions.implements: string
Any additional interface names that the class should implement.
### ClassOptions.inherits: string
Any additional class names that the class should inherit from.
### ClassOptions.prefix: string
Any string to prefix the class keyword with, such as "export".
Indicates if the class must be exported or not (using the 'export' keyword).
By default, the class is exported only if it has public or package visibility.    

## <a name="definition-base"></a> DefinitionBase interface
The base interface for all TypeScript definitions. 

### DefinitionBase.description: string
Gets the description of the element. This field is optional.
### DefinitionBase.name: string
Get or sets the name of the code element. This field is required.

## <a name="enum-definition"></a> EnumDefinition interface
Represents a TypeScript enumeration.

### EnumDefinition.description: string
Gets the description of the element. This field is optional.
### EnumDefinition.name: string
Get or sets the name of the code element. This field is required.
### EnumDefinition.declare: boolean
Indicates if the 'declare' keyword should be written. The default value is false.
### EnumDefinition.export: boolean
Indicates if the 'export' keyword should be written. The default value is false.
### EnumDefinition.members: EnumMemberDefinition
Contains the enumeration members. This field is optional.

## <a name="enum-features"></a> EnumFeatures enumeration

* None
* JsDocDescription
* Initializers
* All

## <a name="enum-member-definition"></a> EnumMemberDefinition interface
Represents a TypeScript enumeration member.

### EnumMemberDefinition.description: string
Gets the description of the element. This field is optional.
### EnumMemberDefinition.name: string
Get or sets the name of the code element. This field is required.
### EnumMemberDefinition.value: any
The value of the member, which can either be a number or a string.
This field is optional. If this field has a value, an initializer
will be written. 

## <a name="enum-options"></a> EnumOptions interface

### EnumOptions.declare: boolean
True if the class definition should contain the 'declare' keyword.
### EnumOptions.export: boolean
Indicates if the class must be exported or not (using the 'export' keyword).
By default, the class is exported only if it has public or package visibility.
### EnumOptions.features: EnumFeatures
### EnumOptions.prefix: string
Any string to prefix the enum keyword with, such as "export".
Indicates if the class must be exported or not (using the 'export' keyword).
By default, the class is exported only if it has public or package visibility.    

## <a name="function-definition"></a> FunctionDefinition interface
Represents a TypeScript function.

### FunctionDefinition.description: string
Gets the description of the element. This field is optional.
### FunctionDefinition.name: string
Get or sets the name of the code element. This field is required.
### FunctionDefinition.accessModifier: any
Gets the function's access modifier. By default, no access modifier will be written.
### FunctionDefinition.isAbstract: boolean
Indicates if the function should be generated as an 'abstract' function. 
The default value is false.
### FunctionDefinition.isStatic: boolean
Indicates if the function is static. The default value is false.
### FunctionDefinition.parameters: ParameterDefinition
Gets the function's input parameters.
### FunctionDefinition.returnsOptional: boolean
Indicates if the return value is optional. If true, the return type will be generated
as a null union type (e.g. 'string | null').
### FunctionDefinition.returnTypeName: string
The full type name of the function return type. If the function returns a collection,
the collection must be part of the name (e.g. 'string[]'). If this value is empty, 
the function will return 'void'. 

## <a name="function-features"></a> FunctionFeatures enumeration

* None
* JsDocDescription
* AccessModifier
* OptionalModifier
* All

## <a name="function-options"></a> FunctionOptions interface

### FunctionOptions.features: FunctionFeatures
### FunctionOptions.parameterFeatures: ParameterFeatures
### FunctionOptions.parameterOptionality: OptionalityModifier
Indicates what to write when an input parameters has a lower bound of 0. The default is OptionalityModifier.NullKeyword.
### FunctionOptions.returnOptionality: OptionalityModifier
Indicates what to write when the return parameter has a lower bound of 0. The default is OptionalityModifier.NullKeyword.

## <a name="interface-definition"></a> InterfaceDefinition interface
Represents a TypeScript interface.

### InterfaceDefinition.description: string
Gets the description of the element. This field is optional.
### InterfaceDefinition.name: string
Get or sets the name of the code element. This field is required.
### InterfaceDefinition.declare: boolean
Indicates if the 'declare' keyword should be written. The default value is false.
### InterfaceDefinition.export: boolean
Indicates if the 'export' keyword should be written. The default value is false.
### InterfaceDefinition.extends: string
Contains the names of the interfaces that the interface inherits from. 
This field is optional.

## <a name="interface-features"></a> InterfaceFeatures enumeration

* None
* JsDocDescription
* Generalizations
* All

## <a name="interface-options"></a> InterfaceOptions interface

### InterfaceOptions.declare: boolean
True if the interface definition should contain the 'declare' keyword.
### InterfaceOptions.export: boolean
Indicates if the interface must be exported or not (using the 'export' keyword).
By default, the interface is exported only if it has public or package visibility.
### InterfaceOptions.features: InterfaceFeatures
Defines the interface features to write. The default is InterfaceFeatures.All.
### InterfaceOptions.inherits: string
Any additional interface names that the interface should inherit from.
### InterfaceOptions.prefix: string
Any string to prefix the interface keyword with, such as "export".
Indicates if the class must be exported or not (using the 'export' keyword).
By default, the class is exported only if it has public or package visibility.    

## <a name="optionality-modifier"></a> OptionalityModifier enumeration
Defines options for dealing with elements that are 'optional', meaning that they have a lower bound of 0.

* Ignore

   Don't write any modifier. 
* NullKeyword

   Write a 'null' keyword, for example 'myProperty: string | null;';
* QuestionToken

   Write a question token, for example 'myProperty?: string;';

## <a name="parameter-definition"></a> ParameterDefinition interface
Represents a TypeScript function parameter.

### ParameterDefinition.description: string
Gets the description of the element. This field is optional.
### ParameterDefinition.name: string
Get or sets the name of the code element. This field is required.
### ParameterDefinition.isOptional: boolean
Indicates if the parameter is optional. If true, the parameter will be generated
as a null union type (e.g. 'myParameter: string | null'), unless useQuestionToken
is true.
### ParameterDefinition.isReturn: boolean
Indicates if the parameter is a return parameter. The return parameter will 
not be written as a function parameter, but is used to write a JSDoc '@returns' comment.
### ParameterDefinition.typeName: string
The full type name of the parameter. If the type is a collection,
the collection must be part of the name (e.g. 'string[]').
### ParameterDefinition.useQuestionToken: boolean
Indicates if an optional parameter must be generated using a question token
instead of using a null union type.

## <a name="parameter-features"></a> ParameterFeatures enumeration

* None
* JsDocDescription
* OptionalModifier
* All

## <a name="property-definition"></a> PropertyDefinition interface
Represents a TypeScript property.

### PropertyDefinition.description: string
Gets the description of the element. This field is optional.
### PropertyDefinition.name: string
Get or sets the name of the code element. This field is required.
### PropertyDefinition.accessModifier: any
Gets the property's access modifier. By default, no access modifier will be written.
### PropertyDefinition.defaultValue: string
The default value of the property. If provided, an intitializer will be written. 
If the propery is a string property, defaultValue must be quoted string. 
This field is optional.
### PropertyDefinition.hasNullUnionType: boolean
Indicates if the property can be null. If true, '| null' will be appended to the typeName
and the question mark will be omitted (e.g. 'FirstName: string|null'). This field is ignored if 
isOptional is falsy. The default value is false.
### PropertyDefinition.isOptional: boolean
Indicates if the property is optional. If true, a question mark will be appended to the name 
(e.g. 'FirstName?: string'), unless hasNullUnionType is true. The default value is false.
### PropertyDefinition.isReadonly: boolean
Indicates if the property is readonly. The default value is false.
### PropertyDefinition.isStatic: boolean
Indicates if the property is static. The default value is false.
### PropertyDefinition.typeName: string
The full type name of the property. If the type is an array,
the collection must be part of the name (e.g. 'Array<string>'
or 'string[]').
### PropertyDefinition.useDefiniteAssignmentAssertionModifier: boolean
Writes the so-called 'definite assignment assertion modifier' for the property if the property is required. 
There are certain scenarios where properties can be initialized indirectly (perhaps by a helper method or dependency injection library), 
in which case you can use the definite assignment assertion modifiers for your properties.
The default value is false. This field is ignored if the property to write has a default value. 

## <a name="property-features"></a> PropertyFeatures enumeration

* None
* JsDocDescription
* AccessModifier
* ReadonlyModifier
* OptionalModifier
* Initializer
* DefiniteAssignmentAssertionModifier

   Writes the so-called 'definite assignment assertion modifier' for the property if the property is required. 
There are certain scenarios where properties can be initialized indirectly (perhaps by a helper method or dependency injection library), 
in which case you can use the definite assignment assertion modifiers for your properties.
* All
* AllInterfaceProperty

   Include all features, except the ones that are not usable on interface properties.

## <a name="property-options"></a> PropertyOptions interface

### PropertyOptions.features: PropertyFeatures
Defines the property features to write. The default is PropertyFeatures.All.
### PropertyOptions.initializeArray: boolean
Set to true to initialize an array property with an empty array, or with null if the property is optional (has a lower bound of 0) 
and optionality is OptionalityModifier.NullKeyword. The default value is false.
### PropertyOptions.initializePrimitiveType: boolean
Set to true to initialize a primitive property (Boolean, Number and String) with the type's default value (false, 0 and '') in case it is required and
doesn't have a default value in the model. If the property doesn't have a default value in the model, is optional and optionality is 
OptionalityModifier.NullKeyword, the property will be initialized with 'null'. The default value is false.
### PropertyOptions.optionality: OptionalityModifier
Indicates how to deal with properties that have a lower bound of 0. The default is OptionalityModifier.QuestionToken.

## <a name="string-literal-options"></a> StringLiteralOptions interface

### StringLiteralOptions.declare: boolean
True if the literal definition should contain the 'declare' keyword.
### StringLiteralOptions.export: boolean
Indicates if the literal must be exported or not (using the 'export' keyword).
By default, the literal is exported only if the enum has public or package visibility.

## <a name="type-definition"></a> TypeDefinition interface
The base interface for class-, interface and enumeration definitions.

### TypeDefinition.description: string
Gets the description of the element. This field is optional.
### TypeDefinition.name: string
Get or sets the name of the code element. This field is required.
### TypeDefinition.declare: boolean
Indicates if the 'declare' keyword should be written. The default value is false.
### TypeDefinition.export: boolean
Indicates if the 'export' keyword should be written. The default value is false.

## <a name="type-script-writer"></a> TypeScriptWriter class
Provides code writing functionality specific for TypeScript. 

### TypeScriptWriter.maxCommentWidth: any
### TypeScriptWriter.getTypeName(type) : string
Gets the name of the type. This function uses the current typeNameProvider for resolving
the type name.
Gets the type name of the typed element. This function uses the current typeNameProvider for resolving
the type name.
* type: Type

   Any element that derives from Type.
### TypeScriptWriter.getTypeName(typedElement) : string
Gets the name of the type. This function uses the current typeNameProvider for resolving
the type name.
Gets the type name of the typed element. This function uses the current typeNameProvider for resolving
the type name.
* typedElement: TypedElement

   Any element that has a type, such as a Property or Parameter.
### TypeScriptWriter.writeClassBlock(cls, contents) : this
Writes a block of code, wrapped in a class declaration and opening and closing brackets. 
This function does not write class members.
Writes a block of code, wrapped in a class declaration and opening and closing brackets. 
This function does not write class members.   
* cls: [ClassDefinition](#class-definition)
* contents: (writer: TypeScriptWriter) => void

   A callback function that writes the class contents.   
### TypeScriptWriter.writeClassBlock(cls, contents, options) : this
Writes a block of code, wrapped in a class declaration and opening and closing brackets. 
This function does not write class members.
Writes a block of code, wrapped in a class declaration and opening and closing brackets. 
This function does not write class members.   
* cls: Type
* contents: (writer: TypeScriptWriter) => void

   A callback function that writes the class contents.
* options: [ClassOptions](#class-options)

   An optional ClassOptions object.
### TypeScriptWriter.writeCodeBlock(contents) : this
Writes an indented block of code, wrapped in opening and closing brackets. 
* contents: (writer: TypeScriptWriter) => void

   A callback function that writes the contents.
### TypeScriptWriter.writeDecoratorCodeBlock(decoratorName, contents) : this
Writes an indented block of decorator code, wrapped in opening and closing brackets. 
* decoratorName: string
* contents: (writer: TypeScriptWriter) => void

   A callback function that writes the contents.
### TypeScriptWriter.writeEnumeration(enumeration, options) : this
Writes a full enumeration, including members.   
Writes a full enumeration, including members.   
* enumeration: Enumeration
* options: [EnumOptions](#enum-options)

   An optional EnumerationOptions object.
### TypeScriptWriter.writeEnumeration(enumeration) : this
Writes a full enumeration, including members.   
Writes a full enumeration, including members.   
* enumeration: [EnumDefinition](#enum-definition)
### TypeScriptWriter.writeFunctionBlock(func, contents) : this
Writes a block of code, wrapped in an function declaration and opening and closing brackets. 
Writes a block of code, wrapped in an function declaration and opening and closing brackets.  
* func: [FunctionDefinition](#function-definition)

   The operation. 
* contents: (writer: TypeScriptWriter, op: Operation) => void

   A callback that writes the operation contents.  
### TypeScriptWriter.writeFunctionBlock(operation, contents, options) : this
Writes a block of code, wrapped in an function declaration and opening and closing brackets. 
Writes a block of code, wrapped in an function declaration and opening and closing brackets.  
* operation: Operation

   The operation. 
* contents: (writer: TypeScriptWriter, op: Operation) => void

   A callback that writes the operation contents.
* options: [FunctionOptions](#function-options)

   An optional FunctionOptions object.
### TypeScriptWriter.writeFunctionDeclaration(funct) : this
Writes a function declaration without a body.     
Writes a function declaration without a body.     
* funct: [FunctionDefinition](#function-definition)
### TypeScriptWriter.writeFunctionDeclaration(operation, options) : this
Writes a function declaration without a body.     
Writes a function declaration without a body.     
* operation: Operation

   The operation. 
* options: [FunctionOptions](#function-options)

   An optional FunctionOptions object.
### TypeScriptWriter.writeImports(moduleName, exports) : this
Writes an import statement that imports the specified exports from the
specified module. 
* moduleName: string
* exports: any
### TypeScriptWriter.writeImports(moduleName, alias) : this
Writes an import statement that imports the specified exports from the
specified module. 
* moduleName: string

   The module to import from.
* alias: string

   The alias under which the module should be imported.
### TypeScriptWriter.writeInterfaceBlock(iface, contents, options) : this
Writes a block of code, wrapped in an interface declaration and opening and closing brackets. 
This function does not write interface members.
Writes a block of code, wrapped in an interface declaration and opening and closing brackets. 
This function does not write interface members.
* iface: Type
* contents: (writer: TypeScriptWriter) => void

   A callback function that writes the interface contents.
* options: [InterfaceOptions](#interface-options)

   An optional InterfaceOptions object.
### TypeScriptWriter.writeInterfaceBlock(iface, contents) : this
Writes a block of code, wrapped in an interface declaration and opening and closing brackets. 
This function does not write interface members.
Writes a block of code, wrapped in an interface declaration and opening and closing brackets. 
This function does not write interface members.
* iface: [InterfaceDefinition](#interface-definition)

   The interface.
* contents: (writer: TypeScriptWriter) => void

   A callback function that writes the interface contents.     
### TypeScriptWriter.writeJsDocDescription(text) : this
* text: string
### TypeScriptWriter.writeJsDocDescription(comments) : this
* comments: Comment
### TypeScriptWriter.writeJsDocLines(lines) : this
* lines: string
### TypeScriptWriter.writeJsDocParagraph(text) : this
* text: string
### TypeScriptWriter.writeProperty(property, options) : this
Writes a property from the property definition.
Writes a class or interface property.
* property: Property

   The property to write.
* options: [PropertyOptions](#property-options)

   An optional PropertyOptions object.
### TypeScriptWriter.writeProperty(property) : this
Writes a property from the property definition.
Writes a class or interface property.
* property: [PropertyDefinition](#property-definition)
### TypeScriptWriter.writeRegionBlock(name, contents) : this
Writes a block of code wrapped in a #region block.      
* name: string
* contents: (writer: TypeScriptWriter) => void
### TypeScriptWriter.writeStringLiteralType(enumeration, options) : this
Writes a string literal type from a specified enumeration. Example: 'type Easing = 'ease-in' | 'ease-out' | 'ease-in-out';'     
* enumeration: Enumeration

   The enumeration.     
* options: [StringLiteralOptions](#string-literal-options)

## <a name="writer-options"></a> WriterOptions interface

### WriterOptions.maxCommentWidth: integer
The maximum width of generated documentation comments before they are word-wrapped.
The default value is 100 characters.
### WriterOptions.typeNameProvider: TypeNameProvider
Sets an optional TypeNameProvider. By default, the TypeScriptTypeNameProvider is used.

