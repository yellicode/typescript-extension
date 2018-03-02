import * as model from '@yellicode/model';
import * as opts from './options';

import { CodeWriter, TextWriter, CodeWriterUtility, TypeNameProvider } from '@yellicode/templating';
import { TypeScriptTypeNameProvider } from './typescript-type-name-provider';

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
    * Writes an indented block of code, wrapped in opening and closing brackets. 
    * @param contents A callback function that writes the contents.
    */
    public writeCodeBlock(contents: (writer: TypeScriptWriter) => void) {
        this.writeLine('{');
        this.increaseIndent();
        if (contents) contents(this);
        this.decreaseIndent();
        this.writeLine('}');
    };

    /**
     * Writes a block of code, wrapped in a class declaration and opening and closing brackets. 
     * This function does not write class members.
     * @param cls The class.
     * @param contents A callback function that writes the class contents.
     * @param options An optional ClassOptions object.
     */
    public writeClassBlock(cls: model.Class, contents: (writer: TypeScriptWriter, cls: model.Class) => void, options?: opts.ClassOptions) {
        if (!cls) return;
        if (!options) options = {};

        const features = (options.features === undefined) ? opts.ClassFeatures.All : options.features;
        if (features & opts.ClassFeatures.JsDocDescription) {
            this.writeJsDocDescription(cls.ownedComments);
        }
        this.writeIndent();
        if (options.prefix) {
            this.write(`${options.prefix.trim()} `);
        }
        if (cls.isAbstract) {
            this.write('abstract ');
        }
        this.write(`class ${cls.name}`);
        if (features & opts.ClassFeatures.Generalizations) {
            this.writeGeneralizations(cls.generalizations, options.inherits);
        }
        if (features & opts.ClassFeatures.InterfaceRealizations) {
            this.writeInterfaceRealizations(cls.interfaceRealizations, options.implements);
        }
        this.writeEndOfLine();
        this.writeCodeBlock((writer) => { contents(writer, cls) });
    }

    /**
      * Writes a block of code, wrapped in an interface declaration and opening and closing brackets. 
      * This function does not write interface members.
      * @param iface The interface.
      * @param contents A callback function that writes the interface contents.
      * @param options An optional InterfaceOptions object.
      */
    public writeInterfaceBlock(iface: model.Interface, contents: (writer: TypeScriptWriter, cls: model.Interface) => void, options?: opts.InterfaceOptions) {
        if (!iface) return;
        if (!options) options = {};

        const features = (options.features === undefined) ? opts.InterfaceFeatures.All : options.features;
        if (features & opts.InterfaceFeatures.JsDocDescription) {
            this.writeJsDocDescription(iface.ownedComments);
        }
        this.writeIndent();
        if (options.prefix) {
            this.write(`${options.prefix.trim()} `);
        }
        this.write(`interface ${iface.name}`);
        if (features & opts.InterfaceFeatures.Generalizations) {
            this.writeGeneralizations(iface.generalizations, options.inherits);
        }
        this.writeEndOfLine();
        this.writeCodeBlock((writer) => { contents(writer, iface) });
    }

    /**
     * Writes a class or interface property.
     * @param property The property to write.
     * @param options An optional PropertyOptions object.
     */
    public writeProperty(property: model.Property, options?: opts.PropertyOptions) {
        if (!property) return;
        if (!options) options = {};

        const features = (options.features === undefined) ? opts.PropertyFeatures.All : options.features;
        const optionalityModifier = (options.optionality === undefined) ? opts.OptionalityModifier.QuestionToken : options.optionality;
        const makeOptional = property.isOptional() && (features & opts.PropertyFeatures.OptionalModifier);

        if (features & opts.PropertyFeatures.JsDocDescription) {
            this.writeJsDocDescription(property.ownedComments);
        }
        // Start a new, indented line        
        this.writeIndent();
        // Access modifier (+ white space)
        if ((features & opts.PropertyFeatures.AccessModifier) && !model.isInterface(property.owner)) {
            this.writeAccessModifier(property.visibility);
        }
        // Readonly modifier
        if ((features & opts.PropertyFeatures.ReadonlyModifier) && property.isReadOnly || property.isDerived) {
            this.write('readonly ');
        }
        // The name
        this.write(property.name);
        if (makeOptional && (optionalityModifier & opts.OptionalityModifier.QuestionToken)) {
            this.write('?');
        }
        // The type        
        this.write(`: ${this.getTypeName(property.type) || 'any'}`);
        if (property.isMultivalued()) {
            this.write('[]');
        }
        if (makeOptional && (optionalityModifier & opts.OptionalityModifier.NullKeyword)) {
            this.write(' | null');
        }
        // TODO: Initializer if not an interface and the model has a default value (but should have a some optional value conversion hook, primitives only)
        // if ((features & opts.PropertyFeatures.Initializer) && !model.isInterface(property.owner)) {

        // }
        this.writeEndOfLine(';');
    }

    /**
     * Writes a full enumeration, including members.   
     * @param element The enumeration.     
     * @param options An optional EnumerationOptions object.
     */
    public writeEnumeration(enumeration: model.Enumeration, options: opts.EnumOptions): void {
        if (!enumeration) return;
        if (!options) options = {};
        const features = (options.features === undefined) ? opts.EnumFeatures.All : options.features;

        if (features & opts.EnumFeatures.JsDocDescription) {
            this.writeJsDocDescription(enumeration.ownedComments);
        }
        this.writeIndent();
        if (options.prefix) {
            this.write(`${options.prefix.trim()} `);
        }

        this.write(`enum ${enumeration.name}`);
        this.writeEndOfLine();
        this.writeCodeBlock(() => {
            let literals = enumeration.ownedLiterals;
            if (!literals)
                return;

            for (let i = 0, len = literals.length; i < len; i++) {
                const literal = literals[i];
                if (features & opts.EnumFeatures.JsDocDescription) {
                    this.writeJsDocDescription(literal.ownedComments);
                }
                this.writeIndent();
                this.write(literal.name);
                if ((features & opts.EnumFeatures.Initializers) && literal.specification) {
                    let initialValue = literal.specification.getStringValue();
                    if (model.isLiteralString(literal.specification)) {
                        initialValue = `'${initialValue}'`; // a string enum: wrap in quotes
                    }
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
    public writeStringLiteralType(enumeration: model.Enumeration, prefix?: string): void {
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
    public writeFunctionDeclaration(operation: model.Operation, options?: opts.FunctionOptions): void {
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
    public writeFunctionBlock(operation: model.Operation, contents: (writer: TypeScriptWriter, op: model.Operation) => void, options?: opts.FunctionOptions): void {
        if (!operation) return;

        this.writeFunctionStart(operation, options);
        if (operation.isAbstract) {
            this.writeEndOfLine(';');
            return;
        }
        this.writeEndOfLine();
        this.writeCodeBlock((writer) => { contents(writer, operation) });
    }

    private writeFunctionStart(operation: model.Operation, options?: opts.FunctionOptions): void {
        if (!operation) return;
        if (!options) options = {};
        const features = (options.features === undefined) ? opts.FunctionFeatures.All : options.features;

        // jsDoc tags 
        var jsDocLines: string[] = [];
        if (features & opts.FunctionFeatures.JsDocDescription) {
            this.pushJsDocLinesFromComments(operation.ownedComments, jsDocLines);
        }
        if (features & opts.FunctionFeatures.JsDocParameters) {
            this.pushJsDocLinesForParameters(operation.ownedParameters, jsDocLines);
        }
        this.writeJsDocLines(jsDocLines);
        // Start a new, indented line
        this.writeIndent();
        if (!model.isInterface(operation.owner)) {
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
        const makeOptional = (returnParameter && returnParameter.isOptional());
        if (makeOptional && (optionalityModifier & opts.OptionalityModifier.QuestionToken)) {
            this.write('?');
        }
        this.write('(');
        this.writeInOutParameters(operation.ownedParameters, options.parameterOptionality);
        this.write('): ');

        // Write the return type        
        const returnType = this.getParameterTypeName(returnParameter) || 'void';
        this.write(returnType);
        if (makeOptional && (optionalityModifier & opts.OptionalityModifier.NullKeyword)) {
            this.write(' | null');
        }
    }

    private writeInOutParameters(elements: model.Parameter[], optionalityModifier?: opts.OptionalityModifier): void {
        if (!elements)
            return;

        if (optionalityModifier === undefined) optionalityModifier = opts.OptionalityModifier.NullKeyword;

        let i = 0;
        elements.forEach((p: model.Parameter) => {
            if (p.direction === model.ParameterDirectionKind.return)
                return;

            const makeOptional = p.isOptional();
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

    private getParameterTypeName(parameter: model.Parameter | null): string | null {
        if (!parameter) return null;

        var typeName = this.getTypeName(parameter.type) || 'any';
        if (parameter.isMultivalued()) {
            typeName = `${typeName}[]`;
        }
        return typeName;
    }

    private writeAccessModifier(visibilityKind: model.VisibilityKind | null): void {
        const visibilityString = TypeScriptWriter.getAccessModifierString(visibilityKind);
        if (!visibilityString)
            return;

        this.write(visibilityString);
        this.writeWhiteSpace();
    }

    private writeGeneralizations(generalizations: model.Generalization[], additional: string[] | undefined): void {
        const allNames: string[] = [];
        if (generalizations) {
            allNames.push(...generalizations.map(g => this.getTypeName(g.general)!));
        }
        if (additional) {
            allNames.push(...additional);
        }
        if (allNames.length === 0)
            return;

        this.write(' extends ');
        this.joinWrite(allNames, ', ', name => name);
    }

    private writeInterfaceRealizations(realizations: model.InterfaceRealization[], additional: string[] | undefined): void {
        const allNames: string[] = [];
        if (realizations) {
            allNames.push(...realizations.map(ir => this.getTypeName(ir.contract)!));
        }
        if (additional) {
            allNames.push(...additional);
        }
        if (allNames.length === 0)
            return;

        this.write(' implements ');
        this.joinWrite(allNames, ', ', name => name);
    }

    private pushJsDocLinesFromComments(comments: model.Comment[], lines: string[]): void {
        if (!comments)
            return;

        let i = 0;
        comments.forEach((p: model.Comment) => {
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

    private pushJsDocLinesForParameters(parameters: model.Parameter[], lines: string[]): void {
        if (!parameters)
            return;

        parameters.forEach((p: model.Parameter) => {
            lines.push(this.getJsDocLineForParameter(p));
        });
    }

    private getJsDocLineForParameter(parameter: model.Parameter): string {
        const isReturn = parameter.direction === model.ParameterDirectionKind.return;
        const tag = isReturn ? 'returns' : 'param';
        const commentBodies = parameter.ownedComments.map(c => c.body);

        let typeName = this.getTypeName(parameter.type) || 'any';
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


    public writeJsDocDescription(comments: model.Comment[]): void
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

    private static getAccessModifierString(visibility: model.VisibilityKind | null): string | null {
        switch (visibility) {
            case model.VisibilityKind.public:
                return 'public';
            case model.VisibilityKind.private:
                return 'private';
            case model.VisibilityKind.protected:
                return 'protected';
            default:
                return null;
        }
    }

    private getTypeName(type: model.Type | null): string | null {
        if (!type) return null;
        if (!this.typeNameProvider) return type.name;
        return this.typeNameProvider.getTypeName(type);
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
}