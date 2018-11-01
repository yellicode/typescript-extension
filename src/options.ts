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
    All = JsDocDescription | Initializers    
}

export interface EnumOptions {
    features?: EnumFeatures;
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
    * Any string to prefix the enum keyword with, such as "export".
    * Indicates if the class must be exported or not (using the 'export' keyword).
    * By default, the class is exported only if it has public or package visibility.    
    * @deprecated Use the 'export' or 'declare' option instead.
    */
    prefix?: string;    
}

export enum ClassFeatures {
    None = 0,
    JsDocDescription = 1 << 0,
    Generalizations = 1 << 1,
    InterfaceRealizations = 1 << 2,
    All = JsDocDescription | Generalizations | InterfaceRealizations 
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
    All = JsDocDescription | Generalizations 
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
    Initializer = 1 << 4,
    All = JsDocDescription | AccessModifier | ReadonlyModifier | OptionalModifier | Initializer    
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
    /**
    * Set to true to initialize an array property with an empty array, or with null if the property is optional (has a lower bound of 0) 
    * and optionality is OptionalityModifier.NullKeyword. The default value is false.
    */
    initializeArray?: boolean;
    /**
     * Set to true to initialize a primitive property (Boolean, Number and String) with the type's default value (false, 0 and '') in case it is required and
     * doesn't have a default value in the model. If the property doesn't have a default value in the model, is optional and optionality is 
     * OptionalityModifier.NullKeyword, the property will be initialized with 'null'. The default value is false.
     */
    initializePrimitiveType?: boolean;
}

export enum FunctionFeatures {
    None = 0,  
    JsDocDescription = 1 << 0,    
    AccessModifier = 1 << 1,
    OptionalModifier = 1 << 2,    
    All = JsDocDescription | AccessModifier | OptionalModifier
}

export enum ParameterFeatures {
    None = 0,    
    JsDocDescription = 1 << 0,       
    OptionalModifier = 1 << 1,    
    All = JsDocDescription | OptionalModifier 
}

export interface FunctionOptions {
    features?: FunctionFeatures;
    
    parameterFeatures?: ParameterFeatures;

    /**
     * Indicates what to write when the return parameter has a lower bound of 0. The default is OptionalityModifier.NullKeyword.
     */
    returnOptionality?: OptionalityModifier;
    /**
     * Indicates what to write when an input parameters has a lower bound of 0. The default is OptionalityModifier.NullKeyword.
     */
    parameterOptionality?: OptionalityModifier;
}