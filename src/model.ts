export interface TypeDefinition {
    name: string;
    description?: string;
    export?: boolean;
    declare?: boolean;
    extends?: string[];  
}

export interface ClassDefinition extends TypeDefinition {   
    isAbstract?: boolean;
    implements?: string[];
}

export interface InterfaceDefinition extends TypeDefinition {

}