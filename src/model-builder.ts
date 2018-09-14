import * as elements from '@yellicode/elements';
import { ClassDefinition, InterfaceDefinition } from './model';
import * as opts from './options';

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
            definition.description = type.ownedComments.map(c => c.body).join(' ');
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
            definition.description = type.ownedComments.map(c => c.body).join(' ');
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
}