import * as elements from '@yellicode/elements';
import { ClassDefinition, InterfaceDefinition, EnumDefinition, EnumMemberDefinition, PropertyDefinition, AccessModifier, ParameterDefinition, FunctionDefinition, DecoratorDefinition } from './model';
import * as opts from './options';
import { TypeUtility } from './type-utility';

export class DefinitionBuilder {
    constructor(private typeNameProvider: elements.TypeNameProvider) {}

    public buildClassDefinition(type: elements.Type, decorators?: DecoratorDefinition[], options?: opts.ClassOptions): ClassDefinition {
        if (!options) options = {};

        const definition: ClassDefinition = { name: type.name };
        const features = (options.features === undefined) ? opts.ClassFeatures.All : options.features;

        // Handle deprecated stuff
        if (options.prefix) {
            console.warn(`The 'prefix' option is deprecated. Use the 'export' or 'declare' option instead.`)
            if (options.prefix === 'export') {
                options.export = true;
            }
            else if (options.prefix === 'declare') {
                options.declare = true;
            }
        }

        // Description
        if ((features & opts.ClassFeatures.JsDocDescription) && type.ownedComments) {
            definition.description = DefinitionBuilder.buildDescription(type);
        }

        // Generalizations
        if (elements.isClassifier(type)) {
            if (features & opts.ClassFeatures.Generalizations) {
                definition.extends = DefinitionBuilder.buildExtends(type, options.inherits);
            }

        }
        if (elements.isClass(type)) {
            // Abstract
            definition.isAbstract = type.isAbstract;
            // InterfaceRealizations
            if (features & opts.ClassFeatures.InterfaceRealizations) {
                definition.implements = DefinitionBuilder.buildImplements(type, options.implements);
            }
        }

        // Declare
        definition.declare = options.declare;

        // Export
        if (options.export == undefined) {
            definition.export = type.visibility === elements.VisibilityKind.public || type.visibility === elements.VisibilityKind.package;
        }
        else definition.export = options.export;
        definition.decorators = decorators;
        return definition;
    }

    public buildInterfaceDefinition(type: elements.Type, options?: opts.InterfaceOptions): InterfaceDefinition {
        if (!options) options = {};

        const definition: InterfaceDefinition = { name: type.name };
        const features = (options.features === undefined) ? opts.InterfaceFeatures.All : options.features;

        // Handle deprecated stuff
        if (options.prefix) {
            console.warn(`The 'prefix' option is deprecated. Use the 'export' or 'declare' option instead.`)
            if (options.prefix === 'export') {
                options.export = true;
            }
            else if (options.prefix === 'declare') {
                options.declare = true;
            }
        }

        // Description
        if ((features & opts.InterfaceFeatures.JsDocDescription) && type.ownedComments) {
            definition.description = DefinitionBuilder.buildDescription(type);
        }

        // Generalizations
        if (elements.isClassifier(type)) {
            if (features & opts.InterfaceFeatures.Generalizations) {
                definition.extends = DefinitionBuilder.buildExtends(type, options.inherits);
            }
        }

        // Declare
        definition.declare = options.declare;

        // Export
        if (options.export == undefined) {
            definition.export = type.visibility === elements.VisibilityKind.public || type.visibility === elements.VisibilityKind.package;
        }
        else definition.export = options.export;
        return definition;
    }

    public buildEnumDefinition(type: elements.Type, options?: opts.EnumOptions): EnumDefinition {
        if (!options) options = {};

        const definition: EnumDefinition = { name: type.name };
        const features = (options.features === undefined) ? opts.EnumFeatures.All : options.features;

        // Handle deprecated stuff
        if (options.prefix) {
            console.warn(`The 'prefix' option is deprecated. Use the 'export' or 'declare' option instead.`)
            if (options.prefix === 'export') {
                options.export = true;
            }
            else if (options.prefix === 'declare') {
                options.declare = true;
            }
        }

        // Description
        if ((features & opts.EnumFeatures.JsDocDescription) && type.ownedComments) {
            definition.description = DefinitionBuilder.buildDescription(type);
        }

        // Declare
        definition.declare = options.declare;

        // Export
        if (options.export == undefined) {
            definition.export = type.visibility === elements.VisibilityKind.public || type.visibility === elements.VisibilityKind.package;
        }
        else definition.export = options.export;

        // Literals
        if (elements.isEnumeration(type) && type.ownedLiterals && type.ownedLiterals.length) {
            const members: EnumMemberDefinition[] = [];
            const buildInitializers = !!(features & opts.EnumFeatures.Initializers);
            type.ownedLiterals.forEach(literal => {
                const member: EnumMemberDefinition = { name: literal.name };
                if (features & opts.EnumFeatures.JsDocDescription) {
                    member.description = DefinitionBuilder.buildDescription(literal);
                }
                if (buildInitializers && literal.specification) {
                    const specification = literal.specification;
                    member.value = elements.isLiteralInteger(specification)
                        ? specification.value
                        : specification.getStringValue();
                }
                members.push(member);
            });

            definition.members = members;
        }

        return definition;
    }

    public buildFunctionDefinition(op: elements.Operation, options?: opts.FunctionOptions) {
        if (!options) options = {};

        const definition: FunctionDefinition = { name: op.name };
        const features = (options.features === undefined) ? opts.FunctionFeatures.All : options.features;
        const paramFeatures = (options.parameterFeatures === undefined) ? opts.ParameterFeatures.All : options.parameterFeatures;
        const paramOptionality = (options.parameterOptionality === undefined) ? opts.OptionalityModifier.NullKeyword : options.parameterOptionality;

        const isOwnedByInterface = elements.isInterface(op.owner);

        // Description
        if ((features & opts.FunctionFeatures.JsDocDescription) && op.ownedComments) {
            definition.description = DefinitionBuilder.buildDescription(op);
        }

        // Access modifier
        if ((features & opts.PropertyFeatures.AccessModifier) && !isOwnedByInterface) {
            definition.accessModifier = DefinitionBuilder.getAccessModifierString(op.visibility);
        }

        definition.isAbstract = !isOwnedByInterface && op.isAbstract && !op.isConstructor;
        definition.isStatic = op.isStatic;

        // Return type 
        const returnParameter = op.getReturnParameter();
        if (returnParameter) {
            const makeOptional = returnParameter.isOptional() ? !!(features & opts.FunctionFeatures.OptionalModifier) : false;
            definition.returnTypeName = this.getFullTypeName(returnParameter);
            definition.returnsOptional = makeOptional;
        }

        // Input Parameters
        const parameters: ParameterDefinition[] = [];
        op.ownedParameters.forEach(p => {
            const paramDefinition = this.buildParameterDefinition(p, paramFeatures, paramOptionality);
            paramDefinition.isReturn = p.direction === elements.ParameterDirectionKind.return;
            parameters.push(paramDefinition);
        });
        definition.parameters = parameters;
        return definition;
    }

    private buildParameterDefinition(p: elements.Parameter, features: opts.ParameterFeatures, optionalityModifier: opts.OptionalityModifier): ParameterDefinition {
        const tsTypeName = this.getFullTypeName(p, 'any')!;
        const definition: ParameterDefinition = { name: p.name, typeName: tsTypeName };
        const makeOptional = p.isOptional() && !!(features & opts.ParameterFeatures.OptionalModifier);

        // Description
        if ((features & opts.ParameterFeatures.JsDocDescription) && p.ownedComments) {
            definition.description = DefinitionBuilder.buildDescription(p);
        }

        // Type
        definition.typeName = tsTypeName;

        // Optionality
        definition.isOptional = makeOptional;
        definition.useQuestionToken = makeOptional && !!(optionalityModifier & opts.OptionalityModifier.QuestionToken);
        return definition;
    }

    public buildPropertyDefinition(property: elements.Property, decorators?: DecoratorDefinition[], options?: opts.PropertyOptions): PropertyDefinition {
        if (!options) options = {};

        const tsTypeName = this.getFullTypeName(property, 'any')!
        const definition: PropertyDefinition = { name: property.name, typeName: tsTypeName };
        const isOwnedByInterface = elements.isInterface(property.owner);
        const features = (options.features === undefined)
            ? (isOwnedByInterface ? opts.PropertyFeatures.AllInterfaceProperty : opts.PropertyFeatures.All)
            : options.features;

        const isOptional = property.isOptional() && !!(features & opts.PropertyFeatures.OptionalModifier);
        const optionalityModifier = (options.optionality === undefined) ? opts.OptionalityModifier.QuestionToken : options.optionality;
        const defaultValueString =
            ((features & opts.PropertyFeatures.Initializer) && !isOwnedByInterface) ?
                DefinitionBuilder.getDefaultValueString(property, tsTypeName, property.defaultValue, isOptional, optionalityModifier, options.initializePrimitiveType, options.initializeArray)
                : undefined;

        // Description
        if ((features & opts.PropertyFeatures.JsDocDescription) && property.ownedComments) {
            definition.description = DefinitionBuilder.buildDescription(property);
        }
        // Access modifier
        if ((features & opts.PropertyFeatures.AccessModifier) && !isOwnedByInterface) {
            definition.accessModifier = DefinitionBuilder.getAccessModifierString(property.visibility);
        }
        // Readonly modifier
        if ((features & opts.PropertyFeatures.ReadonlyModifier) && property.isReadOnly || property.isDerived) {
            definition.isReadonly = true;
        }
        // isStatic
        definition.isStatic = property.isStatic;

        // Optionality
        definition.isOptional = isOptional;
        if (isOptional && !!(optionalityModifier & opts.OptionalityModifier.NullKeyword)) {
            definition.hasNullUnionType = true;
        }
        // Use the definite definite assignment assertion modifier if the property is required and is not initialized        
        if (!isOptional && !defaultValueString && !isOwnedByInterface && !!(features & opts.PropertyFeatures.DefiniteAssignmentAssertionModifier)) {
            definition.useDefiniteAssignmentAssertionModifier = true;
        }

        // Default value
        definition.defaultValue = defaultValueString;
        definition.decorators = decorators;
        return definition;
    }

    private static buildImplements(cls: elements.Class, additional: string[] | undefined): string[] {
        const allNames: string[] = [];
        if (cls.interfaceRealizations) {
            allNames.push(...cls.interfaceRealizations.map(ir => ir.contract.name));
        }
        if (additional) {
            allNames.push(...additional);
        }
        return allNames;
    }

    private static buildExtends(type: elements.Classifier, additional: string[] | undefined): string[] {
        const allNames: string[] = [];
        if (type.generalizations) {
            allNames.push(...type.generalizations.map(g => g.general.name));
        }
        if (additional) {
            allNames.push(...additional);
        }
        return allNames;
    }

    private static buildDescription(type: elements.Element): string[] {
        return type.ownedComments.map(c => c.body);
    }

    public static getDefaultValueString(
        element: elements.MultiplicityElement,
        tsTypeName: string | null,
        defaultValue: elements.ValueSpecification | null,
        isOptional: boolean,
        optionalityModifier: opts.OptionalityModifier,
        initializePrimitiveType?: boolean,
        initializeArray?: boolean,
    ): string | undefined {

        const isPrimitive = TypeUtility.isPrimitiveType(tsTypeName);
        const valueIfOptional = optionalityModifier == opts.OptionalityModifier.NullKeyword ? 'null' : undefined;

        if (element.isMultivalued()) {
            // The element is an array (of a complex type or a primitive)
            if (initializeArray) {
                return isOptional ? valueIfOptional : '[]';
            }
            else return undefined;
        }

        else if (isPrimitive) {
            if (defaultValue) {
                // The type is a primitive having a default value in the model
                return elements.isLiteralString(defaultValue) ? `'${defaultValue.value}'` : defaultValue.getStringValue();
            }
            else if (initializePrimitiveType) {
                // The type is a primitive having no default value in the model
                if (isOptional) {
                    return valueIfOptional;
                }
                // A required primitive element without default
                else return TypeUtility.getPrimitiveTypeDefault(tsTypeName);
            }
        }
        else {
            // The element is not a primitive and no array, so it is a complex type.
            // If optionalityModifier is NullKeyword, use it.
            if (isOptional && optionalityModifier == opts.OptionalityModifier.NullKeyword) {
                return valueIfOptional;
            }
        }
        return undefined;
    }

    private getFullTypeName(typedElement: elements.TypedElement, fallback?: string): string | undefined {
        const typeName = this.typeNameProvider.getTypeName(typedElement) || fallback;
        if (!typeName)
            return; // no type name and no fallback

        if (elements.isMultiplicityElement(typedElement) && typedElement.isMultivalued()) {
            return `${typeName}[]`;
        }
        else return typeName;
    }

    public static getAccessModifierString(visibility: elements.VisibilityKind | null): AccessModifier | undefined {
        switch (visibility) {
            case elements.VisibilityKind.public:
                return 'public';
            case elements.VisibilityKind.private:
                return 'private';
            case elements.VisibilityKind.protected:
                return 'protected';
            default:
                return undefined;
        }
    }
}