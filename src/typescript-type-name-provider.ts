import * as model from '@yellicode/model';
import { DefaultTypeNameProvider } from '@yellicode/templating';

export class TypeScriptTypeNameProvider extends DefaultTypeNameProvider {
    protected /*override*/ getPrimitiveTypeName(type: model.PrimitiveType): string | null {
        if (model.isPrimitiveBoolean(type)) return "boolean";
        if (model.isPrimitiveInteger(type) || model.isPrimitiveReal(type))
            return "number";

        if (model.isPrimitiveString(type)) return "string";
        if (model.isPrimitiveObject(type)) return "any";
        return super.getPrimitiveTypeName(type);
    }
}
