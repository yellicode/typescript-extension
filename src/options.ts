import { TypeNameProvider } from '@yellicode/templating';

/**
 * Defines options for dealing with elements that are 'optional', meaning that they have a lower bound of 0.
 */
export enum OptionalityModifier {
    /**
     * Don't write any modifier. 
     */
    Ignore = 0,
    /**
     * Write a 'null' keyword, for example 'myProperty: string | null;';
     */
    NullKeyword = 1 << 0,
    /**
     * Write a question token, for example 'myProperty?: string;';
     */
    QuestionToken = 1 << 1
}

export interface WriterOptions {
    /**
     * The maximum width of generated documentation comments before they are word-wrapped.
     * The default value is 100 characters.
     */
    maxCommentWidth?: number;

    /**
    * Sets an optional TypeNameProvider. By default, the TypeScriptTypeNameProvider is used.
    */
    typeNameProvider?: TypeNameProvider;
}

export enum EnumFeatures {
    None = 0,
    JsDocDescription = 1 << 0,
    Initializers = 1 << 1,
    All = JsDocDescription | Initializers,
    AllExceptJsDoc = Initializers
}

export interface EnumOptions {
    features?: EnumFeatures;
    prefix?: string;
}

export enum ClassFeatures {
    None = 0,
    JsDocDescription = 1 << 0,
    Generalizations = 1 << 1,
    InterfaceRealizations = 1 << 2,
    All = JsDocDescription | Generalizations | InterfaceRealizations,
    AllExceptJsDoc = Generalizations | InterfaceRealizations
}

export interface ClassOptions {
    /**
     * Defines the class features to write. The default is ClassFeatures.All.
     */
    features?: ClassFeatures;
    /**
    * Any additional interface names that the class should implement.
    */
    implements?: string[];
    /**
     * Any additional class names that the class should inherit from.
     */
    inherits?: string[];
    /**
     * Indicates if the class must be exported or not (using the 'export' keyword).
     * By default, the class is exported only if it has public or package visibility.
     */
    export?: boolean;
    /**
     * True if the class definition should contain the 'declare' keyword.
     */
    declare?: boolean;
    /** 
    * Any string to prefix the class keyword with, such as "export".
    * Indicates if the class must be exported or not (using the 'export' keyword).
    * By default, the class is exported only if it has public or package visibility.    
    * @deprecated Use the 'export' or 'declare' option instead.
    */
    prefix?: string;
}

export enum InterfaceFeatures {
    None = 0,
    JsDocDescription = 1 << 0,
    Generalizations = 1 << 1,
    All = JsDocDescription | Generalizations,
    AllExceptJsDoc = Generalizations
}

export interface InterfaceOptions {
    /**
    * Defines the interface features to write. The default is InterfaceFeatures.All.
    */
    features?: InterfaceFeatures;
    /**
    * Any additional interface names that the interface should inherit from.
    */
    inherits?: string[];
    /**
    * Indicates if the interface must be exported or not (using the 'export' keyword).
    * By default, the interface is exported only if it has public or package visibility.
    */
    export?: boolean;
    /**
     * True if the interface definition should contain the 'declare' keyword.
     */
    declare?: boolean;
    /** 
   * Any string to prefix the interface keyword with, such as "export".
   * Indicates if the class must be exported or not (using the 'export' keyword).
   * By default, the class is exported only if it has public or package visibility.    
   * @deprecated Use the 'export' or 'declare' option instead.
   */
    prefix?: string;
}

export enum PropertyFeatures {
    None = 0,
    JsDocDescription = 1 << 0,
    AccessModifier = 1 << 1,
    ReadonlyModifier = 1 << 2,
    OptionalModifier = 1 << 3,
    // Initializer = 1 << 4,
    All = JsDocDescription | AccessModifier | ReadonlyModifier | OptionalModifier /*| Initializer */,
    AllExceptJsDoc = AccessModifier | ReadonlyModifier | OptionalModifier /* | Initializer*/
}

export interface PropertyOptions {
    /**
     * Defines the property features to write. The default is PropertyFeatures.All.
     */
    features?: PropertyFeatures;
    /**
     * Indicates how to deal with properties that have a lower bound of 0. The default is OptionalityModifier.QuestionToken.
     */
    optionality?: OptionalityModifier;
}

export enum FunctionFeatures {
    None = 0,
    Comments = 1 << 0,
    JsDocDescription = 1 << 1,
    JsDocParameters = 1 << 2,
    AccessModifier = 1 << 3,
    All = Comments | JsDocDescription | JsDocParameters | AccessModifier,
    AllExceptJsDoc = AccessModifier
}

export interface FunctionOptions {
    features?: FunctionFeatures;
    /**
     * Indicates what to write when the return parameter has a lower bound of 0. The default is OptionalityModifier.NullKeyword.
     */
    returnOptionality?: OptionalityModifier;
    /**
     * Indicates what to write when an input parameters has a lower bound of 0. The default is OptionalityModifier.NullKeyword.
     */
    parameterOptionality?: OptionalityModifier;
}