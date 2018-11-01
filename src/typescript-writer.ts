import * as elements from '@yellicode/elements';
import * as opts from './options';

import { CodeWriter, TextWriter, CodeWriterUtility, TypeNameProvider, NameUtility } from '@yellicode/templating';
import { TypeScriptTypeNameProvider } from './typescript-type-name-provider';
import { ClassDefinition, InterfaceDefinition, EnumDefinition } from './model';
import { TypeScriptModelBuilder } from './model-builder';
import { TypeUtility } from './type-utility';
import { MultiplicityElement } from '@yellicode/elements';

/**
 * Provides code writing functionality specific for TypeScript. 
 */
export class TypeScriptWriter extends CodeWriter {
    private typeNameProvider: TypeNameProvider;
    public maxCommentWidth: number;

    constructor(writer: TextWriter, options?: opts.WriterOptions) {
        super(writer);
        if (!options) options = {};

        this.typeNameProvider = options.typeNameProvider || new TypeScriptTypeNameProvider();
        this.maxCommentWidth = options.maxCommentWidth || 100;
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
        moduleName = moduleName.replace(/\\/g,"/");
        
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
            definition = TypeScriptModelBuilder.buildClassDefinition(cls, options);
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
            definition = TypeScriptModelBuilder.buildInterfaceDefinition(iface, options);
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
     * Writes a class or interface property.
     * @param property The property to write.
     * @param options An optional PropertyOptions object.
     */
    public writeProperty(property: elements.Property, options?: opts.PropertyOptions): void {
        if (!property) return;
        if (!options) options = {};

        const features = (options.features === undefined) ? opts.PropertyFeatures.All : options.features;
        const optionalityModifier = (options.optionality === undefined) ? opts.OptionalityModifier.QuestionToken : options.optionality;
        const makeOptional = property.isOptional() ? !!(features & opts.PropertyFeatures.OptionalModifier) : false;
        const typeName = this.getTypeName(property);    
        const isOwnedByInterface = elements.isInterface(property.owner);
        const defaultValueString = ((features & opts.PropertyFeatures.Initializer) && !isOwnedByInterface) ? 
            TypeScriptModelBuilder.getDefaultValueString(property, typeName, property.defaultValue, makeOptional, optionalityModifier, options.initializePrimitiveType, options.initializeArray):
            null;        


        if (features & opts.PropertyFeatures.JsDocDescription) {
            this.writeJsDocDescription(property.ownedComments);
        }
        // Start a new, indented line        
        this.writeIndent();
        // Access modifier (+ white space)
        if ((features & opts.PropertyFeatures.AccessModifier) && !isOwnedByInterface) {
            this.writeAccessModifier(property.visibility);
        }
        // Readonly modifier
        if ((features & opts.PropertyFeatures.ReadonlyModifier) && property.isReadOnly || property.isDerived) {
            this.write('readonly ');
        }
        // The name
        this.write(property.name);
        if ((optionalityModifier & opts.OptionalityModifier.QuestionToken) && makeOptional) {
            this.write('?');
        }
        if ((features & opts.PropertyFeatures.DefiniteAssignmentAssertionModifier) && !makeOptional && !defaultValueString && !isOwnedByInterface) {
            this.write('!'); 
        }

        // The type  
        this.write(`: ${typeName || 'any'}`);
        if (property.isMultivalued()) {
            this.write('[]');
        }
        if (makeOptional && (optionalityModifier & opts.OptionalityModifier.NullKeyword)) {
            this.write(' | null');
        }

        // Initializer if not an interface and the model has a default value
        if (defaultValueString != null) {
            this.write(` = ${defaultValueString}`);
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
            definition = TypeScriptModelBuilder.buildEnumDefinition(enumeration, options);
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
        this.writeEndOfLine();
        this.writeCodeBlock(() => {            
            if (!definition.members)
                return;

            for (let i = 0, len = definition.members.length; i < len; i++) {
                const member = definition.members[i];
                if (member.description) {
                    this.writeJsDocLines(member.description);
                }
                this.writeIndent();
                this.write(member.name);
                if (member.value) {
                    const initialValue = (typeof member.value === "number") ?
                        member.value.toString() : `'${member.value}'`; // a string enum: wrap in quotes
                    this.write(` = ${initialValue}`);
                }
                if (i < len - 1) {
                    this.write(',');
                }
                this.writeEndOfLine();
            }
        });
    }
    
    /**
     * Writes a string literal type from a specified enumeration. Example: 'type Easing = 'ease-in' | 'ease-out' | 'ease-in-out';'     
     * @param enumeration The enumeration.     
     * @param prefix An optional prefix, such as 'export'.
     */
    public writeStringLiteralType(enumeration: elements.Enumeration, prefix?: string): void {
        this.writeJsDocDescription(enumeration.ownedComments);
        this.writeIndent();
        if (prefix && prefix.length > 0) {
            this.write(`${prefix.trim()} `);
        }
        this.write(`type ${enumeration.name} = `);
        this.joinWrite(enumeration.ownedLiterals, ' | ', lit => `'${lit.name}'`);
        this.writeEndOfLine(';');
    }

    /**
     * Writes a function declaration without a body.     
     * @param operation The operation. 
     * @param options An optional FunctionOptions object.
     */
    public writeFunctionDeclaration(operation: elements.Operation, options?: opts.FunctionOptions): void {
        if (!operation) return;
        this.writeFunctionStart(operation, options);
        this.writeEndOfLine(';');
    }

    /**
    * Writes a block of code, wrapped in an function declaration and opening and closing brackets.      * 
    * @param operation The operation. 
    * @param contents A callback that writes the operation contents.
    * @param options An optional FunctionOptions object.
    */
    public writeFunctionBlock(operation: elements.Operation, contents: (writer: TypeScriptWriter, op: elements.Operation) => void, options?: opts.FunctionOptions): void {
        if (!operation) return;

        this.writeFunctionStart(operation, options);
        if (operation.isAbstract) {
            this.writeEndOfLine(';');
            return;
        }
        this.writeEndOfLine();
        this.writeCodeBlock((writer) => { contents(writer, operation) });
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

        if (elements.isTypedElement(element)){
            return this.typeNameProvider ? this.typeNameProvider.getTypeName(element) : element.getTypeName();
        }
        else if (elements.isType(element)) {
            return this.typeNameProvider ? this.typeNameProvider.getTypeName(element) : element.name;
        }
        return null;
    }
    
    private writeFunctionStart(operation: elements.Operation, options?: opts.FunctionOptions): void {
        if (!operation) return;
        if (!options) options = {};
        const features = (options.features === undefined) ? opts.FunctionFeatures.All : options.features;
        const paramFeatures = (options.parameterFeatures === undefined) ? opts.ParameterFeatures.All : options.parameterFeatures;

        // jsDoc tags 
        var jsDocLines: string[] = [];
        if (features & opts.FunctionFeatures.JsDocDescription) {
            this.pushJsDocLinesFromComments(operation.ownedComments, jsDocLines);
        }
        if (paramFeatures & opts.ParameterFeatures.JsDocDescription) {
            this.pushJsDocLinesForParameters(operation.ownedParameters, jsDocLines);
        }
        this.writeJsDocLines(jsDocLines);
        // Start a new, indented line
        this.writeIndent();
        if (!elements.isInterface(operation.owner)) {
            this.writeAccessModifier(operation.visibility);
        }
        if (operation.isStatic) {
            this.write('static ');
        }
        else if (operation.isAbstract) {
            this.write('abstract ');
        }
        this.write(operation.name);
        // If needed, make the function optional using the '?'   
        const returnParameter = operation.getReturnParameter();
        const optionalityModifier = (options.returnOptionality === undefined) ? opts.OptionalityModifier.NullKeyword : options.returnOptionality;        
        const makeOptional = (returnParameter && returnParameter.isOptional()) ? !!(features & opts.FunctionFeatures.OptionalModifier) : false;
        if (makeOptional && (optionalityModifier & opts.OptionalityModifier.QuestionToken)) {
            this.write('?');
        }
        this.write('(');
        this.writeInOutParameters(operation.ownedParameters, paramFeatures, options.parameterOptionality);
        this.write('): ');

        // Write the return type        
        const returnType = this.getParameterTypeName(returnParameter) || 'void';
        this.write(returnType);
        if (makeOptional && (optionalityModifier & opts.OptionalityModifier.NullKeyword)) {
            this.write(' | null');
        }
    }

    private writeInOutParameters(parameters: elements.Parameter[], features: opts.ParameterFeatures, optionalityModifier?: opts.OptionalityModifier): void {
        if (!elements)
            return;

        if (optionalityModifier === undefined) optionalityModifier = opts.OptionalityModifier.NullKeyword;

        let i = 0;
        parameters.forEach((p: elements.Parameter) => {
            if (p.direction === elements.ParameterDirectionKind.return)
                return;

            const makeOptional = p.isOptional() ? !!(features & opts.ParameterFeatures.OptionalModifier) : false;

            if (i > 0) {
                this.write(', ');
            }
            this.write(p.name);
            if (makeOptional && (optionalityModifier! & opts.OptionalityModifier.QuestionToken)) {
                this.write('?');
            }
            const typeName = this.getParameterTypeName(p) || 'any';
            this.write(`: ${typeName}`);
            if (makeOptional && (optionalityModifier! & opts.OptionalityModifier.NullKeyword)) {
                this.write(' | null');
            }
            i++;
        });
    }

    private getParameterTypeName(parameter: elements.Parameter | null): string | null {
        if (!parameter) return null;

        var typeName = this.getTypeName(parameter) || 'any';
        if (parameter.isMultivalued()) {
            typeName = `${typeName}[]`;
        }
        return typeName;
    }

    private writeAccessModifier(visibilityKind: elements.VisibilityKind | null): void {
        const visibilityString = TypeScriptWriter.getAccessModifierString(visibilityKind);
        if (!visibilityString)
            return;

        this.write(visibilityString);
        this.writeWhiteSpace();
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

    private pushJsDocLinesForParameters(parameters: elements.Parameter[], lines: string[]): void {
        if (!parameters)
            return;

        parameters.forEach((p: elements.Parameter) => {
            lines.push(this.getJsDocLineForParameter(p));
        });
    }

    private getJsDocLineForParameter(parameter: elements.Parameter): string {
        const isReturn = parameter.direction === elements.ParameterDirectionKind.return;
        const tag = isReturn ? 'returns' : 'param';
        const commentBodies = parameter.ownedComments.map(c => c.body);

        let typeName = this.getTypeName(parameter) || 'any';
        if (parameter.isMultivalued()) {
            typeName = `${typeName}[]`;
        }

        let line = `@${tag} {${typeName}}`;
        if (!isReturn) {
            line = `${line} ${parameter.name}`;
        }
        if (commentBodies.length > 0) {
            line = `${line} ${commentBodies.join(' ')}`;
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

    private static getAccessModifierString(visibility: elements.VisibilityKind | null): string | null {
        switch (visibility) {
            case elements.VisibilityKind.public:
                return 'public';
            case elements.VisibilityKind.private:
                return 'private';
            case elements.VisibilityKind.protected:
                return 'protected';
            default:
                return null;
        }
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