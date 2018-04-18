import * as model from '@yellicode/model';
import { DefaultTypeNameProvider } from '@yellicode/templating';

export class TypeScriptTypeNameProvider extends DefaultTypeNameProvider {
    protected /*override*/ getDataTypeName(typedElement: model.TypedElement): string | null {
        if (!typedElement || !typedElement.type)
            return null;

        const t = typedElement.type;
        if (model.isPrimitiveBoolean(t)) return "boolean";
        if (model.isPrimitiveInteger(t) || model.isPrimitiveReal(t))
            return "number";
        if (model.isPrimitiveString(t)) return "string";
        if (model.isPrimitiveObject(t)) return "any";

        return super.getDataTypeName(typedElement);
    }
}
