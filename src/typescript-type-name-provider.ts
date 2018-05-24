import * as elements from '@yellicode/elements';
import { DefaultTypeNameProvider } from '@yellicode/templating';

export class TypeScriptTypeNameProvider extends DefaultTypeNameProvider {
    protected /*override*/ getDataTypeName(typedElement: elements.TypedElement): string | null {
        if (!typedElement.type)
            return null;

        const t = typedElement.type;
        if (elements.isPrimitiveBoolean(t)) return "boolean";
        if (elements.isPrimitiveInteger(t) || elements.isPrimitiveReal(t))
            return "number";
        if (elements.isPrimitiveString(t)) return "string";
        if (elements.isPrimitiveObject(t)) return "any";

        return super.getDataTypeName(typedElement);
    }
}
