## Contents
* [ClassDefinition](#class-definition) interface
* [ClassFeatures](#class-features) enumeration
* [ClassOptions](#class-options) interface
* [DefinitionBase](#definition-base) interface
* [EnumDefinition](#enum-definition) interface
* [EnumFeatures](#enum-features) enumeration
* [EnumMemberDefinition](#enum-member-definition) interface
* [EnumOptions](#enum-options) interface
* [FunctionFeatures](#function-features) enumeration
* [FunctionOptions](#function-options) interface
* [InterfaceDefinition](#interface-definition) interface
* [InterfaceFeatures](#interface-features) enumeration
* [InterfaceOptions](#interface-options) interface
* [OptionalityModifier](#optionality-modifier) enumeration
* [ParameterFeatures](#parameter-features) enumeration
* [PropertyFeatures](#property-features) enumeration
* [PropertyOptions](#property-options) interface
* [StringLiteralOptions](#string-literal-options) interface
* [TypeDefinition](#type-definition) interface
* [TypeScriptModelBuilder](#type-script-model-builder) class
* [TypeScriptWriter](#type-script-writer) class
* [TypeUtility](#type-utility) class
* [WriterOptions](#writer-options) interface
## <a name="class-definition"></a> ClassDefinition interface

### ClassDefinition.description: string
### ClassDefinition.name: string
### ClassDefinition.declare: boolean
### ClassDefinition.export: boolean
### ClassDefinition.extends: string
### ClassDefinition.implements: string
### ClassDefinition.isAbstract: boolean

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

### DefinitionBase.description: string
### DefinitionBase.name: string

## <a name="enum-definition"></a> EnumDefinition interface

### EnumDefinition.description: string
### EnumDefinition.name: string
### EnumDefinition.declare: boolean
### EnumDefinition.export: boolean
### EnumDefinition.members: EnumMemberDefinition

## <a name="enum-features"></a> EnumFeatures enumeration

* None
* JsDocDescription
* Initializers
* All

## <a name="enum-member-definition"></a> EnumMemberDefinition interface

### EnumMemberDefinition.description: string
### EnumMemberDefinition.name: string
### EnumMemberDefinition.value: any

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

### InterfaceDefinition.description: string
### InterfaceDefinition.name: string
### InterfaceDefinition.declare: boolean
### InterfaceDefinition.export: boolean
### InterfaceDefinition.extends: string

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

## <a name="parameter-features"></a> ParameterFeatures enumeration

* None
* JsDocDescription
* OptionalModifier
* All

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

### TypeDefinition.description: string
### TypeDefinition.name: string
### TypeDefinition.declare: boolean
### TypeDefinition.export: boolean

## <a name="type-script-model-builder"></a> TypeScriptModelBuilder class

### TypeScriptModelBuilder.buildClassDefinition(type, options) : ClassDefinition
* type: Type
* options: [ClassOptions](#class-options)
### TypeScriptModelBuilder.buildEnumDefinition(type, options) : EnumDefinition
* type: Type
* options: [EnumOptions](#enum-options)
### TypeScriptModelBuilder.buildInterfaceDefinition(type, options) : InterfaceDefinition
* type: Type
* options: [InterfaceOptions](#interface-options)
### TypeScriptModelBuilder.getDefaultValueString(element, typeName, defaultValue, isOptional, optionalityModifier, initializePrimitiveType, initializeArray) : string
* element: MultiplicityElement
* typeName: string
* defaultValue: ValueSpecification
* isOptional: boolean
* optionalityModifier: [OptionalityModifier](#optionality-modifier)
* initializePrimitiveType: boolean
* initializeArray: boolean

## <a name="type-script-writer"></a> TypeScriptWriter class
Provides code writing functionality specific for TypeScript. 

### TypeScriptWriter.maxCommentWidth: any
### TypeScriptWriter.getTypeName(typedElement) : string
Gets the name of the type. This function uses the current typeNameProvider for resolving
the type name.
Gets the type name of the typed element. This function uses the current typeNameProvider for resolving
the type name.
* typedElement: TypedElement

   Any element that has a type, such as a Property or Parameter.
### TypeScriptWriter.getTypeName(type) : string
Gets the name of the type. This function uses the current typeNameProvider for resolving
the type name.
Gets the type name of the typed element. This function uses the current typeNameProvider for resolving
the type name.
* type: Type

   Any element that derives from Type.
### TypeScriptWriter.writeClassBlock(cls, contents) : void
Writes a block of code, wrapped in a class declaration and opening and closing brackets. 
This function does not write class members.
Writes a block of code, wrapped in a class declaration and opening and closing brackets. 
This function does not write class members.   
* cls: [ClassDefinition](#class-definition)
* contents: (writer: TypeScriptWriter) => void

   A callback function that writes the class contents.   
### TypeScriptWriter.writeClassBlock(cls, contents, options) : void
Writes a block of code, wrapped in a class declaration and opening and closing brackets. 
This function does not write class members.
Writes a block of code, wrapped in a class declaration and opening and closing brackets. 
This function does not write class members.   
* cls: Type
* contents: (writer: TypeScriptWriter) => void

   A callback function that writes the class contents.
* options: [ClassOptions](#class-options)

   An optional ClassOptions object.
### TypeScriptWriter.writeCodeBlock(contents) : void
Writes an indented block of code, wrapped in opening and closing brackets. 
* contents: (writer: TypeScriptWriter) => void

   A callback function that writes the contents.
### TypeScriptWriter.writeDecoratorCodeBlock(decoratorName, contents) : void
Writes an indented block of decorator code, wrapped in opening and closing brackets. 
* decoratorName: string
* contents: (writer: TypeScriptWriter) => void

   A callback function that writes the contents.
### TypeScriptWriter.writeEnumeration(enumeration, options) : void
Writes a full enumeration, including members.   
Writes a full enumeration, including members.   
* enumeration: Enumeration
* options: [EnumOptions](#enum-options)

   An optional EnumerationOptions object.
### TypeScriptWriter.writeEnumeration(enumeration) : void
Writes a full enumeration, including members.   
Writes a full enumeration, including members.   
* enumeration: [EnumDefinition](#enum-definition)
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
### TypeScriptWriter.writeImports(moduleName, exports) : void
Writes an import statement that imports the specified exports from the
specified module. 
* moduleName: string
* exports: any
### TypeScriptWriter.writeImports(moduleName, alias) : void
Writes an import statement that imports the specified exports from the
specified module. 
* moduleName: string

   The module to import from.
* alias: string

   The alias under which the module should be imported.
### TypeScriptWriter.writeInterfaceBlock(iface, contents, options) : void
Writes a block of code, wrapped in an interface declaration and opening and closing brackets. 
This function does not write interface members.
Writes a block of code, wrapped in an interface declaration and opening and closing brackets. 
This function does not write interface members.
* iface: Type
* contents: (writer: TypeScriptWriter) => void

   A callback function that writes the interface contents.
* options: [InterfaceOptions](#interface-options)

   An optional InterfaceOptions object.
### TypeScriptWriter.writeInterfaceBlock(iface, contents) : void
Writes a block of code, wrapped in an interface declaration and opening and closing brackets. 
This function does not write interface members.
Writes a block of code, wrapped in an interface declaration and opening and closing brackets. 
This function does not write interface members.
* iface: [InterfaceDefinition](#interface-definition)

   The interface.
* contents: (writer: TypeScriptWriter) => void

   A callback function that writes the interface contents.     
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
### TypeScriptWriter.writeStringLiteralType(enumeration, options) : void
Writes a string literal type from a specified enumeration. Example: 'type Easing = 'ease-in' | 'ease-out' | 'ease-in-out';'     
* enumeration: Enumeration

   The enumeration.     
* options: [StringLiteralOptions](#string-literal-options)

## <a name="type-utility"></a> TypeUtility class

### TypeUtility.getPrimitiveTypeDefault(typeName) : string
* typeName: string
### TypeUtility.isPrimitiveType(typeName) : boolean
* typeName: string

## <a name="writer-options"></a> WriterOptions interface

### WriterOptions.maxCommentWidth: integer
The maximum width of generated documentation comments before they are word-wrapped.
The default value is 100 characters.
### WriterOptions.typeNameProvider: TypeNameProvider
Sets an optional TypeNameProvider. By default, the TypeScriptTypeNameProvider is used.

