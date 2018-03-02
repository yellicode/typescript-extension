"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model = require("@yellicode/model");
const opts = require("./options");
const templating_1 = require("@yellicode/templating");
const typescript_type_name_provider_1 = require("./typescript-type-name-provider");
/**
 * Provides code writing functionality specific for TypeScript.
 */
class TypeScriptWriter extends templating_1.CodeWriter {
    constructor(writer, options) {
        super(writer);
        if (!options)
            options = {};
        this.typeNameProvider = options.typeNameProvider || new typescript_type_name_provider_1.TypeScriptTypeNameProvider();
        this.maxCommentWidth = options.maxCommentWidth || 100;
    }
    /**
    * Writes an indented block of code, wrapped in opening and closing brackets.
    * @param contents A callback function that writes the contents.
    */
    writeCodeBlock(contents) {
        this.writeLine('{');
        this.increaseIndent();
        if (contents)
            contents(this);
        this.decreaseIndent();
        this.writeLine('}');
    }
    ;
    /**
     * Writes a block of code, wrapped in a class declaration and opening and closing brackets.
     * This function does not write class members.
     * @param cls The class.
     * @param contents A callback function that writes the class contents.
     * @param options An optional ClassOptions object.
     */
    writeClassBlock(cls, contents, options) {
        if (!cls)
            return;
        if (!options)
            options = {};
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
        this.writeCodeBlock((writer) => { contents(writer, cls); });
    }
    /**
      * Writes a block of code, wrapped in an interface declaration and opening and closing brackets.
      * This function does not write interface members.
      * @param iface The interface.
      * @param contents A callback function that writes the interface contents.
      * @param options An optional InterfaceOptions object.
      */
    writeInterfaceBlock(iface, contents, options) {
        if (!iface)
            return;
        if (!options)
            options = {};
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
        this.writeCodeBlock((writer) => { contents(writer, iface); });
    }
    /**
     * Writes a class or interface property.
     * @param property The property to write.
     * @param options An optional PropertyOptions object.
     */
    writeProperty(property, options) {
        if (!property)
            return;
        if (!options)
            options = {};
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
    writeEnumeration(enumeration, options) {
        if (!enumeration)
            return;
        if (!options)
            options = {};
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
    writeStringLiteralType(enumeration, prefix) {
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
    writeFunctionDeclaration(operation, options) {
        if (!operation)
            return;
        this.writeFunctionStart(operation, options);
        this.writeEndOfLine(';');
    }
    /**
    * Writes a block of code, wrapped in an function declaration and opening and closing brackets.      *
    * @param operation The operation.
    * @param contents A callback that writes the operation contents.
    * @param options An optional FunctionOptions object.
    */
    writeFunctionBlock(operation, contents, options) {
        if (!operation)
            return;
        this.writeFunctionStart(operation, options);
        if (operation.isAbstract) {
            this.writeEndOfLine(';');
            return;
        }
        this.writeEndOfLine();
        this.writeCodeBlock((writer) => { contents(writer, operation); });
    }
    writeFunctionStart(operation, options) {
        if (!operation)
            return;
        if (!options)
            options = {};
        const features = (options.features === undefined) ? opts.FunctionFeatures.All : options.features;
        // jsDoc tags 
        var jsDocLines = [];
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
    writeInOutParameters(elements, optionalityModifier) {
        if (!elements)
            return;
        if (optionalityModifier === undefined)
            optionalityModifier = opts.OptionalityModifier.NullKeyword;
        let i = 0;
        elements.forEach((p) => {
            if (p.direction === model.ParameterDirectionKind.return)
                return;
            const makeOptional = p.isOptional();
            if (i > 0) {
                this.write(', ');
            }
            this.write(p.name);
            if (makeOptional && (optionalityModifier & opts.OptionalityModifier.QuestionToken)) {
                this.write('?');
            }
            const typeName = this.getParameterTypeName(p) || 'any';
            this.write(`: ${typeName}`);
            if (makeOptional && (optionalityModifier & opts.OptionalityModifier.NullKeyword)) {
                this.write(' | null');
            }
            i++;
        });
    }
    getParameterTypeName(parameter) {
        if (!parameter)
            return null;
        var typeName = this.getTypeName(parameter.type) || 'any';
        if (parameter.isMultivalued()) {
            typeName = `${typeName}[]`;
        }
        return typeName;
    }
    writeAccessModifier(visibilityKind) {
        const visibilityString = TypeScriptWriter.getAccessModifierString(visibilityKind);
        if (!visibilityString)
            return;
        this.write(visibilityString);
        this.writeWhiteSpace();
    }
    writeGeneralizations(generalizations, additional) {
        const allNames = [];
        if (generalizations) {
            allNames.push(...generalizations.map(g => this.getTypeName(g.general)));
        }
        if (additional) {
            allNames.push(...additional);
        }
        if (allNames.length === 0)
            return;
        this.write(' extends ');
        this.joinWrite(allNames, ', ', name => name);
    }
    writeInterfaceRealizations(realizations, additional) {
        const allNames = [];
        if (realizations) {
            allNames.push(...realizations.map(ir => this.getTypeName(ir.contract)));
        }
        if (additional) {
            allNames.push(...additional);
        }
        if (allNames.length === 0)
            return;
        this.write(' implements ');
        this.joinWrite(allNames, ', ', name => name);
    }
    pushJsDocLinesFromComments(comments, lines) {
        if (!comments)
            return;
        let i = 0;
        comments.forEach((p) => {
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
    pushJsDocLinesForParameters(parameters, lines) {
        if (!parameters)
            return;
        parameters.forEach((p) => {
            lines.push(this.getJsDocLineForParameter(p));
        });
    }
    getJsDocLineForParameter(parameter) {
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
    writeJsDocDescription(data) {
        const lines = [];
        if (typeof data == 'string') {
            lines.push(data);
        }
        else {
            this.pushJsDocLinesFromComments(data, lines);
        }
        this.writeJsDocLines(lines);
    }
    writeJsDocParagraph(text) {
        this.writeJsDocLines([text]);
    }
    writeJsDocLines(lines) {
        if (lines.length === 0)
            return;
        this.writeLine('/**');
        // Split here
        lines.forEach(line => {
            const lineLength = line ? line.length : 0;
            if (this.maxCommentWidth > 0 && lineLength > this.maxCommentWidth) {
                // See if we can split the line
                var split = templating_1.CodeWriterUtility.wordWrap(line, this.maxCommentWidth);
                split.forEach(s => {
                    this.writeLine(`* ${s}`);
                });
            }
            else
                this.writeLine(`* ${line}`);
        });
        this.writeLine('*/');
    }
    static getAccessModifierString(visibility) {
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
    getTypeName(type) {
        if (!type)
            return null;
        if (!this.typeNameProvider)
            return type.name;
        return this.typeNameProvider.getTypeName(type);
    }
    joinWrite(collection, separator, getStringFunc) {
        let isFirst = true;
        collection.forEach(c => {
            const value = getStringFunc(c);
            if (!value)
                return;
            if (isFirst) {
                isFirst = false;
            }
            else
                this.write(separator);
            this.write(value);
        });
    }
}
exports.TypeScriptWriter = TypeScriptWriter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXNjcmlwdC13cml0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0eXBlc2NyaXB0LXdyaXRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDBDQUEwQztBQUMxQyxrQ0FBa0M7QUFFbEMsc0RBQW9HO0FBQ3BHLG1GQUE4RTtBQUU5RTs7R0FFRztBQUNILHNCQUE4QixTQUFRLHVCQUFVO0lBSTVDLFlBQVksTUFBa0IsRUFBRSxPQUE0QjtRQUN4RCxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDZCxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFFM0IsSUFBSSxDQUFDLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLDBEQUEwQixFQUFFLENBQUM7UUFDckYsSUFBSSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsZUFBZSxJQUFJLEdBQUcsQ0FBQztJQUMxRCxDQUFDO0lBRUE7OztNQUdFO0lBQ0ksY0FBYyxDQUFDLFFBQTRDO1FBQzlELElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3RCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQztZQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN4QixDQUFDO0lBQUEsQ0FBQztJQUVGOzs7Ozs7T0FNRztJQUNJLGVBQWUsQ0FBQyxHQUFnQixFQUFFLFFBQThELEVBQUUsT0FBMkI7UUFDaEksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFBQyxNQUFNLENBQUM7UUFDakIsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBRTNCLE1B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