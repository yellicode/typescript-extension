﻿import * as elements from '@yellicode/elements';
import * as opts from './options';

import { CodeWriter, TextWriter, CodeWriterUtility, TypeNameProvider, NameUtility } from '@yellicode/templating';
import { TypeScriptTypeNameProvider } from './typescript-type-name-provider';
import { ClassDefinition, InterfaceDefinition, EnumDefinition, PropertyDefinition, FunctionDefinition, ParameterDefinition } from './model';
import { DefinitionBuilder } from './definition-builder';

/**
 * Provides code writing functionality specific for TypeScript. 
 */
export class TypeScriptWriter extends CodeWriter {
    private typeNameProvider: TypeNameProvider;
    private definitionBuilder: DefinitionBuilder;

    public maxCommentWidth: number;

    constructor(writer: TextWriter, options?: opts.WriterOptions) {
        super(writer);
        if (!options) options = {};

        this.typeNameProvider = options.typeNameProvider || new TypeScriptTypeNameProvider();
        this.definitionBuilder = new DefinitionBuilder(this.typeNameProvider);
        this.maxCommentWidth = options.maxCommentWidth || 100;
    }

    /**
     * Writes a block of code wrapped in a #region block.      
     */
    public writeRegionBlock(name: string, contents: (writer: TypeScriptWriter) => void): this {
        this.writeLine(`//#region ${name}`);
        contents(this);
        this.writeLine(`//#endregion ${name}`);
        return this;
    }

    /**
     * Writes an import statement that imports the specified exports from the
     * specified module. 
     * @param moduleName The module to import from.
     * @param exports The name(s) of the export(s) to be imported.
     * @param alias The alias under which the module should be imported.
     */
    public writeImports(moduleName: string, alias: string): void
    public writeImports(moduleName: string, ...exports: any[]): void
    public writeImports(moduleName: string, x: any): void {
        if (!moduleName)
            return;

        // Ensure forward slashes in the module name
        moduleName = moduleName.replace(/\\/g, "/");

        if (x instanceof Array) {
            if (x.length === 0) return;
            this.writeLine(`import { ${x.join(', ')} } from '${moduleName}';`);
            return;
        }
        // x is the alias
        if (!x) {
            x = TypeScriptWriter.makeSafeModuleName(moduleName);
        }
        this.writeLine(`import * as ${x} from '${moduleName}';`);
    }

    /**
    * Writes an indented block of decorator code, wrapped in opening and closing brackets. 
    * @param contents A callback function that writes the contents.
    */
    public writeDecoratorCodeBlock(decoratorName: string, contents: (writer: TypeScriptWriter) => void): void {
        this.writeLine(`@${decoratorName}({`);
        this.increaseIndent();
        if (contents) contents(this);
        this.decreaseIndent();
        this.writeLine('})');
    }

    /**
    * Writes an indented block of code, wrapped in opening and closing brackets. 
    * @param contents A callback function that writes the contents.
    */
    public writeCodeBlock(contents: (writer: TypeScriptWriter) => void): void {
        this.writeLine('{');
        this.increaseIndent();
        if (contents) contents(this);
        this.decreaseIndent();
        this.writeLine('}');
    };

    /**
    * Writes a block of code, wrapped in a class declaration and opening and closing brackets. 
    * This function does not write class members.
    * @param definition The class definition.   
    * @param contents A callback function that writes the class contents.   
    */
    public writeClassBlock(cls: ClassDefinition, contents: (writer: TypeScriptWriter) => void): void
    /**
     * Writes a block of code, wrapped in a class declaration and opening and closing brackets. 
    * This function does not write class members.   
    * @param type A model type from which to create the class block.
    * @param contents A callback function that writes the class contents.
    * @param options An optional ClassOptions object.
    */
    public writeClassBlock(cls: elements.Type, contents: (writer: TypeScriptWriter) => void, options?: opts.ClassOptions): void
    public writeClassBlock(cls: any, contents: (writer: TypeScriptWriter) => void, options?: opts.ClassOptions): void {
        if (!cls) return;

        let definition: ClassDefinition;
        if (elements.isType(cls)) {
            definition = this.definitionBuilder.buildClassDefinition(cls, options);
        }
        else definition = cls;

        if (definition.description) {
            this.writeJsDocLines(definition.description);
        }
        this.writeIndent();
        if (definition.export) {
            this.write(`export `);
        }
        if (definition.declare) {
            this.write('declare ');
        }
        if (definition.isAbstract) {
            this.write('abstract ');
        }
        this.write(`class ${definition.name}`);
        if (definition.extends) {
            this.writeExtends(definition.extends);
        }
        if (definition.implements) {
            this.writeImplements(definition.implements);
        }
        // Write the contents
        this.writeEndOfLine(' {');
        this.increaseIndent();
        if (contents) contents(this);
        this.decreaseIndent();
        this.writeLine('}');
    }

    /**
      * Writes a block of code, wrapped in an interface declaration and opening and closing brackets. 
      * This function does not write interface members.
      * @param iface The interface.
      * @param contents A callback function that writes the interface contents.     
      */
    public writeInterfaceBlock(iface: InterfaceDefinition, contents: (writer: TypeScriptWriter) => void): void
    /**
     * Writes a block of code, wrapped in an interface declaration and opening and closing brackets. 
     * This function does not write interface members.
     * @param type A model type from which to create the interface block.
     * @param contents A callback function that writes the interface contents.
     * @param options An optional InterfaceOptions object.
     */
    public writeInterfaceBlock(iface: elements.Type, contents: (writer: TypeScriptWriter) => void, options?: opts.InterfaceOptions): void
    public writeInterfaceBlock(iface: any, contents: (writer: TypeScriptWriter) => void, options?: opts.InterfaceOptions): void {
        if (!iface) return;

        let definition: InterfaceDefinition;
        if (elements.isType(iface)) {
            definition = this.definitionBuilder.buildInterfaceDefinition(iface, options);
        }
        else definition = iface;

        if (definition.description) {
            this.writeJsDocLines(definition.description);
        }
        this.writeIndent();
        if (definition.export) {
            this.write(`export `);
        }
        if (definition.declare) {
            this.write('declare ');
        }

        this.write(`interface ${definition.name}`);
        if (definition.extends) {
            this.writeExtends(definition.extends);
        }

        // Write the contents
        this.writeEndOfLine(' {');
        this.increaseIndent();
        if (contents) contents(this);
        this.decreaseIndent();
        this.writeLine('}');
    }

    /**
     * Writes a property from the property definition.
     * @param property 
     */
    public writeProperty(property: PropertyDefinition): void
    /**
     * Writes a class or interface property.
     * @param property The property to write.
     * @param options An optional PropertyOptions object.
     */
    public writeProperty(property: elements.Property, options?: opts.PropertyOptions): void
    public writeProperty(property: any, options?: opts.PropertyOptions): void {
        if (!property) return;

        let definition: PropertyDefinition;
        if (elements.isProperty(property)) {
            definition = this.definitionBuilder.buildPropertyDefinition(property, options);
        }
        else definition = property;

        const hasDefaultValue = definition.defaultValue != null; // '!= null' to allow for empty strings

        // Description
        if (definition.description) {
            this.writeJsDocLines(definition.description);
        }
        // Start a new, indented line        
        this.writeIndent();
        // Access modifier 
        if (definition.accessModifier) {
            this.write(`${definition.accessModifier} `);
        }
        // Static modifier        
        if (definition.isStatic) {
            this.write('static ');
        }
        // Readonly modifier
        if (definition.isReadonly) {
            this.write('readonly ');
        }
        // Name
        this.write(property.name);
        if (definition.isOptional && !definition.hasNullUnionType) {
            this.write('?');
        }
        if (!hasDefaultValue && !definition.isOptional && definition.useDefiniteAssignmentAssertionModifier) {
            this.write('!');
        }
        // Type
        this.write(`: ${definition.typeName}`);
        if (definition.isOptional && definition.hasNullUnionType) {
            this.write(' | null');
        }
        // Initializer
        if (hasDefaultValue) {
            this.write(` = ${definition.defaultValue}`);
        }
        this.writeEndOfLine(';');
    }

    /**
    * Writes a full enumeration, including members.   
    * @param element The enumeration.          
    */
    public writeEnumeration(enumeration: EnumDefinition): void
    /**
    * Writes a full enumeration, including members.   
    * @param element The enumeration.     
    * @param options An optional EnumerationOptions object.
    */
    public writeEnumeration(enumeration: elements.Enumeration, options?: opts.EnumOptions): void
    public writeEnumeration(enumeration: any, options?: opts.EnumOptions): void {
        if (!enumeration) return;

        let definition: EnumDefinition;
        if (elements.isType(enumeration)) {
            definition = this.definitionBuilder.buildEnumDefinition(enumeration, options);
        }
        else definition = enumeration;

        if (definition.description) {
            this.writeJsDocLines(definition.description);
        }
        this.writeIndent();
        if (definition.export) {
            this.write(`export `);
        }
        if (definition.declare) {
            this.write('declare ');
        }

        this.write(`enum ${enumeration.name}`);
        this.writeEndOfLine(' {');
        this.increaseIndent();

        if (!definition.members)
            return;

        for (let i = 0, len = definition.members.length; i < len; i++) {
            const member = definition.members[i];
            if (member.description) {
                this.writeJsDocLines(member.description);
            }
            this.writeIndent();
            this.write(member.name);
            if (member.value || member.value === 0) {
                const initialValue = (typeof member.value === "number") ?
                    member.value.toString() : `'${member.value}'`; // a string enum: wrap in quotes
                this.write(` = ${initialValue}`);
            }
            if (i < len - 1) {
                this.write(',');
            }
            this.writeEndOfLine();
        }
        this.decreaseIndent();
        this.writeLine('}');
    }

    /**
     * Writes a string literal type from a specified enumeration. Example: 'type Easing = 'ease-in' | 'ease-out' | 'ease-in-out';'     
     * @param enumeration The enumeration.     
     * @param prefix An optional prefix, such as 'export'.
     */
    public writeStringLiteralType(enumeration: elements.Enumeration, options?: opts.StringLiteralOptions): void {
        if (!enumeration) return;
        if (!options) options = {};

        this.writeJsDocDescription(enumeration.ownedComments);
        this.writeIndent();
        if (options.export) {
            this.write(`export `);
        }
        if (options.declare) {
            this.write('declare ');
        }
        this.write(`type ${enumeration.name} = `);
        this.joinWrite(enumeration.ownedLiterals, ' | ', lit => `'${lit.name}'`);
        this.writeEndOfLine(';');
    }

    /**
     * Writes a function declaration without a body.     
     * @param operation The function definition.      
     */
    public writeFunctionDeclaration(funct: FunctionDefinition): void
    /**
     * Writes a function declaration without a body.     
     * @param operation The operation. 
     * @param options An optional FunctionOptions object.
     */
    public writeFunctionDeclaration(operation: elements.Operation, options?: opts.FunctionOptions): void
    public writeFunctionDeclaration(func: any, options?: opts.FunctionOptions): void {
        if (!func) return;

        let definition: FunctionDefinition;
        if (elements.isOperation(func)) {
            definition = this.definitionBuilder.buildFunctionDefinition(func, options);
        }
        else definition = func;
        this.writeFunctionStart(definition);
        this.writeEndOfLine(';');
    }

    /**
    * Writes a block of code, wrapped in an function declaration and opening and closing brackets. 
    * @param func The operation. 
    * @param contents A callback that writes the operation contents.  
    */
    public writeFunctionBlock(func: FunctionDefinition, contents: (writer: TypeScriptWriter, op: elements.Operation) => void): void;
    /**
    * Writes a block of code, wrapped in an function declaration and opening and closing brackets.  
    * @param operation The operation. 
    * @param contents A callback that writes the operation contents.
    * @param options An optional FunctionOptions object.
    */
    public writeFunctionBlock(operation: elements.Operation, contents: (writer: TypeScriptWriter, op: elements.Operation) => void, options?: opts.FunctionOptions): void;
    public writeFunctionBlock(func: elements.Operation, contents: (writer: TypeScriptWriter, op: elements.Operation) => void, options?: opts.FunctionOptions): void {
        if (!func) return;

        let definition: FunctionDefinition;
        if (elements.isOperation(func)) {
            definition = this.definitionBuilder.buildFunctionDefinition(func, options);
        }
        else definition = func;
        this.writeFunctionStart(definition);
        if (definition.isAbstract) {
            this.writeEndOfLine(';');
            return;
        }
        this.writeEndOfLine();
        this.writeCodeBlock((writer) => { contents(writer, func) });
    }

    /**
     * Gets the name of the type. This function uses the current typeNameProvider for resolving
     * the type name.
     * @param type Any element that derives from Type.
     */
    public getTypeName(type: elements.Type | null): string | null;
    /**
    * Gets the type name of the typed element. This function uses the current typeNameProvider for resolving
    * the type name.
    * @param typedElement Any element that has a type, such as a Property or Parameter.
    */
    public getTypeName(typedElement: elements.TypedElement | null): string | null;
    public getTypeName(element: any | null): string | null {
        if (!element)
            return null;

        if (elements.isTypedElement(element)) {
            return this.typeNameProvider ? this.typeNameProvider.getTypeName(element) : element.getTypeName();
        }
        else if (elements.isType(element)) {
            return this.typeNameProvider ? this.typeNameProvider.getTypeName(element) : element.name;
        }
        return null;
    }

    private writeFunctionStart(definition: FunctionDefinition): void {
        // jsDoc tags 
        var jsDocLines: string[] = [];
        if (definition.description) {
            jsDocLines.push(...definition.description);
        }
        if (definition.parameters) {
            this.pushJsDocLinesForParameters(definition.parameters, jsDocLines);
        }
        this.writeJsDocLines(jsDocLines);

        // TODO: export, declare?!
        // if (definition.export) {
        //     this.write(`export `);
        // }
        // if (definition.declare) {
        //     this.write('declare ');
        // }

        // Start a new, indented line
        this.writeIndent();
        // Access modifier 
        if (definition.accessModifier) {
            this.write(`${definition.accessModifier} `);
        }
        // Static modifier                
        if (definition.isStatic) {
            this.write('static ');
        }
        else if (definition.isAbstract) {
            this.write('abstract ');
        }
        this.write(definition.name);

        // If needed, make the function optional using the '?'         
        // if (definition.isOptional) {
        //     this.write('?');
        // }

        this.write('(');
        if (definition.parameters) {
            this.writeInOutParameters(definition.parameters);
        }
        this.write('): ');

        // Write the return type                
        this.write(definition.returnTypeName || 'void');
        if (definition.returnsOptional) {
            this.write(' | null');
        }
    }

    private writeInOutParameters(parameters: ParameterDefinition[]): void {
        let i = 0;
        parameters.forEach((p: ParameterDefinition) => {
            if (p.isReturn)
                return;

            if (i > 0) {
                this.write(', ');
            }
            this.write(p.name);
            if (p.isOptional && (p.useQuestionToken)) {
                this.write('?');
            }
            this.write(`: ${p.typeName}`);
            if (p.isOptional && !p.useQuestionToken) {
                this.write(' | null');
            }
            i++;
        });
    }

    private writeExtends(ext: string[]): void {
        if (ext.length === 0)
            return;

        this.write(' extends ');
        this.joinWrite(ext, ', ', name => name);
    }

    private writeImplements(impl: string[]): void {
        if (impl.length === 0)
            return;

        this.write(' implements ');
        this.joinWrite(impl, ', ', name => name);
    }

    private pushJsDocLinesFromComments(comments: elements.Comment[], lines: string[]): void {
        if (!comments)
            return;

        let i = 0;
        comments.forEach((p: elements.Comment) => {
            if (!p.body) {
                return;
            }
            if (i > 0) {
                lines.push(''); // add a blank line
            }
            lines.push(p.body);
            i++;
        });
    }

    private pushJsDocLinesForParameters(parameters: ParameterDefinition[], lines: string[]): void {
        if (!parameters)
            return;

        parameters.forEach((p: ParameterDefinition) => {
            lines.push(this.getJsDocLineForParameter(p));
        });
    }

    private getJsDocLineForParameter(parameter: ParameterDefinition): string {
        const tag = parameter.isReturn ? 'returns' : 'param';
        let line = `@${tag} {${parameter.typeName}}`;
        if (!parameter.isReturn) {
            line = `${line} ${parameter.name}`;
        }
        if (parameter.description && parameter.description.length > 0) {
            line = `${line} ${parameter.description.join(' ')}`;
        }
        return line;
    }

    public writeJsDocDescription(comments: elements.Comment[]): void
    public writeJsDocDescription(text: string): void
    public writeJsDocDescription(data: any): void {
        const lines: string[] = [];
        if (typeof data == 'string') {
            lines.push(data);
        } else {
            this.pushJsDocLinesFromComments(data, lines);
        }
        this.writeJsDocLines(lines);
    }

    public writeJsDocParagraph(text: string) {
        this.writeJsDocLines([text]);
    }

    public writeJsDocLines(lines: string[]) {
        if (lines.length === 0)
            return;

        this.writeLine('/**');

        // Split here
        lines.forEach(line => {
            const lineLength = line ? line.length : 0;
            if (this.maxCommentWidth > 0 && lineLength > this.maxCommentWidth) {
                // See if we can split the line
                var split: string[] = CodeWriterUtility.wordWrap(line, this.maxCommentWidth);
                split.forEach(s => {
                    this.writeLine(`* ${s}`);
                })
            }
            else this.writeLine(`* ${line}`);
        });
        this.writeLine('*/');
    }

    private joinWrite<TItem>(collection: TItem[], separator: string, getStringFunc: (item: TItem) => string | null) {
        let isFirst: boolean = true;
        collection.forEach(c => {
            const value = getStringFunc(c);
            if (!value) return;
            if (isFirst) {
                isFirst = false;
            }
            else this.write(separator);
            this.write(value);
        });
    }

    /**
     * Makes a TypeScript safe alias for a ES6 module name.     
     */
    private static makeSafeModuleName(moduleName: string): string {
        if (moduleName.startsWith('@')) {
            moduleName = moduleName.substring(1);
        }
        const parts = moduleName.split('/');
        if (parts.length > 1) {
            // Make the module name lowerCamelCase, e.g. rename myScope/myModule to myScopeMyModule
            moduleName = NameUtility.upperToLowerCamelCase(parts[0]);
            parts.forEach((p, i) => {
                if (i > 0) {
                    moduleName += NameUtility.lowerToUpperCamelCase(p);
                }
            })
        }
        return moduleName;
    }
}