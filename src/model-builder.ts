import * as elements from '@yellicode/elements';
import { ClassDefinition, InterfaceDefinition, EnumDefinition, EnumMemberDefinition } from './model';
import * as opts from './options';
import { TypeUtility } from './type-utility';

export class TypeScriptModelBuilder {
    public static buildClassDefinition(type: elements.Type, options?: opts.ClassOptions): ClassDefinition {
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
            definition.description = TypeScriptModelBuilder.buildDescription(type);
        }

        // Generalizations
        if (elements.isClassifier(type)) {
            if (features & opts.ClassFeatures.Generalizations) {
                definition.extends = TypeScriptModelBuilder.buildExtends(type, options.inherits);
            }

        }
        if (elements.isClass(type)) {
            // Abstract
            definition.isAbstract = type.isAbstract;
            // InterfaceRealizations
            if (features & opts.ClassFeatures.InterfaceRealizations) {
                definition.implements = TypeScriptModelBuilder.buildImplements(type, options.implements);
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

    public static buildInterfaceDefinition(type: elements.Type, options?: opts.InterfaceOptions): InterfaceDefinition {
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
            definition.description = TypeScriptModelBuilder.buildDescription(type);
        }

        // Generalizations
        if (elements.isClassifier(type)) {
            if (features & opts.InterfaceFeatures.Generalizations) {
                definition.extends = TypeScriptModelBuilder.buildExtends(type, options.inherits);
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

    public static buildEnumDefinition(type: elements.Type, options?: opts.EnumOptions): EnumDefinition {
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
            definition.description = TypeScriptModelBuilder.buildDescription(type);
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
                    member.description = TypeScriptModelBuilder.buildDescription(literal);
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
        typeName: string | null,
        defaultValue: elements.ValueSpecification | null,
        isOptional: boolean,
        optionalityModifier: opts.OptionalityModifier,
        initializePrimitiveType?: boolean,
        initializeArray?: boolean,
    ): string | null {

        const isPrimitive = TypeUtility.isPrimitiveType(typeName);      
        const valueIfOptional: string | null = optionalityModifier == opts.OptionalityModifier.NullKeyword ? 'null' : null;

        if (element.isMultivalued()) {       
            // The element is an array (of a complex type or a primitive)
            if (initializeArray) {
                return isOptional ? valueIfOptional : '[]';
            }
            else return null;
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
                else return TypeUtility.getPrimitiveTypeDefault(typeName);
            }
        }
        else {
            // The element is not a primitive and no array, so it is a complex type.
            // If optionalityModifier is NullKeyword, use it.
            if (isOptional && optionalityModifier == opts.OptionalityModifier.NullKeyword) {
                return valueIfOptional;
            }
        }
        return null;
    }
}