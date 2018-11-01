import * as elements from '@yellicode/elements';
import { DefaultTypeNameProvider } from '@yellicode/templating';

export class TypeScriptTypeNameProvider extends DefaultTypeNameProvider {
    
    protected /*override*/ getDataTypeNameForType(type: elements.Type | null): string | null {
        if (!type)
            return null;
        
        if (elements.isPrimitiveBoolean(type)) return "boolean";
        if (elements.isPrimitiveInteger(type) || elements.isPrimitiveReal(type))
            return "number";
        if (elements.isPrimitiveString(type)) return "string";
        if (elements.isPrimitiveObject(type)) return "any";

        return super.getDataTypeNameForType(type);
    }
}
