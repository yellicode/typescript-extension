export interface DefinitionBase {
    name: string;
    description?: string[];
}

export interface TypeDefinition extends DefinitionBase {    
    export?: boolean;
    declare?: boolean;
}

export interface ClassDefinition extends TypeDefinition {   
    isAbstract?: boolean;
    implements?: string[];
    extends?: string[];  
}

export interface EnumMemberDefinition extends DefinitionBase  {    
    value?: string | number;
}

export interface EnumDefinition extends TypeDefinition {
    members?: EnumMemberDefinition[];
}

export interface InterfaceDefinition extends TypeDefinition {
    extends?: string[];  
}