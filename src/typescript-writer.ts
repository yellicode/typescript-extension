import * as elements from '@yellicode/elements';
import * as opts from './options';

import { CodeWriter, TextWriter, NameUtility, CodeWriterUtility } from '@yellicode/core';
import { TypeNameProvider } from '@yellicode/elements';
import { TypeScriptTypeNameProvider } from './typescript-type-name-provider';
import { ClassDefinition, InterfaceDefinition, EnumDefinition, PropertyDefinition, FunctionDefinition, ParameterDefinition, DecoratorDefinition, VariableDefinition } from './model';
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
        this.definitionBuilder = options.definitionBuilder || new DefinitionBuilder(this.typeNameProvider);
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
    * Writes an indented block of code, wrapped in opening and closing brackets.
    * @param contents A callback function that writes the contents.
    */
    public writeCodeBlock(contents: (writer: TypeScriptWriter) => void): this {
        this.writeLine('{');
        this.increaseIndent();
        if (contents) contents(this);
        this.decreaseIndent();
        this.writeLine('}');
        return this;
    };

    /**
     * Writes an import statement that imports the specified exports from the
     * specified module.
     * @param moduleName The module to import from.
     * @param exports The name(s) of the export(s) to be imported.
     * @param alias The alias under which the module should be imported.
     */
    public writeImports(moduleName: string, alias: string): this
    public writeImports(moduleName: string, ...exports: any[]): this
    public writeImports(moduleName: string, x: any): this {
        if (!moduleName)
            return this;

        // Ensure forward slashes in the module name
        moduleName = moduleName.replace(/\\/g, "/");

        if (x instanceof Array) {
            if (x.length === 0) return this;
            this.writeLine(`import { ${x.join(', ')} } from '${moduleName}';`);
            return this;
        }
        // x is the alias
        if (!x) {
            x = TypeScriptWriter.makeSafeModuleName(moduleName);
        }
        this.writeLine(`import * as ${x} from '${moduleName}';`);
        return this;
    }

    // #region decorators
    /**
    * Writes an indented block of decorator code, wrapped in opening and closing brackets.
    * @param contents A callback function that writes the contents.
    * @deprecated Use writeDecorator or writeDecorators instead, or set the 'decorators' field on the property- or class definition.
    */
    public writeDecoratorCodeBlock(decoratorName: string, contents: (writer: TypeScriptWriter) => void): this {
        console.log('TypeScriptWriter.writeDecoratorCodeBlock is deprecated. Use writeDecorator or writeDecorators instead, or set the \'decorators\' field on the property- or class definition.');
        this.writeLine(`@${decoratorName}({`);
        this.increaseIndent();
        if (contents) contents(this);
        this.decreaseIndent();
        this.writeLine('})');
        return this;
    }

    /**
     * Writes a decorator, either inline or on a separate line.
     * @param definition The decorator definition.
     * @param inline True to write the decorator inline, false to write it on its own line.
     */
    public writeDecorator(definition: DecoratorDefinition, inline?: boolean): this {
        if (!inline) {
            this.writeIndent();
        }
        this.write(`@${definition.name}`);
        // Note: 'hasParameters' can be true while 'parameters' can be empty.
        // This will result in '@MyInput()' with no parameters.
        // However, 'parameters' having a value is the same as hasParameters being true.
        if (definition.hasParameters || definition.parameters) {
            this.write('(');
            if (definition.parameters) { //
                if (typeof (definition.parameters) === 'string') {
                    this.write(definition.parameters);
                }
                else // contents is a function
                    definition.parameters(this);
            }
            this.write(')');
        }
        if (inline)
            this.write(' ');
        else
            this.writeEndOfLine();
        return this;
    }

     /**
     * Writes a decorator, either inline or on a separate line.
     * @param definition The decorator definition.
     */
    public writeDecorators(decorators: DecoratorDefinition[], inline?: boolean): this {
        decorators.forEach(d => {
            this.writeDecorator(d, inline);
        });
        return this;
    }

    // #endregion decorators

    // #region variables
    /**
     * Writes a variable (const or let) declaration.
     * @param definition The variable definition.
     * @param kind The kind of variable (const or let).
     */
    public writeVariableDeclaration(definition: VariableDefinition, kind: 'const' | 'let'): this {
        if (definition.description) {
            // Yes, variables can have docs!
            this.writeJsDocLines(definition.description);
        }
        this.writeIndent();
        if (definition.export) {
            this.write(`export `);
        }
        if (definition.declare) {
            this.write('declare ');
        }
        this.write(`${kind} ${definition.name}`);
        if (definition.typeName) {
            this.write(`: ${definition.typeName}`);
        }
        if (definition.initializer && !definition.declare) {
            this.write(' = ');
            if (typeof (definition.initializer) === 'string') {
                this.write(definition.initializer);
            }
            else
                definition.initializer(this);
        }
        this.writeEndOfLine(';');
        return this;
    }

    /**
     * A shorthand for writeVariableDeclaration(declaration, 'const');
     * @param definition The variable definition.
     */
    public writeConstDeclaration(definition: VariableDefinition): this {
        return this.writeVariableDeclaration(definition, 'const');
    }

    /**
     * A shorthand for writeVariableDeclaration(declaration, 'let');
     * @param definition The variable definition.
     */
    public writeLetDeclaration(definition: VariableDefinition): this {
        return this.writeVariableDeclaration(definition, 'let');
    }
    // #endregion variables

    // #region classes/interfaces

    /**
    * Writes a block of code, wrapped in a class declaration and opening and closing brackets.
    * This function does not write class members.
    * @param definition The class definition.
    * @param contents A callback function that writes the class contents.
    */
    public writeClassBlock(cls: ClassDefinition, contents: (writer: TypeScriptWriter) => void): this
    /**
     * Writes a block of code, wrapped in a class declaration and opening and closing brackets.
    * This function does not write class members.
    * @param type A model type from which to create the class block.
    * @param contents A callback function that writes the class contents.
    * @param options An optional ClassOptions object.
    */
    public writeClassBlock(cls: elements.Type, contents: (writer: TypeScriptWriter) => void, decorators?: DecoratorDefinition[], options?: opts.ClassOptions): this
    public writeClassBlock(cls: any, contents: (writer: TypeScriptWriter) => void, decorator?: DecoratorDefinition[], options?: opts.ClassOptions): this {
        if (!cls) return this;

        let definition: ClassDefinition;
        if (elements.isType(cls)) {
            definition = this.definitionBuilder.buildClassDefinition(cls, decorator, options);
        }
        else definition = cls;

        if (definition.description) {
            this.writeJsDocLines(definition.description);
        }
        if (definition.decorators) {
            this.writeDecorators(definition.decorators, false);
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
        return this;
    }

    /**
      * Writes a block of code, wrapped in an interface declaration and opening and closing brackets.
      * This function does not write interface members.
      * @param iface The interface.
      * @param contents A callback function that writes the interface contents.
      */
    public writeInterfaceBlock(iface: InterfaceDefinition, contents: (writer: TypeScriptWriter) => void): this
    /**
     * Writes a block of code, wrapped in an interface declaration and opening and closing brackets.
     * This function does not write interface members.
     * @param type A model type from which to create the interface block.
     * @param contents A callback function that writes the interface contents.
     * @param options An optional InterfaceOptions object.
     */
    public writeInterfaceBlock(iface: elements.Type, contents: (writer: TypeScriptWriter) => void, options?: opts.InterfaceOptions): this
    public writeInterfaceBlock(iface: any, contents: (writer: TypeScriptWriter) => void, options?: opts.InterfaceOptions): this {
        if (!iface) return this;

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
        return this;
    }

    protected /* virtual */ writeExtends(ext: string[]): void {
        if (ext.length === 0)
            return;

        this.write(' extends ');
        this.joinWrite(ext, ', ', name => name);
    }

    protected /* virtual */ writeImplements(impl: string[]): void {
        if (impl.length === 0)
            return;

        this.write(' implements ');
        this.joinWrite(impl, ', ', name => name);
    }

    // #endregion classes/interfaces

    // #region properties

    /**
     * Writes a property from the property definition.
     * @param property
     */
    public writeProperty(property: PropertyDefinition): this
    /**
     * Writes a class or interface property.
     * @param property The property to write.
     * @param options An optional PropertyOptions object.
     */
    public writeProperty(property: elements.Property, decorators?: DecoratorDefinition[], options?: opts.PropertyOptions): this
    public writeProperty(property: any, decorators?: DecoratorDefinition[], options?: opts.PropertyOptions): this {
        if (!property) return this;

        let definition: PropertyDefinition;

        if (elements.isProperty(property)) {
            definition = this.definitionBuilder.buildPropertyDefinition(property, decorators, options);
        }
        else definition = property;

        const hasDefaultValue = definition.defaultValue != null; // '!= null' to allow for empty strings

        // Description
        if (definition.description) {
            this.writeJsDocLines(definition.description);
        }
        // Start a new, indented line
        this.writeIndent();

        // Write inline decorator
        if (definition.decorators) {
            this.writeDecorators(definition.decorators, true);
        }
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
            this.write(' = ');
            this.writePropertyDefaultValue(definition.defaultValue);
        }
        this.writeEndOfLine(';');
        return this;
    }

    protected writePropertyDefaultValue(value: any | ((output: TypeScriptWriter) => void)) {
        const typeOfValue = typeof (value);
        switch (typeOfValue) {
            case 'number':
                this.write(value);
                break;
            case 'boolean':
                this.write(value ? 'true' : 'false');
                break;
            case 'string':
                this.write(`'${value}'`);
                break;
            case 'function': // (output: TypeScriptWriter) => void;
                value(this);
                break;
            default:
                this.writeObject(value, true);
                break;
        }
    }

    // #endregion properties

    // #region enumerations

    /**
    * Writes a full enumeration, including members.
    * @param element The enumeration.
    */
    public writeEnumeration(enumeration: EnumDefinition): this
    /**
    * Writes a full enumeration, including members.
    * @param element The enumeration.
    * @param options An optional EnumerationOptions object.
    */
    public writeEnumeration(enumeration: elements.Enumeration, options?: opts.EnumOptions): this
    public writeEnumeration(enumeration: any, options?: opts.EnumOptions): this {
        if (!enumeration) return this;

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
        if (definition.const) {
            this.write('const ');
        }

        this.write(`enum ${enumeration.name}`);
        this.writeEndOfLine(' {');
        this.increaseIndent();

        if (!definition.members)
            return this;

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
        return this;
    }

    /**
     * Writes a string literal type from a specified enumeration. Example: 'type Easing = 'ease-in' | 'ease-out' | 'ease-in-out';'
     * @param enumeration The enumeration.
     * @param prefix An optional prefix, such as 'export'.
     */
    public writeStringLiteralType(enumeration: elements.Enumeration, options?: opts.StringLiteralOptions): this {
        if (!enumeration) return this;
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
        return this;
    }

    // #endregion enumerations

    // #region functions
    /**
     * Writes a function declaration without a body.
     * @param operation The function definition.
     */
    public writeFunctionDeclaration(funct: FunctionDefinition): this
    /**
     * Writes a function declaration without a body.
     * @param operation The operation.
     * @param options An optional FunctionOptions object.
     */
    public writeFunctionDeclaration(operation: elements.Operation, options?: opts.FunctionOptions): this
    public writeFunctionDeclaration(func: any, options?: opts.FunctionOptions): this {
        if (!func) return this;

        let definition: FunctionDefinition;
        if (elements.isOperation(func)) {
            definition = this.definitionBuilder.buildFunctionDefinition(func, options);
        }
        else definition = func;
        this.writeFunctionStart(definition);
        this.writeEndOfLine(';');
        return this;
    }

    /**
    * Writes a block of code, wrapped in an function declaration and opening and closing brackets.
    * @param func The operation.
    * @param contents A callback that writes the operation contents.
    */
    public writeFunctionBlock(func: FunctionDefinition, contents?: (writer: TypeScriptWriter) => void): this;
    /**
    * Writes a block of code, wrapped in an function declaration and opening and closing brackets.
    * @param operation The operation.
    * @param contents A callback that writes the operation contents.
    * @param options An optional FunctionOptions object.
    */
    public writeFunctionBlock(operation: elements.Operation, contents?: (writer: TypeScriptWriter) => void, options?: opts.FunctionOptions): this;
    public writeFunctionBlock(func: elements.Operation, contents?: (writer: TypeScriptWriter) => void, options?: opts.FunctionOptions): this {
        if (!func) return this;

        let definition: FunctionDefinition;
        if (elements.isOperation(func)) {
            definition = this.definitionBuilder.buildFunctionDefinition(func, options);
        }
        else definition = func;
        this.writeFunctionStart(definition);
        if (definition.isAbstract) {
            this.writeEndOfLine(';');
            return this; // done
        }
        if (!contents)
            return this.writeEndOfLine(' {}');

        this.writeEndOfLine(' {');
        this.increaseIndent();
        contents(this);
        this.decreaseIndent();
        this.writeLine('}');
        return this;
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

    protected writeFunctionStart(definition: FunctionDefinition): void {
        const isConstructor = definition.isConstructor || definition.name === 'constructor';
        // jsDoc tags
        var jsDocLines: string[] = [];
        if (definition.description) {
            jsDocLines.push(...definition.description);
        }
        if (definition.parameters && definition.description /* only writing parameter docs if there is also a description */) {
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
        if (isConstructor) {
            this.write('constructor');
        }
        else {
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
            if (definition.name) this.write(definition.name);
            else console.warn('Function definition is missing a name and is not a constructor.');
        }
        // If needed, make the function optional using the '?'
        // if (definition.isOptional) {
        //     this.write('?');
        // }

        this.write('(');
        if (definition.parameters) {
            this.writeInOutParameters(definition.parameters, isConstructor, definition.multiLineSignature);
        }
        this.write(')');
        // Write the return type
        if (!isConstructor) {
            this.write(': ');
            this.write(definition.returnTypeName || 'void');
            if (definition.returnsOptional) {
                this.write(' | null');
            }
        }
    }

    protected writeInOutParameters(parameters: ParameterDefinition[], isConstructor: boolean, multiLine?: boolean): void {
        let i = 0;
        if (!parameters.length)
            return;

        if (multiLine) this.increaseIndent();
        parameters.forEach((p: ParameterDefinition) => {
            if (p.isReturn)
                return;

            if (i === 0 && multiLine) {
                this.writeEndOfLine(); // we are at 'myFunction(', so end this line first
            }

            if (i > 0) {
                if (multiLine) this.writeEndOfLine(', ');
                else this.write(', ');
            }
            if (multiLine) this.writeIndent();
            if (isConstructor && p.accessModifier) {
                this.write(`${p.accessModifier} `);
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
        if (multiLine) {
            this.writeEndOfLine()
            .decreaseIndent().writeIndent() // make the closing ')' appear on the next line
        }
    }

    public writeObject(instance: any, omitLastEndOfLine?: boolean): this {
        // Use JSON.stringify() and then unquote property names to create javascript property names.
        // We will do this by letting JSON.stringify create multiple lines (see the 3rd argument, force indentation).
        // {
        //      "Title": "My book title",
        //      "Price": 50
        //}
        // The following RegExp replaces (including indent)
        //      "myProperty":"myValue"
        //      myProperty:"myValue"'
        const regex: RegExp = new RegExp(/^(\s*)"([^"]+)":/g);
        const stringified = JSON.stringify(instance, undefined, this.indentString || 1);
        const lines = stringified.split(/\r?\n/g);
        lines.forEach((l, i) => {
            if (i == 0) {
                // The first line from the result will be on the current line in the output,
                this.write(l.trimLeft()); // write the first "{" or "[" created by JSON.stringify
                this.writeEndOfLine(); // writes the indent string generated by JSON.stringify
            }
            else {
                this.writeIndent(); // even though lines are indented, we still need to add the current indent

                const unquoted = l.replace(regex, '$1$2:');
                this.write(unquoted);
                if (!omitLastEndOfLine || i < lines.length - 1)
                    this.writeEndOfLine();
            }
        })
        return this;
    }
    // #endregion functions

    // #region JSDoc
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

    public writeJsDocDescription(comments: elements.Comment[]): this
    public writeJsDocDescription(text: string): this
    public writeJsDocDescription(data: any): this {
        const lines: string[] = [];
        if (typeof data == 'string') {
            lines.push(data);
        } else {
            this.pushJsDocLinesFromComments(data, lines);
        }
        this.writeJsDocLines(lines);
        return this;
    }

    public writeJsDocParagraph(text: string): this {
        this.writeJsDocLines([text]);
        return this;
    }

    public writeJsDocLines(lines: string[]): this {
        if (lines.length === 0)
            return this;

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
        return this;
    }

    // #endregion JSDoc

    // #region utilities
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

    // #endregion utilities

}