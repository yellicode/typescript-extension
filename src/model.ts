import { TypeScriptWriter } from './typescript-writer';

/**
 * Enumerates the valid TypeScript access modifiers.
 */
export type AccessModifier = 'public' | 'private' | 'protected';

export interface NamedDefinition {
    /**
     * Get or sets the name of the code element.
     */
    name: string;
}

/**
 * The base interface for all TypeScript definitions.
 */
export interface DefinitionBase {
    /**
    * Gets the description of the element. This field is optional.
    */
    description?: string[];
}

export interface HasJsDocTags {
    /**
     * Writes the @deprecated annotation, marking a symbol as being deprecated.
     */
    deprecated?: string;
}

/**
 * Defines a decorator.
 */
export interface DecoratorDefinition {
    /**
     * The name of the decorator to write (excluding the '@').
     */
    name: string;

    /**
     * True to write a decorator factory call that has 0 or more parameters.
     * This will write '@myDecorator()' instead of '@myDecorator'.
     * The default value is false.
     */
    hasParameters?: boolean;

    /**
     * An optional callback function or string that writes the
     * parameters. This field is ignored is hasParameters is false.
     */
    parameters?: ((writer: TypeScriptWriter) => void) | string;
}

/**
 * A base interface for definitions that support decorators.
 */
export interface Decoratable {
    /**
     * Contains 0 or more decorators to be written.
    */
    decorators?: DecoratorDefinition[];
}

/**
 * The base interface for class-, interface and enumeration definitions.
 */
export interface TypeDefinition extends DefinitionBase, NamedDefinition, HasJsDocTags {
    /**
     * Indicates if the 'export' keyword should be written. The default value is false.
     */
    export?: boolean;
    /**
     * Indicates if the 'declare' keyword should be written. The default value is false.
     */
    declare?: boolean;
}

/**
 * Defines a variable (let, var or const).
 */
export interface VariableDefinition extends DefinitionBase, NamedDefinition {
    /**
    * The full type name of the variable. If the type is an array,
    * the collection must be part of the name (e.g. 'Array<string>'
    * or 'string[]').
    */
    typeName: string;

    /**
     * The default value of the property. If provided, an intitializer will be written.
     * If the propery is a string property, defaultValue must be quoted string.
     * This field is optional.
     */
    initializer?: ((writer: TypeScriptWriter) => void) | string;

    /**
     * Exports the variable. Only set to true when declaring the variable
     * at module scope.
     */
    export?: boolean;

    /**
     * True if this variable is a declaration (e.g. "declare const myConst: string");
     * If true, any initializer will be ignored. The default value is false.
     */
    declare?: boolean;
}

/**
 * Represents a TypeScript property.
 */
export interface PropertyDefinition extends DefinitionBase, NamedDefinition, Decoratable, HasJsDocTags {
    /**
    * The full type name of the property. If the type is an array,
    * the collection must be part of the name (e.g. 'Array<string>'
    * or 'string[]').
    */
    typeName: string;
    /**
     * Gets the property's access modifier. By default, no access modifier will be written.
     */
    accessModifier?: AccessModifier;
    /**
     * Indicates if the property is readonly. The default value is false.
     */
    isReadonly?: boolean;
    /**
     * Indicates if the property is static. The default value is false.
     */
    isStatic?: boolean;
    /**
    * Indicates if the property is optional. If true, a question mark will be appended to the name
    * (e.g. 'FirstName?: string'), unless hasNullUnionType is true. The default value is false.
    */
    isOptional?: boolean;
    /**
     * Indicates if the property can be null. If true, '| null' will be appended to the typeName
     * and the question mark will be omitted (e.g. 'FirstName: string|null'). This field is ignored if
     * isOptional is falsy. The default value is false.
     */
    hasNullUnionType?: boolean;
    /**
     * Writes the so-called 'definite assignment assertion modifier' for the property if the property is required.
     * There are certain scenarios where properties can be initialized indirectly (perhaps by a helper method or dependency injection library),
     * in which case you can use the definite assignment assertion modifiers for your properties.
     * The default value is false. This field is ignored if the property to write has a default value.
     */
    useDefiniteAssignmentAssertionModifier?: boolean;
    /**
     * The default value of the property. If provided, an initializer will be written.
     * This field is optional.
     */
    defaultValue?: any | ((output: TypeScriptWriter) => void);
}

/**
 * Represents a TypeScript function parameter.
 */
export interface ParameterDefinition extends DefinitionBase, NamedDefinition {
    /**
     * The full type name of the parameter. If the type is a collection,
     * the collection must be part of the name (e.g. 'string[]').
     */
    typeName: string;

    /**
    * Indicates if the parameter is optional. If true, the parameter will be generated
    * as a null union type (e.g. 'myParameter: string | null'), unless useQuestionToken
    * is true.
    */
    isOptional?: boolean;

    /**
     * Indicates if the parameter is a return parameter. The return parameter will
     * not be written as a function parameter, but is used to write a JSDoc '@returns' comment.
     */
    isReturn?: boolean;

    /**
     * Indicates if an optional parameter must be generated using a question token
     * instead of using a null union type.
     */
    useQuestionToken?: boolean;

    /**
     * The parameter's access modifier. Only set this property for property assignment using
     * constructor arguments.
     */
    accessModifier?: AccessModifier;
}

/**
 * Represents a TypeScript function.
 */
export interface FunctionDefinition extends DefinitionBase, HasJsDocTags {
     /**
     * Get or sets the name of the function. This field is required,
     * except when isConstructor is true.
     */
    name?: string | 'constructor';
    /**
    * Gets the function's access modifier. By default, no access modifier will be written.
    */
    accessModifier?: AccessModifier;    
    /**
     * Indicates if the function should be generated as an 'abstract' function.
     * The default value is false.
     */
    isAbstract?: boolean;
    /**
     * Indicates if the function should be generated as an async function because it
     * contains one or more await statements.
     */
    isAsync?: boolean;
    /**
     * Indicates if the function is static. The default value is false.
     */
    isStatic?: boolean;
    /**
     * The full type name of the function return type. If the function returns a collection,
     * the collection must be part of the name (e.g. 'string[]'). If this value is empty,
     * the function will return 'void'.
     */
    returnTypeName?: string;
    /**
    * Indicates if the return value is optional. If true, the return type will be generated
    * as a null union type (e.g. 'string | null').
    */
    returnsOptional?: boolean;

    /**
     * Gets the function's input parameters.
     */
    parameters?: ParameterDefinition[];

    /**
     * Causes each parameter to be written on a separate line.
     */
    multiLineSignature?: boolean;

    /**
     * Indicates if the function is a constructor.
     */
    isConstructor?: boolean;
}

/**
 * Represents a TypeScript class.
 */
export interface ClassDefinition extends TypeDefinition, Decoratable {
    /**
     * Indicates if the class should contain the 'abstract' keyword.
     * The default value is false.
     */
    isAbstract?: boolean;
    /**
    * Contains the names of the interfaces that the class implements.
    * This field is optional.
    */
    implements?: string[];
    /**
     * Contains the names of the classes that the class inherits from.
     * This field is optional.
     */
    extends?: string[];
    /**
     * Gets the class properties.
     */
    properties?: PropertyDefinition[];
    /**
     * Gets the class functions.
     */
    functions?: FunctionDefinition[];
}

/**
 * Represents a TypeScript enumeration member.
 */
export interface EnumMemberDefinition extends DefinitionBase, NamedDefinition, HasJsDocTags {
    /**
     * The value of the member, which can either be a number or a string.
     * This field is optional. If this field has a value, an initializer
     * will be written.
     */
    value?: string | number;
}

/**
 * Represents a TypeScript enumeration.
 */
export interface EnumDefinition extends TypeDefinition {
    /**
     * Contains the enumeration members. This field is optional.
     */
    members?: EnumMemberDefinition[];
     /**
     * True if the enum should be a const enum. Const enums can only use constant enum expressions and
     * unlike regular enums they are completely removed during compilation.
     */
    const?: boolean;
}


/**
 * Represents a TypeScript interface.
 */
export interface InterfaceDefinition extends TypeDefinition {
    /**
    * Contains the names of the interfaces that the interface inherits from.
    * This field is optional.
    */
    extends?: string[];
     /**
     * Gets the interface properties.
     */
    properties?: PropertyDefinition[];
    /**
     * Gets the interface functions.
     */
    functions?: FunctionDefinition[];
}