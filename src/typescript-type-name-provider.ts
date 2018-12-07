import * as elements from '@yellicode/elements';
import { DefaultTypeNameProvider } from '@yellicode/templating';

export class TypeScriptTypeNameProvider extends DefaultTypeNameProvider {

    protected /*override*/ getTypeNameForType(type: elements.Type | null, isDataType: boolean): string | null {
        if (!type)
            return null;

        if (isDataType) {
            if (elements.isPrimitiveBoolean(type)) return "boolean";
            if (elements.isPrimitiveInteger(type) || elements.isPrimitiveReal(type))
                return "number";
            if (elements.isPrimitiveString(type)) return "string";
            if (elements.isPrimitiveObject(type)) return "any";
        }

        return super.getTypeNameForType(type, isDataType);
    }
}
